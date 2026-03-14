import { useEffect, useRef, useState } from "react";
import type { FaceLandmarker, FaceLandmarkerResult, NormalizedLandmark } from "@mediapipe/tasks-vision";
import type { DriverState, EarCalibration, SmoothedMetrics } from "#/lib/driver-monitor-utils";
import { useDriverEventLogger } from "#/hooks/useDriverEventLogger";
import {
  CONFIG,
  FACE_LANDMARKER_MODEL_URL,
  MEDIAPIPE_WASM_URL,
  STATE_DISPLAY,
  computeEAR,
  computeHeadPose,
  createEarCalibration,
  drawOverlay,
  ema,
  getEarThreshold,
  getHeadDirection,
  updateEarCalibration,
} from "#/lib/driver-monitor-utils";

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

  useDriverEventLogger(driverState, metrics);

  useEffect(() => {
    let animFrameId: number;
    let stream: MediaStream | null = null;
    let landmarker: FaceLandmarker | null = null;
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
      cal: createEarCalibration() as EarCalibration,
    };

    async function init() {
      try {
        const { FaceLandmarker, FilesetResolver } = await import(
          "@mediapipe/tasks-vision"
        );
        if (disposed) return;

        const vision = await FilesetResolver.forVisionTasks(MEDIAPIPE_WASM_URL);
        if (disposed) return;

        try {
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
        } catch {
          console.warn("[FaceDetect] GPU delegate failed, falling back to CPU");
          landmarker = await FaceLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: FACE_LANDMARKER_MODEL_URL,
              delegate: "CPU",
            },
            runningMode: "VIDEO",
            numFaces: 1,
            outputFaceBlendshapes: false,
            outputFacialTransformationMatrixes: false,
          });
        }
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

        let video = videoRef.current;
        for (let i = 0; !video && i < 20; i++) {
          await new Promise((r) => setTimeout(r, 100));
          if (disposed) return;
          video = videoRef.current;
        }
        if (!video) {
          console.error("[FaceDetect] videoRef never became available");
          setLoading(false);
          return;
        }
        video.srcObject = stream;
        await video.play();

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

      let results: FaceLandmarkerResult;
      try {
        results = landmarker!.detectForVideo(video, now);
      } catch {
        animFrameId = requestAnimationFrame(detect);
        return;
      }
      const hasFace =
        results.faceLandmarks && results.faceLandmarks.length > 0;
      const landmarks: NormalizedLandmark[] | null = hasFace ? results.faceLandmarks[0] : null;

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

        updateEarCalibration(s.cal, ear.average, pose.yawRatio, pose.pitchRatio);
        const earThreshold = getEarThreshold(s.cal);

        if (s.smoothedEAR < earThreshold) {
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

      // Match canvas to display pixels and apply object-cover transform
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
      drawOverlay(ctx, vw, vh, landmarks, s.smoothedEAR < getEarThreshold(s.cal), true);
      ctx.restore();

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
      if (landmarker) landmarker.close();
    };
  }, []);

  const display = STATE_DISPLAY[driverState];
  const isWarning = driverState !== "ALERT";
  const headDir = getHeadDirection(metrics.yaw, metrics.pitch);
  const eyePct = Math.min(100, Math.round((metrics.ear / EAR_OPEN_REF) * 100));
  const eyeOpen = metrics.ear >= CONFIG.EAR_THRESHOLD;

  const yawOk = Math.abs(metrics.yaw - 1.0) <= CONFIG.YAW_THRESHOLD;
  const pitchOk =
    metrics.pitch <= CONFIG.PITCH_DOWN_THRESHOLD &&
    metrics.pitch >= CONFIG.PITCH_UP_THRESHOLD;

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 bg-background p-6">
        <div className="rounded-2xl border border-red-800 bg-red-950 p-6 text-center">
          <p className="text-lg font-semibold text-red-400">Camera Error</p>
          <p className="mt-2 text-sm text-red-300">{error}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Allow camera access and ensure no other app is using the webcam.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      {/* Camera feed */}
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

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          <p className="mt-4 text-sm font-medium text-white">Loading face detection…</p>
          <p className="mt-1 text-xs text-white/40">First load may take a few seconds</p>
        </div>
      )}

      {/* ── Top bar: status badge + FPS ── */}
      {!loading && (
        <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-end px-4 pt-[max(1rem,env(safe-area-inset-top))]">
          <div
            className="rounded-full border px-4 py-1.5 text-sm font-bold tracking-widest backdrop-blur-md transition-colors duration-300 absolute left-1/2 -translate-x-1/2"
            style={{
              borderColor: display.border,
              color: display.color,
              backgroundColor: display.bg,
            }}
          >
            {display.label}
          </div>
          <div className="rounded-md bg-black/40 px-2.5 py-1 font-mono text-xs text-white/50 backdrop-blur-sm">
            {fps} FPS
          </div>
        </div>
      )}

      {/* ── Warning banner ── */}
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

      {/* ── Bottom metrics overlay ── */}
      {!loading && (
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-3 pb-4 pt-16">
          <div className="grid grid-cols-2 gap-2">
            <MetricCard
              label="Eyes"
              value={`${eyePct}%`}
              sub={eyeOpen ? "Open" : "Closed"}
              color={eyeOpen ? "#22c55e" : "#ef4444"}
            />
            <MetricCard
              label="Status"
              value={display.label}
              sub="driver state"
              color={display.color}
            />
            <MetricCard
              label="Direction"
              value={headDir}
              sub={`yaw ${metrics.yaw.toFixed(2)}`}
              color={yawOk ? "#22c55e" : "#f59e0b"}
            />
            <MetricCard
              label="Tilt"
              value={
                metrics.pitch > CONFIG.PITCH_DOWN_THRESHOLD
                  ? "Down"
                  : metrics.pitch < CONFIG.PITCH_UP_THRESHOLD
                    ? "Up"
                    : "Level"
              }
              sub={`pitch ${metrics.pitch.toFixed(2)}`}
              color={pitchOk ? "#22c55e" : "#f59e0b"}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({
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
    <div className="flex flex-col items-center justify-center rounded-2xl bg-white/8 py-3 backdrop-blur-sm">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-white/40">
        {label}
      </span>
      <span className="mt-1 text-lg font-black leading-tight" style={{ color }}>
        {value}
      </span>
      <span className="mt-0.5 text-[10px] text-white/30">{sub}</span>
    </div>
  );
}
