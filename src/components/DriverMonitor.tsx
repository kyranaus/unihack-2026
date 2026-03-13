import { useEffect, useRef, useState } from "react";
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

// EAR value that maps to "100% open" for display purposes.
const EAR_OPEN_REF = 0.32;

export default function DriverMonitor() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [driverState, setDriverState] = useState<DriverState>("NO_FACE");
  const [metrics, setMetrics] = useState<SmoothedMetrics>({
    ear: 0,
    yaw: 1,
    pitch: 0.7,
  });
  const [fps, setFps] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      noFaceFrames: 0,
      currentState: "NO_FACE" as DriverState,
      frameCount: 0,
      lastFpsTime: performance.now(),
      lastRenderTime: 0,
      currentFps: 0,
    };

    async function init() {
      try {
        const { FaceLandmarker, FilesetResolver } = await import(
          "@mediapipe/tasks-vision"
        );
        if (disposed) return;

        const vision = await FilesetResolver.forVisionTasks(MEDIAPIPE_WASM_URL);
        if (disposed) return;

        landmarker = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: FACE_LANDMARKER_MODEL_URL,
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numFaces: 1,
          outputFaceBlendshapes: false,
          outputFacialTransformationMatrixes: false,
        });
        if (disposed) {
          landmarker.close();
          return;
        }

        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user",
          },
        });
        if (disposed) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        const video = videoRef.current;
        if (!video) return;
        video.srcObject = stream;
        await video.play();

        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }

        setLoading(false);
        detect();
      } catch (err) {
        if (!disposed) {
          const msg =
            err instanceof Error ? err.message : "Failed to initialize";
          setError(msg);
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
      if (!ctx) {
        animFrameId = requestAnimationFrame(detect);
        return;
      }

      s.frameCount++;
      if (now - s.lastFpsTime >= 1000) {
        s.currentFps = s.frameCount;
        s.frameCount = 0;
        s.lastFpsTime = now;
      }

      const results = landmarker.detectForVideo(video, now);
      const hasFace =
        results.faceLandmarks && results.faceLandmarks.length > 0;
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
      }

      drawOverlay(
        ctx,
        canvas.width,
        canvas.height,
        landmarks,
        s.smoothedEAR < CONFIG.EAR_THRESHOLD,
      );

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
      cancelAnimationFrame(animFrameId);
      if (stream) stream.getTracks().forEach((t) => t.stop());
      if (landmarker) (landmarker as any).close();
    };
  }, []);

  const display = STATE_DISPLAY[driverState];
  const isWarning = driverState !== "ALERT";
  const headDir = getHeadDirection(metrics.yaw, metrics.pitch);
  const eyePct = Math.min(100, Math.round((metrics.ear / EAR_OPEN_REF) * 100));
  const eyeOpen = metrics.ear >= CONFIG.EAR_THRESHOLD;

  // --- Error state ---
  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-black p-6">
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
    // Full-screen dark container
    <div className="relative flex min-h-screen w-full flex-col bg-black">

      {/* ── Camera feed fills entire screen ── */}
      <div className="relative flex-1 overflow-hidden">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          style={{ transform: "scaleX(-1)" }}
          playsInline
          muted
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          style={{ transform: "scaleX(-1)" }}
        />

        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            <p className="mt-4 text-sm font-medium text-white">
              Loading face detection…
            </p>
            <p className="mt-1 text-xs text-white/40">
              First load may take a few seconds
            </p>
          </div>
        )}

        {/* ── Top bar: status badge + FPS ── */}
        {!loading && (
          <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between px-4 pt-4">
            {/* State badge */}
            <div
              className="rounded-full border px-4 py-1.5 text-sm font-bold tracking-widest backdrop-blur-md transition-colors duration-300"
              style={{
                borderColor: display.border,
                color: display.color,
                backgroundColor: display.bg,
              }}
            >
              {display.label}
            </div>

            {/* FPS */}
            <div className="rounded-md bg-black/50 px-2.5 py-1 font-mono text-xs text-white/60 backdrop-blur-sm">
              {fps} FPS
            </div>
          </div>
        )}

        {/* ── Warning banner (centre of screen) ── */}
        {!loading && isWarning && display.warning && (
          <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
            <div
              className="animate-pulse rounded-2xl border-2 px-6 py-3 text-center text-xl font-black tracking-widest backdrop-blur-md"
              style={{
                borderColor: display.color,
                color: display.color,
                backgroundColor: display.bg,
              }}
            >
              {display.warning}
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom metrics strip ── */}
      {!loading && (
        <div className="z-10 flex items-stretch divide-x divide-white/10 bg-black/80 backdrop-blur-md">
          <MetricPill
            label="Eyes"
            value={`${eyePct}%`}
            sub={eyeOpen ? "Open" : "Closed"}
            color={eyeOpen ? "#22c55e" : "#ef4444"}
          />
          <MetricPill
            label="Direction"
            value={headDir}
            sub={`yaw ${metrics.yaw.toFixed(1)}`}
            color={
              Math.abs(metrics.yaw - 1.0) > CONFIG.YAW_THRESHOLD
                ? "#f59e0b"
                : "#22c55e"
            }
          />
          <MetricPill
            label="Tilt"
            value={
              metrics.pitch > CONFIG.PITCH_DOWN_THRESHOLD
                ? "Down"
                : metrics.pitch < CONFIG.PITCH_UP_THRESHOLD
                  ? "Up"
                  : "Level"
            }
            sub={`pitch ${metrics.pitch.toFixed(1)}`}
            color={
              metrics.pitch > CONFIG.PITCH_DOWN_THRESHOLD ||
              metrics.pitch < CONFIG.PITCH_UP_THRESHOLD
                ? "#f59e0b"
                : "#22c55e"
            }
          />
          <MetricPill
            label="Status"
            value={display.label}
            sub="driver state"
            color={display.color}
          />
        </div>
      )}
    </div>
  );
}

function MetricPill({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-2 py-3">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-white/40">
        {label}
      </span>
      <span className="mt-0.5 text-base font-bold leading-tight" style={{ color }}>
        {value}
      </span>
      <span className="text-[10px] text-white/30">{sub}</span>
    </div>
  );
}
