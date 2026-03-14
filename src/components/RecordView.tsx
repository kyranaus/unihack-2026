// src/components/RecordView.tsx
import { useCallback, useEffect, useRef, useState } from "react";
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
import { useMediaRecorder } from "#/hooks/use-media-recorder";
import { useSpeed } from "#/hooks/use-speed";
import { useCrashDetection, requestMotionPermission } from "#/hooks/use-crash-detection";
import { useCameraDevices } from "#/hooks/use-camera-devices";
import { CameraPicker } from "#/components/driver-monitor/CameraPicker";
import { ViewModeToggle } from "#/components/driver-monitor/ViewModeToggle";
import type { ViewMode } from "#/components/driver-monitor/ViewModeToggle";
import { SaveRecordingDialog } from "#/components/SaveRecordingDialog";

const MAX_RECORD_SECS = 5 * 60;
const EAR_OPEN_REF = 0.32;
const ALARM_SRC = "/denielcz-speed-limit-violation-alert-463066.mp3";

function Sparkline({ values, colorClass = "text-primary" }: { values: number[]; colorClass?: string }) {
  if (!values.length) return null;
  const width = 80;
  const height = 24;
  let min = Math.min(...values);
  let max = Math.max(...values);
  if (!Number.isFinite(min) || !Number.isFinite(max)) return null;
  if (min === max) { min -= 0.5; max += 0.5; }
  const points = values.map((v, i) => {
    const x = values.length === 1 ? width : (i / (values.length - 1)) * width;
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
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const backVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const alarmRef = useRef<HTMLAudioElement | null>(null);

  const [backStream, setBackStream] = useState<MediaStream | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("face");
  const [driverDeviceId, setDriverDeviceId] = useState<string | null>(null);
  const [roadDeviceId, setRoadDeviceId] = useState<string | null>(null);
  const [debugAccel, setDebugAccel] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [motionPermissionHintShown, setMotionPermissionHintShown] = useState(false);
  const [accelSamples, setAccelSamples] = useState<{ g: number; ax: number; ay: number; az: number }[]>([]);

  const devices = useCameraDevices();
  const { start: startRec, stop: stopRec, pending: pendingRec, clearPending } = useRecording(streamRef);
  const backRecorder = useMediaRecorder(backStream);

  const [driverState, setDriverState] = useState<DriverState>("NO_FACE");
  const [metrics, setMetrics] = useState<SmoothedMetrics>({ ear: 0, yaw: 1, pitch: 0.7 });
  const [fps, setFps] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recSeconds, setRecSeconds] = useState(0);

  const { speedKmh } = useSpeed();

  const crash = useCrashDetection({
    speedKmh,
    onCrash: useCallback(() => {
      try { window.alert("Crash detected. Opening emergency screen…"); } catch { /* ignore */ }
      try { window.sessionStorage.setItem("dashcam.crashTriggered", "1"); } catch { /* ignore */ }
      navigate({ to: "/emergency" });
    }, [navigate]),
  });

  // Init debug mode + iOS detection
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      setDebugAccel(new URLSearchParams(window.location.search).get("debugAccel") === "1");
      if (typeof navigator !== "undefined") {
        setIsIOS(/iPhone|iPad|iPod/i.test(navigator.userAgent));
      }
    } catch { /* ignore */ }
  }, []);

  // Collect accel samples for debug graphs
  useEffect(() => {
    if (!debugAccel || crash.currentG == null || crash.ax == null || crash.ay == null || crash.az == null) return;
    setAccelSamples((prev) => [...prev, { g: crash.currentG!, ax: crash.ax!, ay: crash.ay!, az: crash.az! }].slice(-80));
  }, [debugAccel, crash.currentG, crash.ax, crash.ay, crash.az]);

  // Back camera
  useEffect(() => {
    let disposed = false;
    let stream: MediaStream | null = null;

    async function start() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: roadDeviceId ? { deviceId: { exact: roadDeviceId } } : { facingMode: "environment" },
        });
        if (disposed) { stream.getTracks().forEach(t => t.stop()); return; }
        setBackStream(stream);
        const video = backVideoRef.current;
        if (video) { video.srcObject = stream; video.play().catch(() => {}); }
      } catch { /* back camera unavailable */ }
    }

    start();
    return () => {
      disposed = true;
      if (stream) stream.getTracks().forEach(t => t.stop());
      setBackStream(null);
    };
  }, [roadDeviceId]);

  // REC timer + auto-stop
  useEffect(() => {
    if (!isRecording) { setRecSeconds(0); return; }
    const id = setInterval(() => setRecSeconds((s) => {
      if (s + 1 >= MAX_RECORD_SECS) { setIsRecording(false); return 0; }
      return s + 1;
    }), 1000);
    return () => clearInterval(id);
  }, [isRecording]);

  // Start/stop both recorders
  useEffect(() => {
    if (isRecording) { startRec(); backRecorder.startRecording(); }
    else { stopRec(); backRecorder.stopRecording(); }
  }, [isRecording, startRec, stopRec, backRecorder.startRecording, backRecorder.stopRecording]);

  // Front camera + face detection
  useEffect(() => {
    let animFrameId: number;
    let stream: MediaStream | null = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let landmarker: any = null;
    let disposed = false;

    const s = {
      smoothedEAR: 0.3, smoothedYaw: 1.0, smoothedPitch: 0.7,
      eyesClosedSince: null as number | null, headTurnedSince: null as number | null,
      alarmPlaying: false, noFaceFrames: 0, currentState: "NO_FACE" as DriverState,
      frameCount: 0, lastFpsTime: performance.now(), lastRenderTime: 0, currentFps: 0,
    };

    async function init() {
      try {
        const { FaceLandmarker, FilesetResolver } = await import("@mediapipe/tasks-vision");
        if (disposed) return;
        const vision = await FilesetResolver.forVisionTasks(MEDIAPIPE_WASM_URL);
        if (disposed) return;
        landmarker = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: FACE_LANDMARKER_MODEL_URL, delegate: "GPU" },
          runningMode: "VIDEO", numFaces: 1,
          outputFaceBlendshapes: false, outputFacialTransformationMatrixes: false,
        });
        if (disposed) { landmarker.close(); return; }
        stream = await navigator.mediaDevices.getUserMedia({
          video: driverDeviceId
            ? { deviceId: { exact: driverDeviceId } }
            : { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
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
        animFrameId = requestAnimationFrame(detect); return;
      }
      const now = performance.now();
      const ctx = canvas.getContext("2d");
      if (!ctx) { animFrameId = requestAnimationFrame(detect); return; }

      s.frameCount++;
      if (now - s.lastFpsTime >= 1000) { s.currentFps = s.frameCount; s.frameCount = 0; s.lastFpsTime = now; }

      const results = landmarker.detectForVideo(video, now);
      const hasFace = results.faceLandmarks?.length > 0;
      const landmarks = hasFace ? results.faceLandmarks[0] : null;

      if (!hasFace) {
        s.noFaceFrames++;
        if (s.noFaceFrames > CONFIG.NO_FACE_FRAME_THRESHOLD) {
          s.currentState = "NO_FACE"; s.eyesClosedSince = null; s.headTurnedSince = null;
        }
      } else {
        s.noFaceFrames = 0;
        const ear = computeEAR(landmarks!);
        const pose = computeHeadPose(landmarks!);
        s.smoothedEAR = ema(ear.average, s.smoothedEAR, CONFIG.EAR_SMOOTHING);
        s.smoothedYaw = ema(pose.yawRatio, s.smoothedYaw, CONFIG.HEAD_SMOOTHING);
        s.smoothedPitch = ema(pose.pitchRatio, s.smoothedPitch, CONFIG.HEAD_SMOOTHING);

        if (s.smoothedEAR < CONFIG.EAR_THRESHOLD) { if (!s.eyesClosedSince) s.eyesClosedSince = now; }
        else { s.eyesClosedSince = null; }
        const turned = Math.abs(s.smoothedYaw - 1.0) > CONFIG.YAW_THRESHOLD ||
          s.smoothedPitch > CONFIG.PITCH_DOWN_THRESHOLD || s.smoothedPitch < CONFIG.PITCH_UP_THRESHOLD;
        if (turned) { if (!s.headTurnedSince) s.headTurnedSince = now; }
        else { s.headTurnedSince = null; }

        if (s.eyesClosedSince && now - s.eyesClosedSince >= CONFIG.DROWSY_TIME_MS) s.currentState = "DROWSY";
        else if (s.headTurnedSince && now - s.headTurnedSince >= CONFIG.DISTRACTED_TIME_MS) s.currentState = "DISTRACTED";
        else s.currentState = "ALERT";

        if (s.currentState === "DROWSY" && !s.alarmPlaying) {
          s.alarmPlaying = true;
          if (!alarmRef.current) { alarmRef.current = new Audio(ALARM_SRC); alarmRef.current.loop = true; }
          alarmRef.current.currentTime = 0; alarmRef.current.play();
        } else if (s.currentState !== "DROWSY" && s.alarmPlaying) {
          s.alarmPlaying = false; alarmRef.current?.pause();
        }
      }

      const cw = canvas.clientWidth; const ch = canvas.clientHeight;
      if (cw > 0 && ch > 0 && (canvas.width !== cw || canvas.height !== ch)) { canvas.width = cw; canvas.height = ch; }
      const vw = video.videoWidth || 1; const vh = video.videoHeight || 1;
      const coverScale = Math.max(cw / vw, ch / vh);
      const ox = (vw * coverScale - cw) / 2; const oy = (vh * coverScale - ch) / 2;
      const ctx2d = canvas.getContext("2d")!;
      ctx2d.clearRect(0, 0, cw, ch);
      ctx2d.save();
      ctx2d.translate(-ox, -oy);
      ctx2d.scale(coverScale, coverScale);
      drawOverlay(ctx2d, vw, vh, landmarks, s.smoothedEAR < CONFIG.EAR_THRESHOLD, true);
      ctx2d.restore();

      if (now - s.lastRenderTime > CONFIG.RENDER_INTERVAL_MS) {
        setDriverState(s.currentState);
        setMetrics({ ear: s.smoothedEAR, yaw: s.smoothedYaw, pitch: s.smoothedPitch });
        setFps(s.currentFps);
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
      alarmRef.current?.pause(); alarmRef.current = null;
    };
  }, [driverDeviceId]);

  const display = STATE_DISPLAY[driverState];
  const isWarning = driverState !== "ALERT";
  const headDir = getHeadDirection(metrics.yaw, metrics.pitch);
  const eyePct = Math.min(100, Math.round((metrics.ear / EAR_OPEN_REF) * 100));
  const eyeOpen = metrics.ear >= CONFIG.EAR_THRESHOLD;
  const yawOk = Math.abs(metrics.yaw - 1.0) <= CONFIG.YAW_THRESHOLD;
  const pitchOk = metrics.pitch <= CONFIG.PITCH_DOWN_THRESHOLD && metrics.pitch >= CONFIG.PITCH_UP_THRESHOLD;
  const recMins = Math.floor(recSeconds / 60).toString().padStart(2, "0");
  const recSecs = (recSeconds % 60).toString().padStart(2, "0");

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 bg-black p-6">
        <div className="rounded-2xl border border-red-800 bg-red-950 p-6 text-center">
          <p className="text-lg font-semibold text-red-400">Camera Error</p>
          <p className="mt-2 text-sm text-red-300">{error}</p>
          <p className="mt-2 text-xs text-white/40">Allow camera access and ensure no other app is using the webcam.</p>
        </div>
      </div>
    );
  }

  const frontFeed = (full: boolean) => (
    <>
      <video
        ref={videoRef}
        className={full ? "absolute inset-0 h-full w-full object-cover" : "h-full w-full object-cover"}
        style={{ transform: "scaleX(-1)" }}
        playsInline muted
      />
      <canvas
        ref={canvasRef}
        className={full ? "absolute inset-0 h-full w-full" : "absolute inset-0 h-full w-full"}
        style={{ transform: "scaleX(-1)" }}
      />
    </>
  );

  const backFeed = (full: boolean) => (
    <video
      ref={backVideoRef}
      className={full ? "absolute inset-0 h-full w-full object-cover" : "h-full w-full object-cover"}
      playsInline muted
    />
  );

  return (
    <div className="flex h-dvh flex-col bg-black pb-[88px]">
      {/* Title */}
      <div className="flex flex-none items-center justify-center pb-2" style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}>
        <span className="text-base font-bold tracking-wide text-white">Record</span>
      </div>

      {/* Video window */}
      <div className="relative mx-3 min-h-0 flex-1 overflow-hidden rounded-2xl bg-zinc-900">
        {/* Main feed */}
        {viewMode === "face" ? frontFeed(true) : backFeed(true)}

        {/* PiP — top left */}
        <div className="absolute left-2 top-2 z-20 h-28 w-20 overflow-hidden rounded-xl shadow-lg" style={{ border: "1.5px solid rgba(255,255,255,0.2)" }}>
          {viewMode === "face" ? backFeed(false) : frontFeed(false)}
        </div>

        {/* Crash detected banner */}
        {crash.isCrashLikely && (
          <div className="pointer-events-none absolute inset-x-0 top-4 z-30 flex justify-center px-4">
            <div className="flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-lg">
              <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
              <span>Crash detected — opening emergency screen…</span>
            </div>
          </div>
        )}

        {/* Debug accel panel */}
        {debugAccel && crash.currentG !== null && (
          <div className="pointer-events-none absolute bottom-28 left-3 z-30 max-w-[60%] rounded-xl bg-black/80 px-3 py-2 text-[10px] text-white/80 backdrop-blur-md">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold uppercase tracking-wide text-white/60">Accel Debug</span>
              <span className="font-mono text-[10px] text-white">{crash.currentG.toFixed(2)}g</span>
            </div>
            <div className="mt-1 grid grid-cols-2 gap-x-2 gap-y-0.5 font-mono">
              <span>ax: {crash.ax?.toFixed(2)}</span>
              <span>ay: {crash.ay?.toFixed(2)}</span>
              <span>az: {crash.az?.toFixed(2)}</span>
              <span>speed: {speedKmh != null ? `${speedKmh.toFixed(1)} km/h` : "–"}</span>
            </div>
            {debugAccel && isIOS && !motionPermissionHintShown && (
              <div className="pointer-events-auto mt-1 rounded bg-white/5 px-2 py-1 text-[9px] leading-snug text-white/70">
                <button type="button" className="underline" onClick={async () => {
                  const result = await requestMotionPermission();
                  if (result !== "granted") setMotionPermissionHintShown(true);
                }}>
                  Tap to enable motion sensors on iOS
                </button>
              </div>
            )}
            {accelSamples.length > 1 && (
              <div className="mt-2 space-y-1.5">
                {[
                  { key: "g", values: accelSamples.map(s => s.g), color: "text-primary" },
                  { key: "ax", values: accelSamples.map(s => s.ax), color: "text-secondary" },
                  { key: "ay", values: accelSamples.map(s => s.ay), color: "text-accent-foreground" },
                  { key: "az", values: accelSamples.map(s => s.az), color: "text-destructive" },
                ].map(({ key, values, color }) => (
                  <div key={key} className="flex items-center justify-between gap-2">
                    <span className="text-[9px] text-white/50">{key}</span>
                    <Sparkline values={values} colorClass={color} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            <p className="mt-4 text-sm font-medium text-white">Loading face detection…</p>
            <p className="mt-1 text-xs text-white/40">First load may take a few seconds</p>
          </div>
        )}

        {/* Top bar: FPS left, status badge centered */}
        {!loading && (
          <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between px-3 pt-3">
            <div className="rounded-md bg-black/40 px-2 py-1 font-mono text-xs text-white/40 backdrop-blur-sm">
              {fps} FPS
            </div>
            <div className="absolute left-1/2 -translate-x-1/2">
              {isRecording ? (
                <div className="flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 backdrop-blur-sm">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                  <span className="font-mono text-xs font-bold text-white">REC {recMins}:{recSecs}</span>
                </div>
              ) : (
                <div
                  className="rounded-full border px-3 py-1 text-xs font-bold tracking-widest backdrop-blur-md transition-colors duration-300"
                  style={{ borderColor: display.border, color: display.color, backgroundColor: display.bg }}
                >
                  {display.label}
                </div>
              )}
            </div>
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

        {/* View mode toggle (right side, below cameras button) */}
        {!loading && <ViewModeToggle mode={viewMode} onToggle={() => setViewMode(m => m === "road" ? "face" : "road")} />}

        {/* Camera picker */}
        {!loading && (
          <CameraPicker
            devices={devices}
            driverDeviceId={driverDeviceId}
            roadDeviceId={roadDeviceId}
            onDriverChange={setDriverDeviceId}
            onRoadChange={setRoadDeviceId}
          />
        )}

        {/* Metrics overlay — bottom */}
        {!loading && (
          <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-3 pb-3 pt-14">
            <div className="grid grid-cols-2 gap-2">
              <MetricCard label="Eyes" value={`${eyePct}%`} sub={eyeOpen ? "Open" : "Closed"} color={eyeOpen ? "#22c55e" : "#ef4444"} />
              <MetricCard label="Status" value={display.label} sub="driver state" color={display.color} />
              <MetricCard label="Direction" value={headDir} sub={`yaw ${metrics.yaw.toFixed(2)}`} color={yawOk ? "#22c55e" : "#f59e0b"} />
              <MetricCard
                label="Tilt"
                value={metrics.pitch > CONFIG.PITCH_DOWN_THRESHOLD ? "Down" : metrics.pitch < CONFIG.PITCH_UP_THRESHOLD ? "Up" : "Level"}
                sub={`pitch ${metrics.pitch.toFixed(2)}`}
                color={pitchOk ? "#22c55e" : "#f59e0b"}
              />
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-none flex-col items-center gap-3 py-4">
        <button
          onClick={() => setIsRecording((r) => !r)}
          disabled={loading}
          className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white transition-transform active:scale-95 disabled:opacity-30"
          style={{ background: "transparent" }}
          aria-label={isRecording ? "Stop recording" : "Start recording"}
        >
          <span className={`h-10 w-10 rounded-full bg-red-500 transition-all ${isRecording ? "animate-pulse scale-90 rounded-lg" : ""}`} />
        </button>

        <div className="flex items-center gap-0 rounded-full bg-white/10 p-0.5">
          {(["face", "road"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`rounded-full px-4 py-1 text-xs font-semibold capitalize transition-colors ${viewMode === mode ? "bg-white text-black" : "text-white/60"}`}
            >
              {mode === "face" ? "Front" : "Road"}
            </button>
          ))}
        </div>
      </div>

      {pendingRec && <SaveRecordingDialog pending={pendingRec} onDone={clearPending} />}
    </div>
  );
}

function MetricCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-white/8 py-3 backdrop-blur-sm">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-white/40">{label}</span>
      <span className="mt-1 text-lg font-black leading-tight" style={{ color }}>{value}</span>
      <span className="mt-0.5 text-[10px] text-white/30">{sub}</span>
    </div>
  );
}
