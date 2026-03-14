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
import { useCamera } from "#/hooks/use-camera";
import { useMediaRecorder } from "#/hooks/use-media-recorder";
import { useFrameCapture } from "#/hooks/useFrameCapture";
import { useDriverEventLogger } from "#/hooks/useDriverEventLogger";
import { useCrashDetection, requestMotionPermission } from "#/hooks/use-crash-detection";
import { useSpeed } from "#/hooks/use-speed";
import { useCameraDevices } from "#/hooks/use-camera-devices";
import { usePollyTTS } from "#/lib/use-polly-tts";
import { driveSessionStore } from "#/hooks/useDriveSession";
import { client } from "#/server/orpc/client";
import { getSupportedMimeType } from "#/lib/media-utils";
import { SaveRecordingDialog } from "#/components/SaveRecordingDialog";
import { CameraPicker } from "#/components/driver-monitor/CameraPicker";
import type { PendingRecording } from "#/hooks/useRecording";

const MAX_RECORD_SECS = 5 * 60;
const ALARM_SRC = "/denielcz-speed-limit-violation-alert-463066.mp3";

function Sparkline({ values, colorClass = "text-white" }: { values: number[]; colorClass?: string }) {
  if (values.length < 2) return null;
  const width = 80, height = 24;
  let min = Math.min(...values), max = Math.max(...values);
  if (!Number.isFinite(min) || !Number.isFinite(max)) return null;
  if (min === max) { min -= 0.5; max += 0.5; }
  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * width;
    const y = height - ((v - min) / (max - min)) * height;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={`h-5 w-20 ${colorClass}`} preserveAspectRatio="none">
      <polyline fill="none" stroke="currentColor" strokeWidth="1.5" points={points} />
    </svg>
  );
}

