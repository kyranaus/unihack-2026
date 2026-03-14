// src/components/RecordView.tsx
import { useEffect, useRef, useState, useCallback } from "react";
import { RefreshCw } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import type { DriverState, SmoothedMetrics } from "#/lib/driver-monitor-utils";
import {
  CONFIG,
  FACE_LANDMARKER_MODEL_URL,
  MEDIAPIPE_WASM_URL,
  STATE_DISPLAY,
  computeEAR,
  computeHeadPose,
  drawOverlay,
  ema,
  getHeadDirection,
} from "#/lib/driver-monitor-utils";
import { useRecording } from "#/hooks/useRecording";
import { useFrameCapture } from "#/hooks/useFrameCapture";
import { useDriverEventLogger } from "#/hooks/useDriverEventLogger";
import { useCollisionDetection } from "#/hooks/useCollisionDetection";
import { usePollyTTS } from "#/lib/use-polly-tts";
import { useBackCamera } from "#/hooks/useBackCamera";
import { driveSessionStore } from "#/hooks/useDriveSession";
import { client } from "#/server/orpc/client";
import { SaveRecordingDialog } from "#/components/SaveRecordingDialog";

const MAX_RECORD_SECS = 5 * 60;

const ALARM_SRC = "/denielcz-speed-limit-violation-alert-463066.mp3";

