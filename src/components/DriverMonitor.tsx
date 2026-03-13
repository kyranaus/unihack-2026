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
// Typical fully-open EAR is ~0.30–0.35; using 0.32 so eyes read near 100%
// at full aperture without hitting the cap too early.
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

    // Mutable detection state — updated every frame, not React state.
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
            width: { ideal: 640 },
            height: { ideal: 480 },
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

      // FPS counter
      s.frameCount++;
      if (now - s.lastFpsTime >= 1000) {
        s.currentFps = s.frameCount;
        s.frameCount = 0;
        s.lastFpsTime = now;
      }

      // --- Core detection ---
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
        s.smoothedYaw = ema(
          pose.yawRatio,
          s.smoothedYaw,
          CONFIG.HEAD_SMOOTHING,
        );
        s.smoothedPitch = ema(
          pose.pitchRatio,
          s.smoothedPitch,
          CONFIG.HEAD_SMOOTHING,
        );

        // Eyes closed timer
        if (s.smoothedEAR < CONFIG.EAR_THRESHOLD) {
          if (!s.eyesClosedSince) s.eyesClosedSince = now;
        } else {
          s.eyesClosedSince = null;
        }

        // Head turned timer
        const turned =
          Math.abs(s.smoothedYaw - 1.0) > CONFIG.YAW_THRESHOLD ||
          s.smoothedPitch > CONFIG.PITCH_DOWN_THRESHOLD ||
          s.smoothedPitch < CONFIG.PITCH_UP_THRESHOLD;
        if (turned) {
          if (!s.headTurnedSince) s.headTurnedSince = now;
        } else {
          s.headTurnedSince = null;
        }

        // State resolution — priority: DROWSY > DISTRACTED > ALERT
        if (
          s.eyesClosedSince &&
          now - s.eyesClosedSince >= CONFIG.DROWSY_TIME_MS
        ) {
          s.currentState = "DROWSY";
        } else if (
          s.headTurnedSince &&
          now - s.headTurnedSince >= CONFIG.DISTRACTED_TIME_MS
        ) {
          s.currentState = "DISTRACTED";
        } else {
          s.currentState = "ALERT";
        }
      }

      // --- Canvas overlay ---
      drawOverlay(
        ctx,
        canvas.width,
        canvas.height,
        landmarks,
        s.smoothedEAR < CONFIG.EAR_THRESHOLD,
      );

      // --- Batch React state updates (throttled) ---
      if (now - s.lastRenderTime > CONFIG.RENDER_INTERVAL_MS) {
        setDriverState(s.currentState);
        setMetrics({
          ear: s.smoothedEAR,
          yaw: s.smoothedYaw,
          pitch: s.smoothedPitch,
        });
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

  // --- Derived display values ---
  const display = STATE_DISPLAY[driverState];
  const isWarning = driverState !== "ALERT";
  const headDir = getHeadDirection(metrics.yaw, metrics.pitch);
  const pitchLabel =
    metrics.pitch > CONFIG.PITCH_DOWN_THRESHOLD
      ? "Down"
      : metrics.pitch < CONFIG.PITCH_UP_THRESHOLD
        ? "Up"
        : "Level";
  const pitchColor =
    metrics.pitch > CONFIG.PITCH_DOWN_THRESHOLD ||
    metrics.pitch < CONFIG.PITCH_UP_THRESHOLD
      ? "#f59e0b"
      : "#22c55e";

  // --- Error state ---
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <div className="rounded-2xl border border-red-300 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-950">
          <p className="text-lg font-semibold text-red-600 dark:text-red-400">
            Camera Error
          </p>
          <p className="mt-2 text-sm text-red-500 dark:text-red-300">
            {error}
          </p>
          <p className="mt-2 text-xs text-gray-500">
            Make sure to allow camera access and that no other app is using the
            webcam.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Warning banner */}
      {isWarning && display.warning && (
        <div
          className="w-full max-w-2xl animate-pulse rounded-xl border-2 px-6 py-3 text-center text-lg font-bold tracking-wide"
          style={{
            borderColor: display.color,
            color: display.color,
            backgroundColor: display.bg,
          }}
        >
          {display.warning}
        </div>
      )}

      {/* Webcam card */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-[var(--line)] bg-black shadow-lg">
        {/* Status badge */}
        <div className="absolute left-1/2 top-4 z-10 -translate-x-1/2">
          <div
            className="rounded-full border px-5 py-1.5 text-sm font-bold tracking-wider shadow-lg backdrop-blur-md transition-colors duration-300"
            style={{
              borderColor: display.border,
              color: display.color,
              backgroundColor: display.bg,
            }}
          >
            {display.label}
          </div>
        </div>

        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 text-white">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            <p className="mt-3 text-sm font-medium">
              Loading face detection model...
            </p>
            <p className="mt-1 text-xs text-white/50">
              This may take a few seconds on first load
            </p>
          </div>
        )}

        {/* Video + Canvas layered */}
        <div className="relative aspect-[4/3]">
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ transform: "scaleX(-1)" }}
            playsInline
            muted
          />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full"
            style={{ transform: "scaleX(-1)" }}
          />
        </div>

        {/* Bottom-right FPS badge on the video */}
        {!loading && (
          <div className="absolute bottom-3 right-3 z-10 rounded-md bg-black/50 px-2 py-0.5 text-xs font-mono text-white/70 backdrop-blur-sm">
            {fps} FPS
          </div>
        )}
      </div>

      {/* Metrics grid */}
      <div className="grid w-full max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
        <MetricCard
          label="Eye Openness"
          value={`${Math.min(100, Math.round((metrics.ear / EAR_OPEN_REF) * 100))}%`}
          detail={metrics.ear < CONFIG.EAR_THRESHOLD ? "Closed" : "Open"}
          color={metrics.ear < CONFIG.EAR_THRESHOLD ? "#ef4444" : "#22c55e"}
        />
        <MetricCard
          label="Head Direction"
          value={headDir}
          detail={`Yaw: ${metrics.yaw.toFixed(2)}`}
          color={
            Math.abs(metrics.yaw - 1.0) > CONFIG.YAW_THRESHOLD
              ? "#f59e0b"
              : "#22c55e"
          }
        />
        <MetricCard
          label="Head Tilt"
          value={pitchLabel}
          detail={`Pitch: ${metrics.pitch.toFixed(2)}`}
          color={pitchColor}
        />
        <MetricCard
          label="Detection"
          value={`${fps} FPS`}
          detail="Processing speed"
          color="#4fb8b2"
        />
      </div>

      {/* Threshold info */}
      <div className="w-full max-w-2xl rounded-xl border border-[var(--line)] bg-[var(--surface)] px-5 py-4 text-xs text-[var(--sea-ink-soft)]">
        <p className="mb-1 font-semibold uppercase tracking-wider text-[var(--sea-ink)]">
          Thresholds
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-1">
          <span>
            EAR closed: &lt;{CONFIG.EAR_THRESHOLD}
          </span>
          <span>Drowsy after: {CONFIG.DROWSY_TIME_MS}ms</span>
          <span>Distracted after: {CONFIG.DISTRACTED_TIME_MS}ms</span>
          <span>Yaw threshold: {CONFIG.YAW_THRESHOLD}</span>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  detail,
  color,
}: {
  label: string;
  value: string;
  detail: string;
  color: string;
}) {
  return (
    <div className="island-shell rounded-xl p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--sea-ink-soft)]">
        {label}
      </p>
      <p className="mt-1 text-xl font-bold" style={{ color }}>
        {value}
      </p>
      <p className="mt-0.5 text-xs text-[var(--sea-ink-soft)]">{detail}</p>
    </div>
  );
}