export default function RecordView() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const alarmRef = useRef<HTMLAudioElement | null>(null);
  const navigate = useNavigate();

  // Camera device selection
  const devices = useCameraDevices();
  const [driverDeviceId, setDriverDeviceId] = useState<string | null>(null);
  const [roadDeviceId, setRoadDeviceId] = useState<string | null>(null);
  const [activeCamera, setActiveCamera] = useState<"front" | "back">("front");

  // Front camera stream (exposed from MediaPipe init for dual recording)
  const [frontStream, setFrontStream] = useState<MediaStream | null>(null);
  const [frontReady, setFrontReady] = useState(false);

  // Back camera via useCamera (waits for front, supports device selection)
  const roadSource = roadDeviceId ? { deviceId: roadDeviceId } : { facingMode: "environment" as const };
  const backCamera = useCamera(roadSource, frontReady);

  // Dual recording
  const frontRecorder = useMediaRecorder(frontStream);
  const backRecorder = useMediaRecorder(backCamera.stream);
  const isRecording = frontRecorder.isRecording;

  // State
  const [pendingRec, setPendingRec] = useState<PendingRecording | null>(null);
  const [driverState, setDriverState] = useState<DriverState>("NO_FACE");
  const [metrics, setMetrics] = useState<SmoothedMetrics>({ ear: 0, yaw: 1, pitch: 0.7 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recSeconds, setRecSeconds] = useState(0);
  const [driveSummary, setDriveSummary] = useState<string | null>(null);
  const [ending, setEnding] = useState(false);
  const [sessionScore, setSessionScore] = useState<number | null>(null);
  const [liveLog, setLiveLog] = useState<string[]>([]);

  // iOS + debugAccel
  const [isIOS, setIsIOS] = useState(false);
  const [debugAccel, setDebugAccel] = useState(false);
  const [motionPermissionHintShown, setMotionPermissionHintShown] = useState(false);
  const [accelSamples, setAccelSamples] = useState<{ g: number; ax: number; ay: number; az: number }[]>([]);

  const sessionIdRef = useRef<string | null>(null);
  const recSecondsRef = useRef(0);
  const lastTTSWarningRef = useRef(0);
  const lastSessionIdRef = useRef<string | null>(null);
  const handleStopRecordingRef = useRef<() => void>(() => {});

  const addLog = useCallback((msg: string) => {
    const ts = new Date().toLocaleTimeString("en-AU", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setLiveLog((prev) => [...prev.slice(-19), `[${ts}] ${msg}`]);
  }, []);

  // Detect iOS + debugAccel URL param
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const search = new URLSearchParams(window.location.search);
      setDebugAccel(search.get("debugAccel") === "1");
      if (typeof navigator !== "undefined") {
        setIsIOS(/iPhone|iPad|iPod/i.test(navigator.userAgent));
      }
    } catch {
      setDebugAccel(false);
    }
  }, []);

  const { speak } = usePollyTTS();
  useDriverEventLogger(driverState, metrics, "front");

  // GPS speed for crash detection context
  const { speedKmh } = useSpeed();

  // Crash detection (better accuracy than useCollisionDetection)
  const handleCrash = useCallback(async ({ g }: { g: number; speedKmh: number | null }) => {
    addLog(`CRASH: ${g.toFixed(1)}g impact detected`);
    const sessionId = sessionIdRef.current;
    if (sessionId) {
      await client.logDriverEvent({
        sessionId,
        elapsedSec: recSecondsRef.current,
        type: "crash",
        summary: `Collision detected - ${g.toFixed(1)}g impact`,
        severity: "critical",
        camera: "front",
        metadata: { gForce: g },
      }).catch(console.error);
    }
    navigate({ to: "/emergency" as any });
  }, [addLog, navigate]);

  const crash = useCrashDetection({ speedKmh, onCrash: handleCrash });

  // Track accel samples for debug sparklines
  useEffect(() => {
    if (!debugAccel || crash.currentG == null) return;
    setAccelSamples((prev) => [
      ...prev.slice(-79),
      { g: crash.currentG!, ax: crash.ax ?? 0, ay: crash.ay ?? 0, az: crash.az ?? 0 },
    ]);
  }, [debugAccel, crash.currentG, crash.ax, crash.ay, crash.az]);

  // TTS alerts for driver warnings
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
    if (msg) speak(msg).catch(() => {});
  }, [driverState, isRecording, speak]);

  // AI road frame analysis
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
    const id = setInterval(() => {
      setRecSeconds((s) => {
        const next = s + 1;
        recSecondsRef.current = next;
        if (next >= MAX_RECORD_SECS) {
          handleStopRecordingRef.current();
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isRecording]);

  // Recording handlers
  const handleStartRecording = useCallback(() => {
    frontRecorder.startRecording();
    backRecorder.startRecording();
    addLog("Starting session...");
    client.startSession({}).then(({ sessionId }) => {
      sessionIdRef.current = sessionId;
      driveSessionStore.setState(() => ({ sessionId, startedAt: Date.now() }));
      addLog(`Session started: ${sessionId.slice(0, 8)}...`);
    }).catch((err) => addLog(`Session start FAILED: ${err}`));
  }, [frontRecorder, backRecorder, addLog]);

  const handleStopRecording = useCallback(async () => {
    const duration = frontRecorder.duration || backRecorder.duration || 0;
    const [frontBlob, backBlob] = await Promise.all([
      frontRecorder.stopRecording(),
      backRecorder.stopRecording(),
    ]);

    const sessionId = sessionIdRef.current;
    if (sessionId) {
      lastSessionIdRef.current = sessionId;
      setEnding(true);
      addLog("Ending session, generating summary...");
      try {
        const { summary, score } = await client.endSession({ sessionId });
        setDriveSummary(summary);
        setSessionScore(score ?? null);
        addLog(`Session ended: score=${score}, events logged`);
      } catch (err) {
        addLog(`End session FAILED: ${err}`);
      } finally {
        setEnding(false);
        sessionIdRef.current = null;
        driveSessionStore.setState(() => ({ sessionId: null, startedAt: null }));
      }
    }

    const blob = backBlob ?? frontBlob;
    if (blob) {
      setPendingRec({ blob, duration, mimeType: getSupportedMimeType() || "video/webm" });
    }
  }, [frontRecorder, backRecorder, addLog]);

  // Keep ref up-to-date for auto-stop timer
  handleStopRecordingRef.current = handleStopRecording;

  // MediaPipe face detection + front camera init
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

        const videoConstraint = driverDeviceId
          ? { deviceId: { exact: driverDeviceId }, width: { ideal: 1280 }, height: { ideal: 720 } }
          : { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } };
        stream = await navigator.mediaDevices.getUserMedia({ video: videoConstraint });
        if (disposed) { stream.getTracks().forEach((t) => t.stop()); return; }

        setFrontStream(stream);
        setFrontReady(true);

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
      setFrontStream(null);
      setFrontReady(false);
      cancelAnimationFrame(animFrameId);
      if (stream) stream.getTracks().forEach((t) => t.stop());
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (landmarker) (landmarker as any).close();
      alarmRef.current?.pause();
      alarmRef.current = null;
    };
  }, [driverDeviceId]);

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

      {/* Video window */}
      <div className="relative mx-3 mb-2 mt-1 h-[58vh] flex-none overflow-hidden rounded-2xl bg-zinc-900">
        {/* Crash banner */}
        {crash.isCrashLikely && (
          <div className="absolute inset-x-0 top-0 z-30 flex justify-center px-4 pt-3">
            <div className="flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-lg">
              <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
              Crash detected — opening emergency screen…
            </div>
          </div>
        )}

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

        {/* REC indicator */}
        {isRecording && (
          <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 backdrop-blur-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
            <span className="font-mono text-xs font-bold text-white">REC {recMins}:{recSecs}</span>
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

        {/* Metrics strip */}
        {!loading && (
          <div className="absolute bottom-0 left-0 right-0 z-10 flex items-center gap-4 bg-gradient-to-t from-black/80 to-transparent px-4 pb-3 pt-8 pr-16">
            <span className="text-[11px] font-semibold text-white/70">Eyes <span className="text-white">{eyePct}%</span></span>
            <span className="text-[11px] font-semibold text-white/70">State <span style={{ color: display.color }}>{display.label}</span></span>
            <span className="text-[11px] font-semibold text-white/70">Head <span className="text-white">{headDir}</span></span>
          </div>
        )}

        {/* Camera picker (only shown when 2+ devices detected) */}
        {!loading && (
          <CameraPicker
            devices={devices}
            driverDeviceId={driverDeviceId}
            roadDeviceId={roadDeviceId}
            onDriverChange={setDriverDeviceId}
            onRoadChange={setRoadDeviceId}
          />
        )}

        {/* Switch camera */}
        <button
          type="button"
          onClick={() => setActiveCamera((c) => (c === "front" ? "back" : "front"))}
          className="absolute bottom-3 right-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-transform active:scale-95"
        >
          <RefreshCw size={18} />
        </button>

        {/* Debug accelerometer panel (?debugAccel=1) */}
        {debugAccel && crash.currentG !== null && (
          <div className="absolute left-3 bottom-16 z-20 max-w-[60%] rounded-xl bg-black/80 px-3 py-2 text-[10px] text-white/80 backdrop-blur-md">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold uppercase tracking-wide text-white/60">Accel Debug</span>
              <span className="font-mono text-white">{crash.currentG.toFixed(2)}g</span>
            </div>
            <div className="mt-1 grid grid-cols-2 gap-x-2 gap-y-0.5 font-mono">
              <span>ax: {crash.ax?.toFixed(2)}</span>
              <span>ay: {crash.ay?.toFixed(2)}</span>
              <span>az: {crash.az?.toFixed(2)}</span>
              <span>speed: {speedKmh != null ? `${speedKmh.toFixed(1)} km/h` : "–"}</span>
            </div>
            {isIOS && !motionPermissionHintShown && (
              <div className="mt-1 rounded bg-white/5 px-2 py-1 text-[9px] leading-snug text-white/70">
                <button
                  type="button"
                  className="underline"
                  onClick={async () => {
                    const result = await requestMotionPermission();
                    if (result !== "granted") setMotionPermissionHintShown(true);
                  }}
                >
                  Tap to enable motion sensors on iOS
                </button>
              </div>
            )}
            {accelSamples.length > 1 && (
              <div className="mt-2 space-y-1.5">
                {[
                  { label: "g", values: accelSamples.map((s) => s.g) },
                  { label: "ax", values: accelSamples.map((s) => s.ax) },
                  { label: "ay", values: accelSamples.map((s) => s.ay) },
                  { label: "az", values: accelSamples.map((s) => s.az) },
                ].map(({ label, values }) => (
                  <div key={label} className="flex items-center justify-between gap-2">
                    <span className="text-[9px] text-white/50">{label}</span>
                    <Sparkline values={values} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-none flex-col items-center gap-3 pb-6 pt-2">
        <button
          type="button"
          onClick={() => isRecording ? handleStopRecording() : handleStartRecording()}
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

        {/* Live log */}
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
            <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 mb-2">AI Drive Summary</p>
            <p className="text-sm leading-relaxed text-zinc-200">{driveSummary}</p>
            <button type="button" onClick={() => setDriveSummary(null)} className="mt-4 w-full rounded-xl bg-white/10 py-3 text-sm font-semibold text-white">Dismiss</button>
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
          onDone={() => { setPendingRec(null); setSessionScore(null); lastSessionIdRef.current = null; }}
        />
      )}
    </div>
  );
}