export default function RecordView() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const alarmRef = useRef<HTMLAudioElement | null>(null);
  const navigate = useNavigate();

  const { start: startRec, stop: stopRec, pending: pendingRec, clearPending } = useRecording(streamRef);
  const { speak } = usePollyTTS();
  const backCamera = useBackCamera();

  useEffect(() => {
    backCamera.startCamera();
    return () => backCamera.stopCamera();
  }, []);

  const [driverState, setDriverState] = useState<DriverState>("NO_FACE");
  const [metrics, setMetrics] = useState<SmoothedMetrics>({ ear: 0, yaw: 1, pitch: 0.7 });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recSeconds, setRecSeconds] = useState(0);
  const [activeCamera, setActiveCamera] = useState<"front" | "back">("front");
  const [driveSummary, setDriveSummary] = useState<string | null>(null);
  const [ending, setEnding] = useState(false);

  const sessionIdRef = useRef<string | null>(null);
  const recSecondsRef = useRef(0);
  const lastTTSWarningRef = useRef(0);

  const [sessionScore, setSessionScore] = useState<number | null>(null);
  const [liveLog, setLiveLog] = useState<string[]>([]);
  const lastSessionIdRef = useRef<string | null>(null);

  const addLog = useCallback((msg: string) => {
    const ts = new Date().toLocaleTimeString("en-AU", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setLiveLog((prev) => [...prev.slice(-19), `[${ts}] ${msg}`]);
  }, []);

  useDriverEventLogger(driverState, metrics, "front");

  // TTS alerts for driver warnings (only if AWS Polly is configured)
  useEffect(() => {
    if (!isRecording || driverState === "ALERT" || driverState === "NO_FACE") return;
    const now = Date.now();
    if (now - lastTTSWarningRef.current < 15000) return;
    lastTTSWarningRef.current = now;

    const messages: Record<string, string> = {
      DROWSY: "Warning. You appear drowsy. Please stay alert.",
      DISTRACTED: "Eyes on the road. You appear distracted.",
      ASLEEP: "Wake up! Pull over immediately.",
    };
    const msg = messages[driverState];
    if (msg) {
      speak(msg).catch(() => {});
    }
  }, [driverState, isRecording, speak, addLog]);

  // Collision detection
  const handleCollision = useCallback(async (gForce: number) => {
    addLog(`CRASH: ${gForce.toFixed(1)}g impact detected`);
    const sessionId = sessionIdRef.current;
    if (sessionId) {
      await client.logDriverEvent({
        sessionId,
        elapsedSec: recSecondsRef.current,
        type: "crash",
        summary: `Collision detected - ${gForce.toFixed(1)}g impact`,
        severity: "critical",
        camera: "front",
        metadata: { gForce },
      }).catch(console.error);
    }
    navigate({ to: "/emergency" as any });
  }, [navigate]);

  useCollisionDetection(isRecording, handleCollision);

  // Frame capture for AI road analysis
  const handleFrameBatch = useCallback(async (frames: string[]) => {
    const sessionId = sessionIdRef.current;
    if (!sessionId) return;
    try {
      const result = await client.analyseRoadFrames({
        sessionId,
        elapsedSec: recSecondsRef.current,
        frames,
        camera: "front",
      });
      addLog(`AI: [${result.severity}] ${result.summary}`);
    } catch (err) {
      addLog(`AI ERROR: ${err instanceof Error ? err.message : "analysis failed"}`);
    }
  }, [addLog]);

  useFrameCapture(videoRef, isRecording, handleFrameBatch);

  // REC timer + auto-stop at 5 min
  useEffect(() => {
    if (!isRecording) { setRecSeconds(0); recSecondsRef.current = 0; return; }
    const id = setInterval(() => setRecSeconds((s) => {
      const next = s + 1;
      recSecondsRef.current = next;
      if (next >= MAX_RECORD_SECS) { setIsRecording(false); return 0; }
      return next;
    }), 1000);
    return () => clearInterval(id);
  }, [isRecording]);

  // Start/stop MediaRecorder + AI session when isRecording changes
  useEffect(() => {
    if (isRecording) {
      startRec();
      addLog("Starting session...");
      client.startSession({}).then(({ sessionId }) => {
        sessionIdRef.current = sessionId;
        driveSessionStore.setState(() => ({ sessionId, startedAt: Date.now() }));
        addLog(`Session started: ${sessionId.slice(0, 8)}...`);
      }).catch((err) => { addLog(`Session start FAILED: ${err}`); console.error(err); });
    } else {
      stopRec();
      const sessionId = sessionIdRef.current;
      if (sessionId) {
        lastSessionIdRef.current = sessionId;
        setEnding(true);
        addLog("Ending session, generating summary...");
        client.endSession({ sessionId }).then(({ summary, score }) => {
          setDriveSummary(summary);
          setSessionScore(score ?? null);
          addLog(`Session ended: score=${score}, events logged`);
        }).catch((err) => { addLog(`End session FAILED: ${err}`); console.error(err); }).finally(() => {
          setEnding(false);
          sessionIdRef.current = null;
          driveSessionStore.setState(() => ({ sessionId: null, startedAt: null }));
        });
      }
    }
  }, [isRecording, startRec, stopRec]);

  useEffect(() => {
    let animFrameId: number;
    let stream: MediaStream | null = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let landmarker: any = null;
    let disposed = false;

    const s = {
      smoothedEAR: 0.3,
      smoothedYaw: 1.0,
      smoothedPitch: 0.7,
      eyesClosedSince: null as number | null,
      headTurnedSince: null as number | null,
      alarmPlaying: false,
      noFaceFrames: 0,
      currentState: "NO_FACE" as DriverState,
      lastRenderTime: 0,
    };

    async function init() {
      try {
        const { FaceLandmarker, FilesetResolver } = await import("@mediapipe/tasks-vision");
        if (disposed) return;
        const vision = await FilesetResolver.forVisionTasks(MEDIAPIPE_WASM_URL);
        if (disposed) return;
        landmarker = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: FACE_LANDMARKER_MODEL_URL, delegate: "GPU" },
          runningMode: "VIDEO",
          numFaces: 1,
          outputFaceBlendshapes: false,
          outputFacialTransformationMatrixes: false,
        });
        if (disposed) { landmarker.close(); return; }
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
        });
        if (disposed) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        const video = videoRef.current;
        if (!video) return;
        video.srcObject = stream;
        await video.play();
        setLoading(false);
        detect();
      } catch (err) {
        if (!disposed) {
          setError(err instanceof Error ? err.message : "Failed to initialize");
          setLoading(false);
        }
      }
    }

    function detect() {
      if (disposed) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState < 2 || !landmarker) {
        animFrameId = requestAnimationFrame(detect);
        return;
      }
      const now = performance.now();
      const ctx = canvas.getContext("2d");
      if (!ctx) { animFrameId = requestAnimationFrame(detect); return; }


      const results = landmarker.detectForVideo(video, now);
      const hasFace = results.faceLandmarks && results.faceLandmarks.length > 0;
      const landmarks = hasFace ? results.faceLandmarks[0] : null;

      if (!hasFace) {
        s.noFaceFrames++;
        if (s.noFaceFrames > CONFIG.NO_FACE_FRAME_THRESHOLD) {
          s.currentState = "NO_FACE";
          s.eyesClosedSince = null;
          s.headTurnedSince = null;
        }
      } else {
        s.noFaceFrames = 0;
        const ear = computeEAR(landmarks!);
        const pose = computeHeadPose(landmarks!);
        s.smoothedEAR = ema(ear.average, s.smoothedEAR, CONFIG.EAR_SMOOTHING);
        s.smoothedYaw = ema(pose.yawRatio, s.smoothedYaw, CONFIG.HEAD_SMOOTHING);
        s.smoothedPitch = ema(pose.pitchRatio, s.smoothedPitch, CONFIG.HEAD_SMOOTHING);

        if (s.smoothedEAR < CONFIG.EAR_THRESHOLD) {
          if (!s.eyesClosedSince) s.eyesClosedSince = now;
        } else {
          s.eyesClosedSince = null;
        }
        const turned =
          Math.abs(s.smoothedYaw - 1.0) > CONFIG.YAW_THRESHOLD ||
          s.smoothedPitch > CONFIG.PITCH_DOWN_THRESHOLD ||
          s.smoothedPitch < CONFIG.PITCH_UP_THRESHOLD;
        if (turned) {
          if (!s.headTurnedSince) s.headTurnedSince = now;
        } else {
          s.headTurnedSince = null;
        }

        if (s.eyesClosedSince && now - s.eyesClosedSince >= CONFIG.DROWSY_TIME_MS) {
          s.currentState = "DROWSY";
        } else if (s.headTurnedSince && now - s.headTurnedSince >= CONFIG.DISTRACTED_TIME_MS) {
          s.currentState = "DISTRACTED";
        } else {
          s.currentState = "ALERT";
        }

        if (s.currentState === "DROWSY" && !s.alarmPlaying) {
          s.alarmPlaying = true;
          if (!alarmRef.current) {
            alarmRef.current = new Audio(ALARM_SRC);
            alarmRef.current.loop = true;
          }
          alarmRef.current.currentTime = 0;
          alarmRef.current.play();
        } else if (s.currentState !== "DROWSY" && s.alarmPlaying) {
          s.alarmPlaying = false;
          alarmRef.current?.pause();
        }
      }

      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      if (cw > 0 && ch > 0 && (canvas.width !== cw || canvas.height !== ch)) {
        canvas.width = cw;
        canvas.height = ch;
      }
      const vw = video.videoWidth || 1;
      const vh = video.videoHeight || 1;
      const coverScale = Math.max(cw / vw, ch / vh);
      const ox = (vw * coverScale - cw) / 2;
      const oy = (vh * coverScale - ch) / 2;
      ctx.clearRect(0, 0, cw, ch);
      ctx.save();
      ctx.translate(-ox, -oy);
      ctx.scale(coverScale, coverScale);
      drawOverlay(ctx, vw, vh, landmarks, s.smoothedEAR < CONFIG.EAR_THRESHOLD, true);
      ctx.restore();

      if (now - s.lastRenderTime > CONFIG.RENDER_INTERVAL_MS) {
        setDriverState(s.currentState);
        setMetrics({ ear: s.smoothedEAR, yaw: s.smoothedYaw, pitch: s.smoothedPitch });

        s.lastRenderTime = now;
      }
      animFrameId = requestAnimationFrame(detect);
    }

    init();
    return () => {
      disposed = true;
      streamRef.current = null;
      cancelAnimationFrame(animFrameId);
      if (stream) stream.getTracks().forEach((t) => t.stop());
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (landmarker) (landmarker as any).close();
      alarmRef.current?.pause();
      alarmRef.current = null;
    };
  }, []);

  const display = STATE_DISPLAY[driverState];
  const isWarning = driverState !== "ALERT";
  const eyePct = Math.min(100, Math.round((metrics.ear / 0.32) * 100));
  const headDir = getHeadDirection(metrics.yaw, metrics.pitch);

  const recMins = Math.floor(recSeconds / 60).toString().padStart(2, "0");
  const recSecs = (recSeconds % 60).toString().padStart(2, "0");

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 bg-black p-6">
        <div className="rounded-2xl border border-red-800 bg-red-950 p-6 text-center">
          <p className="text-lg font-semibold text-red-400">Camera Error</p>
          <p className="mt-2 text-sm text-red-300">{error}</p>
          <p className="mt-2 text-xs text-white/40">
            Allow camera access and ensure no other app is using the webcam.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-dvh flex-col bg-black">
      {/* Title */}
      <div
        className="flex flex-none items-center justify-center pb-2"
        style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}
      >
        <span className="text-base font-bold tracking-wide text-white">Record</span>
      </div>

      {/* Video window — takes up most of screen height, padded from all edges */}
      <div className="relative mx-3 mb-2 mt-1 h-[58vh] flex-none overflow-hidden rounded-2xl bg-zinc-900">
        {/* Back camera — main or PiP */}
        <video
          ref={backCamera.videoRef}
          className={activeCamera === "back"
            ? "absolute inset-0 z-0 h-full w-full object-cover"
            : "absolute top-3 left-3 z-10 h-28 w-20 rounded-xl object-cover ring-2 ring-white/30"}
          playsInline
          muted
        />

        {/* Front camera — main or PiP */}
        <video
          ref={videoRef}
          className={activeCamera === "front"
            ? "absolute inset-0 z-0 h-full w-full object-cover"
            : "absolute top-3 left-3 z-10 h-28 w-20 rounded-xl object-cover ring-2 ring-white/30"}
          style={{ transform: "scaleX(-1)" }}
          playsInline
          muted
        />
        {/* Face detection canvas — always follows front camera */}
        <canvas
          ref={canvasRef}
          className={activeCamera === "front"
            ? "absolute inset-0 z-1 h-full w-full"
            : "absolute top-3 left-3 z-11 h-28 w-20 rounded-xl"}
          style={{ transform: "scaleX(-1)" }}
        />

        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            <p className="mt-4 text-sm font-medium text-white">Loading face detection…</p>
            <p className="mt-1 text-xs text-white/40">First load may take a few seconds</p>
          </div>
        )}

        {/* REC indicator — top-left */}
        {isRecording && (
          <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 backdrop-blur-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
            <span className="font-mono text-xs font-bold text-white">
              REC {recMins}:{recSecs}
            </span>
          </div>
        )}

        {/* Warning banner */}
        {!loading && isWarning && display.warning && (
          <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
            <div
              className="animate-pulse rounded-2xl border-2 px-6 py-3 text-center text-xl font-black tracking-widest backdrop-blur-md"
              style={{ borderColor: display.color, color: display.color, backgroundColor: display.bg }}
            >
              {display.warning}
            </div>
          </div>
        )}

        {/* Metrics strip — bottom of video */}
        {!loading && (
          <div className="absolute bottom-0 left-0 right-0 z-10 flex items-center gap-4 bg-gradient-to-t from-black/80 to-transparent px-4 pb-3 pt-8 pr-16">
            <span className="text-[11px] font-semibold text-white/70">Eyes <span className="text-white">{eyePct}%</span></span>
            <span className="text-[11px] font-semibold text-white/70">State <span style={{ color: display.color }}>{display.label}</span></span>
            <span className="text-[11px] font-semibold text-white/70">Head <span className="text-white">{headDir}</span></span>
          </div>
        )}

        {/* Switch camera — bottom-right */}
        <button
          type="button"
          onClick={() => setActiveCamera((c) => (c === "front" ? "back" : "front"))}
          className="absolute bottom-3 right-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-transform active:scale-95"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-none flex-col items-center gap-3 pb-6 pt-2">
        {/* Record button */}
        <button
          type="button"
          onClick={() => setIsRecording((r) => !r)}
          disabled={loading}
          className={`flex h-20 w-20 items-center justify-center rounded-full border-4 border-white transition-transform active:scale-95 disabled:opacity-30 ${isRecording ? "animate-pulse" : ""}`}
          aria-label={isRecording ? "Stop recording" : "Start recording"}
        >
          <span
            className={`bg-red-500 transition-all duration-200 ${isRecording ? "h-8 w-8 rounded-lg" : "h-14 w-14 rounded-full"}`}
          />
        </button>

        {/* Front · Back toggle */}
        <div className="flex items-center rounded-full bg-white/10 p-0.5">
          {(["front", "back"] as const).map((cam) => (
            <button
              key={cam}
              type="button"
              onClick={() => setActiveCamera(cam)}
              className={`rounded-full px-5 py-1.5 text-xs font-semibold capitalize transition-colors ${
                activeCamera === cam ? "bg-white text-black" : "text-white/60"
              }`}
            >
              {cam}
            </button>
          ))}
        </div>

        {/* Live AI log */}
        {liveLog.length > 0 && (
          <div className="mx-3 w-full max-h-24 overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-900/90 px-3 py-2">
            <p className="mb-1 text-[9px] font-semibold uppercase tracking-widest text-zinc-600">Live Log</p>
            {liveLog.map((line, i) => (
              <p key={i} className="font-mono text-[10px] leading-relaxed text-zinc-400">{line}</p>
            ))}
          </div>
        )}
      </div>

      {/* Drive summary overlay */}
      {driveSummary && !isRecording && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="rounded-2xl border border-white/10 bg-zinc-900 px-6 py-5 mx-4 w-full max-w-sm">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 mb-2">
              AI Drive Summary
            </p>
            <p className="text-sm leading-relaxed text-zinc-200">{driveSummary}</p>
            <button
              type="button"
              onClick={() => setDriveSummary(null)}
              className="mt-4 w-full rounded-xl bg-white/10 py-3 text-sm font-semibold text-white"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {ending && (
        <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/80">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-600 border-t-white" />
            <p className="text-sm text-zinc-400">Generating drive summary...</p>
          </div>
        </div>
      )}

      {pendingRec && (
        <SaveRecordingDialog
          pending={pendingRec}
          sessionId={lastSessionIdRef.current}
          score={sessionScore}
          onDone={() => { clearPending(); setSessionScore(null); lastSessionIdRef.current = null; }}
        />
      )}
    </div>
  );
}

