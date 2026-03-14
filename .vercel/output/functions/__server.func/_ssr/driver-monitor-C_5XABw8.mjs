import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { d as driveSessionStore, u as useFrameCapture, g as getActiveSession } from "./useDriveSession-DLVe633O.mjs";
import { c as client } from "./client-Bs9qvbFn.mjs";
import { s as saveRecording } from "./replay-store-hei_UiKG.mjs";
import { k as VideoOff, R as RefreshCw, f as Camera, l as ChevronDown, m as Square, n as Circle } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/tiny-invariant.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tiny-warning.mjs";
import "../_libs/tanstack__store.mjs";
import "../_libs/orpc__server.mjs";
import "../_libs/orpc__shared.mjs";
import "../_libs/orpc__standard-server-fetch.mjs";
import "../_libs/orpc__standard-server.mjs";
import "../_libs/orpc__client.mjs";
import "../_libs/orpc__contract.mjs";
import "../_libs/orpc__tanstack-query.mjs";
import "../_libs/tanstack__query-core.mjs";
import "./router-DL5qrXNE.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/zod.mjs";
import "node:buffer";
import "../_libs/orpc__openapi.mjs";
import "../_libs/rou3.mjs";
import "../_libs/orpc__openapi-client.mjs";
import "../_libs/json-schema-typed.mjs";
import "../_libs/orpc__zod.mjs";
import "../_libs/orpc__json-schema.mjs";
import "../_libs/radash.mjs";
import "node:path";
import "node:url";
import "@prisma/client/runtime/client";
import "../_libs/prisma__adapter-pg.mjs";
import "../_libs/prisma__driver-adapter-utils.mjs";
import "../_libs/prisma__debug.mjs";
import "../_libs/pg.mjs";
import "events";
import "../_libs/pg-types.mjs";
import "../_libs/postgres-array.mjs";
import "../_libs/postgres-date.mjs";
import "../_libs/postgres-interval.mjs";
import "../_libs/xtend.mjs";
import "../_libs/postgres-bytea.mjs";
import "../_libs/pg-int8.mjs";
import "dns";
import "../_libs/pg-connection-string.mjs";
import "fs";
import "../_libs/pg-protocol.mjs";
import "net";
import "tls";
import "../_libs/pg-cloudflare.mjs";
import "../_libs/pgpass.mjs";
import "path";
import "../_libs/split2.mjs";
import "string_decoder";
import "../_libs/pg-pool.mjs";
import "../_libs/better-auth__core.mjs";
import "../_libs/better-call.mjs";
import "../_libs/better-auth__utils.mjs";
import "../_libs/better-fetch__fetch.mjs";
import "../_libs/jose.mjs";
import "../_libs/noble__ciphers.mjs";
import "../_libs/noble__hashes.mjs";
import "../_libs/defu.mjs";
import "../_libs/better-auth__kysely-adapter.mjs";
import "../_libs/kysely.mjs";
import "../_libs/better-auth__telemetry.mjs";
import "node:fs";
import "node:fs/promises";
import "node:os";
import "../_libs/better-auth__prisma-adapter.mjs";
import "../_libs/openai.mjs";
import "./server-BubZoQFo.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/srvx.mjs";
function useCamera(source, enabled = true) {
  const videoRef = reactExports.useRef(null);
  const [stream, setStream] = reactExports.useState(null);
  const [isReady, setIsReady] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const deviceId = "deviceId" in source ? source.deviceId : void 0;
  const facingMode = "facingMode" in source ? source.facingMode : void 0;
  reactExports.useEffect(() => {
    if (!enabled) {
      setStream(null);
      setIsReady(false);
      return;
    }
    if (typeof navigator === "undefined") {
      setError("Camera is only available in a browser environment.");
      setStream(null);
      setIsReady(false);
      return;
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const secure = typeof window !== "undefined" ? window.isSecureContext : true;
      if (!secure) {
        setError(
          "Camera access requires HTTPS or localhost. Open this app over https:// to use the camera."
        );
      } else {
        setError("Camera access is not supported in this browser or device.");
      }
      setStream(null);
      setIsReady(false);
      return;
    }
    let disposed = false;
    let currentStream = null;
    async function init() {
      setError(null);
      setIsReady(false);
      try {
        const videoConstraint = deviceId ? {
          deviceId: { exact: deviceId },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } : { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } };
        currentStream = await navigator.mediaDevices.getUserMedia({
          video: videoConstraint
        });
        if (disposed) {
          for (const t of currentStream.getTracks()) t.stop();
          return;
        }
        const video = videoRef.current;
        if (!video) return;
        video.srcObject = currentStream;
        await video.play();
        if (!disposed) {
          setStream(currentStream);
          setIsReady(true);
        }
      } catch (err) {
        if (!disposed) {
          if (err && typeof err === "object" && "name" in err) {
            const name = String(err.name);
            if (name === "NotFoundError" || name === "OverconstrainedError") {
              setError(
                "No camera was found. Connect a camera or use a device with a camera."
              );
            } else if (name === "NotAllowedError" || name === "SecurityError") {
              const secure = typeof window !== "undefined" ? window.isSecureContext : true;
              if (!secure) {
                setError(
                  "Camera access is blocked because this page is not served over HTTPS. Use https:// or localhost."
                );
              } else {
                setError(
                  "Camera permission was denied. Allow camera access in your browser settings."
                );
              }
            } else {
              setError(
                err instanceof Error ? err.message : "Camera unavailable. Please check your device and permissions."
              );
            }
          } else {
            setError(
              "Camera unavailable. Please check your device and permissions."
            );
          }
        }
      }
    }
    init();
    return () => {
      disposed = true;
      if (currentStream) {
        for (const t of currentStream.getTracks()) t.stop();
      }
    };
  }, [deviceId, facingMode, enabled]);
  return { videoRef, stream, isReady, error };
}
function useCameraDevices() {
  const [devices, setDevices] = reactExports.useState([]);
  reactExports.useEffect(() => {
    let disposed = false;
    async function enumerate() {
      try {
        const all = await navigator.mediaDevices.enumerateDevices();
        if (disposed) return;
        setDevices(
          all.filter((d) => d.kind === "videoinput").map((d, i) => ({
            deviceId: d.deviceId,
            label: d.label || `Camera ${i + 1}`
          }))
        );
      } catch {
      }
    }
    if (typeof navigator === "undefined" || !navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      return;
    }
    const mediaDevices = navigator.mediaDevices;
    enumerate();
    mediaDevices.addEventListener?.("devicechange", enumerate);
    return () => {
      disposed = true;
      mediaDevices.removeEventListener?.("devicechange", enumerate);
    };
  }, []);
  return devices;
}
const CONFIG = {
  /** Eye Aspect Ratio below this = "eyes closed" */
  EAR_THRESHOLD: 0.2,
  /** EMA alpha for EAR (higher = less smoothing, more responsive) */
  EAR_SMOOTHING: 0.3,
  /** EMA alpha for head pose values */
  HEAD_SMOOTHING: 0.25,
  /** Yaw ratio deviation from 1.0 beyond this = "looking away" */
  YAW_THRESHOLD: 0.45,
  /** Pitch ratio above this = "looking down" */
  PITCH_DOWN_THRESHOLD: 1.35,
  /** Pitch ratio below this = "looking up" */
  PITCH_UP_THRESHOLD: 0.45,
  /** Eyes closed this long → DROWSY */
  DROWSY_TIME_MS: 1250,
  /** Head turned this long → DISTRACTED */
  DISTRACTED_TIME_MS: 2e3,
  /** Consecutive frames without a face before NO_FACE (~0.5s at 30fps) */
  NO_FACE_FRAME_THRESHOLD: 15,
  /** React state update interval to avoid excessive re-renders */
  RENDER_INTERVAL_MS: 80
};
const MEDIAPIPE_WASM_URL = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.32/wasm";
const FACE_LANDMARKER_MODEL_URL = "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task";
const RIGHT_EYE = {
  outer: 33,
  upperOuter: 160,
  upperInner: 158,
  inner: 133,
  lowerInner: 153,
  lowerOuter: 144
};
const LEFT_EYE = {
  inner: 362,
  upperInner: 385,
  upperOuter: 387,
  outer: 263,
  lowerOuter: 373,
  lowerInner: 380
};
const NOSE_TIP = 1;
const FOREHEAD = 10;
const CHIN = 152;
const LEFT_CHEEK = 234;
const RIGHT_CHEEK = 454;
const RIGHT_EYE_CONTOUR = [
  33,
  246,
  161,
  160,
  159,
  158,
  157,
  173,
  133,
  155,
  154,
  153,
  145,
  144,
  163,
  7,
  33
];
const LEFT_EYE_CONTOUR = [
  362,
  398,
  384,
  385,
  386,
  387,
  388,
  466,
  263,
  249,
  390,
  373,
  374,
  380,
  381,
  382,
  362
];
const FACE_OVAL = [
  10,
  338,
  297,
  332,
  284,
  251,
  389,
  356,
  454,
  323,
  361,
  288,
  397,
  365,
  379,
  378,
  400,
  377,
  152,
  148,
  176,
  149,
  150,
  136,
  172,
  58,
  132,
  93,
  234,
  127,
  162,
  21,
  54,
  103,
  67,
  109,
  10
];
function dist(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}
function ema(current, previous, alpha) {
  return alpha * current + (1 - alpha) * previous;
}
function computeEAR(landmarks) {
  const rightV1 = dist(
    landmarks[RIGHT_EYE.upperOuter],
    landmarks[RIGHT_EYE.lowerOuter]
  );
  const rightV2 = dist(
    landmarks[RIGHT_EYE.upperInner],
    landmarks[RIGHT_EYE.lowerInner]
  );
  const rightH = dist(
    landmarks[RIGHT_EYE.outer],
    landmarks[RIGHT_EYE.inner]
  );
  const rightEAR = rightH > 1e-3 ? (rightV1 + rightV2) / (2 * rightH) : 0;
  const leftV1 = dist(
    landmarks[LEFT_EYE.upperInner],
    landmarks[LEFT_EYE.lowerInner]
  );
  const leftV2 = dist(
    landmarks[LEFT_EYE.upperOuter],
    landmarks[LEFT_EYE.lowerOuter]
  );
  const leftH = dist(landmarks[LEFT_EYE.inner], landmarks[LEFT_EYE.outer]);
  const leftEAR = leftH > 1e-3 ? (leftV1 + leftV2) / (2 * leftH) : 0;
  return {
    left: leftEAR,
    right: rightEAR,
    average: (leftEAR + rightEAR) / 2
  };
}
function computeHeadPose(landmarks) {
  const nose = landmarks[NOSE_TIP];
  const forehead = landmarks[FOREHEAD];
  const chin = landmarks[CHIN];
  const left = landmarks[LEFT_CHEEK];
  const right = landmarks[RIGHT_CHEEK];
  const leftDist = nose.x - left.x;
  const rightDist = right.x - nose.x;
  const yawRatio = rightDist > 1e-3 ? leftDist / rightDist : 1;
  const topDist = nose.y - forehead.y;
  const bottomDist = chin.y - nose.y;
  const pitchRatio = bottomDist > 1e-3 ? topDist / bottomDist : 0.7;
  return { yawRatio, pitchRatio };
}
function getHeadDirection(yaw, pitch) {
  const yawOk = Math.abs(yaw - 1) <= CONFIG.YAW_THRESHOLD;
  const pitchOk = pitch <= CONFIG.PITCH_DOWN_THRESHOLD && pitch >= CONFIG.PITCH_UP_THRESHOLD;
  if (yawOk && pitchOk) return "Forward";
  const parts = [];
  if (yaw < 1 - CONFIG.YAW_THRESHOLD) parts.push("Right");
  else if (yaw > 1 + CONFIG.YAW_THRESHOLD) parts.push("Left");
  if (pitch > CONFIG.PITCH_DOWN_THRESHOLD) parts.push("Down");
  else if (pitch < CONFIG.PITCH_UP_THRESHOLD) parts.push("Up");
  return parts.join(" + ") || "Forward";
}
function drawOverlay(ctx, w, h, landmarks, earBelowThreshold, skipClear = false) {
  if (!skipClear) ctx.clearRect(0, 0, w, h);
  if (!landmarks) return;
  drawPath(ctx, landmarks, FACE_OVAL, w, h, "rgba(79,184,178,0.3)", 1.5);
  const eyeColor = earBelowThreshold ? "rgba(239,68,68,0.8)" : "rgba(34,197,94,0.7)";
  drawPath(ctx, landmarks, RIGHT_EYE_CONTOUR, w, h, eyeColor, 2);
  drawPath(ctx, landmarks, LEFT_EYE_CONTOUR, w, h, eyeColor, 2);
  const nose = landmarks[NOSE_TIP];
  const forehead = landmarks[FOREHEAD];
  ctx.beginPath();
  ctx.strokeStyle = "rgba(79,184,178,0.5)";
  ctx.lineWidth = 2;
  ctx.moveTo(forehead.x * w, forehead.y * h);
  ctx.lineTo(nose.x * w, nose.y * h);
  ctx.stroke();
  ctx.beginPath();
  ctx.fillStyle = "rgba(79,184,178,0.8)";
  ctx.arc(nose.x * w, nose.y * h, 3, 0, Math.PI * 2);
  ctx.fill();
}
function drawPath(ctx, landmarks, indices, w, h, color, lineWidth) {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  for (let i = 0; i < indices.length; i++) {
    const p = landmarks[indices[i]];
    if (i === 0) ctx.moveTo(p.x * w, p.y * h);
    else ctx.lineTo(p.x * w, p.y * h);
  }
  ctx.stroke();
}
const STATE_DISPLAY = {
  ALERT: {
    label: "ALERT",
    color: "#22c55e",
    bg: "rgba(34,197,94,0.12)",
    border: "rgba(34,197,94,0.3)"
  },
  DROWSY: {
    label: "DROWSY",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.12)",
    border: "rgba(239,68,68,0.3)",
    warning: "WAKE UP!"
  },
  DISTRACTED: {
    label: "DISTRACTED",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.12)",
    border: "rgba(245,158,11,0.3)",
    warning: "WATCH THE ROAD!"
  },
  NO_FACE: {
    label: "NO FACE",
    color: "#6b7280",
    bg: "rgba(107,114,128,0.12)",
    border: "rgba(107,114,128,0.3)",
    warning: "NO DRIVER DETECTED"
  }
};
function useFaceDetection(videoRef, canvasRef) {
  const [driverState, setDriverState] = reactExports.useState("NO_FACE");
  const [metrics, setMetrics] = reactExports.useState({
    ear: 0,
    yaw: 1,
    pitch: 0.7
  });
  const [fps, setFps] = reactExports.useState(0);
  const [isModelLoading, setIsModelLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    let animFrameId;
    let landmarker = null;
    let disposed = false;
    const s = {
      smoothedEAR: 0.3,
      smoothedYaw: 1,
      smoothedPitch: 0.7,
      eyesClosedSince: null,
      headTurnedSince: null,
      noFaceFrames: 0,
      currentState: "NO_FACE",
      frameCount: 0,
      lastFpsTime: performance.now(),
      lastRenderTime: 0,
      currentFps: 0
    };
    async function init() {
      try {
        const { FaceLandmarker, FilesetResolver } = await import("../_libs/mediapipe__tasks-vision.mjs");
        if (disposed) return;
        const vision = await FilesetResolver.forVisionTasks(MEDIAPIPE_WASM_URL);
        if (disposed) return;
        landmarker = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: FACE_LANDMARKER_MODEL_URL,
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numFaces: 1,
          outputFaceBlendshapes: false,
          outputFacialTransformationMatrixes: false
        });
        if (disposed) {
          landmarker.close();
          return;
        }
        setIsModelLoading(false);
        detect();
      } catch (err) {
        if (!disposed) {
          console.error("Face detection init failed:", err);
          setIsModelLoading(false);
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
      if (canvas.width !== video.videoWidth) canvas.width = video.videoWidth;
      if (canvas.height !== video.videoHeight)
        canvas.height = video.videoHeight;
      const now = performance.now();
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        animFrameId = requestAnimationFrame(detect);
        return;
      }
      s.frameCount++;
      if (now - s.lastFpsTime >= 1e3) {
        s.currentFps = s.frameCount;
        s.frameCount = 0;
        s.lastFpsTime = now;
      }
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
      } else if (landmarks) {
        s.noFaceFrames = 0;
        const ear = computeEAR(landmarks);
        const pose = computeHeadPose(landmarks);
        s.smoothedEAR = ema(ear.average, s.smoothedEAR, CONFIG.EAR_SMOOTHING);
        s.smoothedYaw = ema(
          pose.yawRatio,
          s.smoothedYaw,
          CONFIG.HEAD_SMOOTHING
        );
        s.smoothedPitch = ema(
          pose.pitchRatio,
          s.smoothedPitch,
          CONFIG.HEAD_SMOOTHING
        );
        if (s.smoothedEAR < CONFIG.EAR_THRESHOLD) {
          if (!s.eyesClosedSince) s.eyesClosedSince = now;
        } else {
          s.eyesClosedSince = null;
        }
        const turned = Math.abs(s.smoothedYaw - 1) > CONFIG.YAW_THRESHOLD || s.smoothedPitch > CONFIG.PITCH_DOWN_THRESHOLD || s.smoothedPitch < CONFIG.PITCH_UP_THRESHOLD;
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
        s.smoothedEAR < CONFIG.EAR_THRESHOLD
      );
      if (now - s.lastRenderTime > CONFIG.RENDER_INTERVAL_MS) {
        setDriverState(s.currentState);
        setMetrics({
          ear: s.smoothedEAR,
          yaw: s.smoothedYaw,
          pitch: s.smoothedPitch
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
      if (landmarker) landmarker.close();
    };
  }, [videoRef, canvasRef]);
  return { driverState, metrics, fps, isModelLoading };
}
const MIME_PRIORITY = [
  "video/webm;codecs=vp9,opus",
  "video/webm;codecs=vp8,opus",
  "video/webm",
  "video/mp4"
];
function getSupportedMimeType() {
  if (typeof MediaRecorder === "undefined") return "";
  for (const type of MIME_PRIORITY) {
    if (MediaRecorder.isTypeSupported(type)) return type;
  }
  return "";
}
function formatDuration(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
function useMediaRecorder(stream) {
  const [isRecording, setIsRecording] = reactExports.useState(false);
  const [duration, setDuration] = reactExports.useState(0);
  const recorderRef = reactExports.useRef(null);
  const chunksRef = reactExports.useRef([]);
  const intervalRef = reactExports.useRef(null);
  const startRecording = reactExports.useCallback(() => {
    if (!stream || recorderRef.current?.state === "recording") return;
    chunksRef.current = [];
    const mimeType = getSupportedMimeType();
    const recorder = new MediaRecorder(
      stream,
      mimeType ? { mimeType } : void 0
    );
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.start(1e3);
    recorderRef.current = recorder;
    setIsRecording(true);
    setDuration(0);
    intervalRef.current = setInterval(() => {
      setDuration((d) => d + 1);
    }, 1e3);
  }, [stream]);
  const stopRecording = reactExports.useCallback(() => {
    return new Promise((resolve) => {
      const recorder = recorderRef.current;
      if (!recorder || recorder.state === "inactive") {
        resolve(null);
        return;
      }
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "video/webm"
        });
        resolve(blob);
      };
      recorder.stop();
      setIsRecording(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    });
  }, []);
  reactExports.useEffect(() => {
    return () => {
      if (recorderRef.current?.state === "recording") {
        recorderRef.current.stop();
      }
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);
  return { isRecording, duration, startRecording, stopRecording };
}
function useSpeed() {
  const [state, setState] = reactExports.useState({
    speedKmh: null,
    hasPermission: null,
    error: null
  });
  reactExports.useEffect(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setState((prev) => ({
        ...prev,
        error: "Geolocation is not available on this device."
      }));
      return;
    }
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const speedMs = position.coords.speed;
        const speedKmh = typeof speedMs === "number" && !Number.isNaN(speedMs) ? Math.max(0, speedMs * 3.6) : null;
        setState({
          speedKmh,
          hasPermission: true,
          error: null
        });
      },
      (error) => {
        setState((prev) => ({
          ...prev,
          hasPermission: error.code === error.PERMISSION_DENIED ? false : prev.hasPermission,
          error: error.message
        }));
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1e3,
        timeout: 5e3
      }
    );
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);
  return state;
}
function useCrashDetection({
  speedKmh = null,
  gThreshold = 3,
  // Speed threshold currently disabled — we only use g-force.
  speedThresholdKmh = 0,
  debounceMs = 5e3,
  onCrash
}) {
  const [state, setState] = reactExports.useState({
    isCrashLikely: false,
    lastImpactG: null,
    lastSpeedKmh: null,
    triggeredAt: null,
    currentG: null,
    ax: null,
    ay: null,
    az: null
  });
  const lastTriggerRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (typeof window === "undefined") return;
    if (typeof DeviceMotionEvent === "undefined") {
      return;
    }
    if (typeof DeviceMotionEvent === "undefined") {
      return;
    }
    const handleMotion = (event) => {
      let acc = event.acceleration;
      let usingIncludingGravity = false;
      if (!acc || (acc.x == null || Number.isNaN(acc.x)) && (acc.y == null || Number.isNaN(acc.y)) && (acc.z == null || Number.isNaN(acc.z))) {
        acc = event.accelerationIncludingGravity;
        usingIncludingGravity = true;
      }
      if (!acc) return;
      const ax = acc.x ?? 0;
      const ay = acc.y ?? 0;
      const az = acc.z ?? 0;
      const magnitudeMs2 = Math.sqrt(ax * ax + ay * ay + az * az);
      let g = magnitudeMs2 / 9.80665;
      if (usingIncludingGravity) {
        g = Math.max(0, g - 1);
      }
      if (!Number.isFinite(g)) return;
      const now = Date.now();
      const shouldTriggerCrash = g >= gThreshold;
      if (shouldTriggerCrash && lastTriggerRef.current !== null && now - lastTriggerRef.current < debounceMs) {
        setState((prev) => ({
          ...prev,
          currentG: g,
          ax,
          ay,
          az
        }));
        return;
      }
      if (shouldTriggerCrash) {
        lastTriggerRef.current = now;
        setState((prev) => ({
          ...prev,
          isCrashLikely: true,
          lastImpactG: g,
          lastSpeedKmh: speedKmh ?? null,
          triggeredAt: now,
          currentG: g,
          ax,
          ay,
          az
        }));
        onCrash?.({
          g,
          speedKmh: speedKmh ?? null
        });
      } else {
        setState((prev) => ({
          ...prev,
          currentG: g,
          ax,
          ay,
          az
        }));
      }
    };
    window.addEventListener("devicemotion", handleMotion);
    return () => {
      window.removeEventListener("devicemotion", handleMotion);
    };
  }, [debounceMs, gThreshold, onCrash, speedKmh, speedThresholdKmh]);
  return state;
}
async function requestMotionPermission() {
  if (typeof DeviceMotionEvent === "undefined") {
    return "unavailable";
  }
  const anyDM = DeviceMotionEvent;
  if (typeof anyDM.requestPermission !== "function") {
    return "unavailable";
  }
  try {
    const result = await anyDM.requestPermission();
    return result === "granted" ? "granted" : "denied";
  } catch {
    return "denied";
  }
}
const COOLDOWN_MS = 1e4;
const STATE_SEVERITY = {
  ALERT: "info",
  DROWSY: "warning",
  DISTRACTED: "warning",
  ASLEEP: "critical",
  NO_FACE: "info"
};
const STATE_SUMMARY = {
  ALERT: "Driver alert and attentive",
  DROWSY: "Driver showing signs of drowsiness",
  DISTRACTED: "Driver distracted - not watching the road",
  ASLEEP: "Driver appears to be asleep",
  NO_FACE: "Driver face not detected"
};
function useDriverEventLogger(driverState, metrics, camera = "front") {
  const prevStateRef = reactExports.useRef(driverState);
  const lastLogTimeRef = reactExports.useRef(0);
  reactExports.useEffect(() => {
    if (driverState === prevStateRef.current) return;
    prevStateRef.current = driverState;
    if (driverState === "ALERT" || driverState === "NO_FACE") return;
    const now = Date.now();
    if (now - lastLogTimeRef.current < COOLDOWN_MS) return;
    lastLogTimeRef.current = now;
    const session = getActiveSession();
    if (!session) return;
    client.logDriverEvent({
      sessionId: session.sessionId,
      elapsedSec: Math.max(0, session.elapsedSec),
      type: "driver_state",
      summary: STATE_SUMMARY[driverState],
      severity: STATE_SEVERITY[driverState],
      camera,
      metadata: {
        state: driverState,
        ear: Number(metrics.ear.toFixed(3)),
        yaw: Number(metrics.yaw.toFixed(3)),
        pitch: Number(metrics.pitch.toFixed(3))
      }
    }).catch(() => {
    });
  }, [driverState, metrics, camera]);
}
function SaveRecordingDialog({ pending, sessionId, score, onDone }) {
  const [saving, setSaving] = reactExports.useState(false);
  const mins = Math.floor(pending.duration / 60).toString().padStart(2, "0");
  const secs = (pending.duration % 60).toString().padStart(2, "0");
  const handleSave = async () => {
    setSaving(true);
    try {
      await saveRecording(pending.blob, pending.duration, pending.mimeType, sessionId, score);
    } catch (e) {
      console.error("Failed to save recording", e);
    }
    setSaving(false);
    onDone();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-zinc-900 border border-white/10 px-6 py-5 mx-4 w-full max-w-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white font-bold text-base text-center", children: "Save recording?" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-white/40 text-xs text-center mt-1", children: [
      mins,
      ":",
      secs,
      " · Add to replays"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 mt-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onDone,
          disabled: saving,
          className: "flex-1 rounded-xl bg-white/10 py-3 text-sm font-semibold text-white/70",
          children: "Discard"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: handleSave,
          disabled: saving,
          className: "flex-1 rounded-xl bg-red-500 py-3 text-sm font-bold text-white disabled:opacity-50",
          children: saving ? "Saving…" : "Save"
        }
      )
    ] })
  ] }) });
}
function CameraPicker({
  devices,
  driverDeviceId,
  roadDeviceId,
  onDriverChange,
  onRoadChange
}) {
  const [open, setOpen] = reactExports.useState(false);
  if (devices.length < 2) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute right-4 top-4 z-30", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => setOpen((o) => !o),
        className: "flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { size: 14 }),
          "Cameras",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ChevronDown,
            {
              size: 12,
              className: `transition-transform ${open ? "rotate-180" : ""}`
            }
          )
        ]
      }
    ),
    open && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 w-56 rounded-xl border border-white/10 bg-black/80 p-3 backdrop-blur-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/40", children: "Driver Camera" }),
      devices.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => {
            onDriverChange(d.deviceId);
            setOpen(false);
          },
          className: `mb-1 block w-full truncate rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors ${driverDeviceId === d.deviceId ? "bg-white/20 font-semibold text-white" : "text-white/60 hover:bg-white/10 hover:text-white"}`,
          children: d.label
        },
        `driver-${d.deviceId}`
      )),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "my-2 border-t border-white/10" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/40", children: "Road Camera" }),
      devices.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => {
            onRoadChange(d.deviceId);
            setOpen(false);
          },
          className: `mb-1 block w-full truncate rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors ${roadDeviceId === d.deviceId ? "bg-white/20 font-semibold text-white" : "text-white/60 hover:bg-white/10 hover:text-white"}`,
          children: d.label
        },
        `road-${d.deviceId}`
      ))
    ] })
  ] });
}
function DriverCamera({
  videoRef,
  canvasRef,
  isReady,
  variant = "pip"
}) {
  if (variant === "main") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "video",
        {
          ref: videoRef,
          className: "h-full w-full object-cover",
          style: {
            transform: "scaleX(-1)",
            display: isReady ? void 0 : "none"
          },
          playsInline: true,
          muted: true
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "canvas",
        {
          ref: canvasRef,
          className: "absolute inset-0 h-full w-full",
          style: { transform: "scaleX(-1)" }
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "absolute bottom-4 left-4 z-10 h-36 w-28 overflow-hidden rounded-xl border-2 border-white/20 shadow-lg transition-opacity sm:h-48 sm:w-36",
      style: {
        opacity: isReady ? 1 : 0,
        pointerEvents: isReady ? "auto" : "none"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "video",
          {
            ref: videoRef,
            className: "h-full w-full object-cover",
            style: { transform: "scaleX(-1)" },
            playsInline: true,
            muted: true
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "canvas",
          {
            ref: canvasRef,
            className: "absolute inset-0 h-full w-full",
            style: { transform: "scaleX(-1)" }
          }
        )
      ]
    }
  );
}
const EAR_OPEN_REF = 0.32;
function MetricsBar({
  metrics,
  driverState
}) {
  const display = STATE_DISPLAY[driverState];
  const headDir = getHeadDirection(metrics.yaw, metrics.pitch);
  const eyePct = Math.min(100, Math.round(metrics.ear / EAR_OPEN_REF * 100));
  const eyeOpen = metrics.ear >= CONFIG.EAR_THRESHOLD;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "z-10 flex items-stretch divide-x divide-white/10 bg-black/80 backdrop-blur-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      MetricPill,
      {
        label: "Eyes",
        value: `${eyePct}%`,
        sub: eyeOpen ? "Open" : "Closed",
        color: eyeOpen ? "#22c55e" : "#ef4444"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      MetricPill,
      {
        label: "Direction",
        value: headDir,
        sub: `yaw ${metrics.yaw.toFixed(1)}`,
        color: Math.abs(metrics.yaw - 1) > CONFIG.YAW_THRESHOLD ? "#f59e0b" : "#22c55e"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      MetricPill,
      {
        label: "Tilt",
        value: metrics.pitch > CONFIG.PITCH_DOWN_THRESHOLD ? "Down" : metrics.pitch < CONFIG.PITCH_UP_THRESHOLD ? "Up" : "Level",
        sub: `pitch ${metrics.pitch.toFixed(1)}`,
        color: metrics.pitch > CONFIG.PITCH_DOWN_THRESHOLD || metrics.pitch < CONFIG.PITCH_UP_THRESHOLD ? "#f59e0b" : "#22c55e"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      MetricPill,
      {
        label: "Status",
        value: display.label,
        sub: "driver state",
        color: display.color
      }
    )
  ] });
}
function MetricPill({
  label,
  value,
  sub,
  color
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col items-center justify-center px-2 py-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold uppercase tracking-widest text-white/40", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: "mt-0.5 text-base font-bold leading-tight",
        style: { color },
        children: value
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-white/30", children: sub })
  ] });
}
function RecordingControls({
  isRecording,
  duration,
  onStart,
  onStop,
  disabled
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-4 right-4 z-10 flex items-center gap-3", children: [
    isRecording && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 backdrop-blur-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm font-semibold text-white", children: formatDuration(duration) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: isRecording ? onStop : onStart,
        disabled,
        className: "flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-white/80 transition-colors disabled:opacity-40",
        "aria-label": isRecording ? "Stop recording" : "Start recording",
        children: isRecording ? /* @__PURE__ */ jsxRuntimeExports.jsx(Square, { size: 22, className: "text-red-500", fill: "#ef4444" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { size: 28, className: "text-red-500", fill: "#ef4444" })
      }
    )
  ] });
}
function RoadCamera({
  videoRef,
  isAvailable,
  variant = "main"
}) {
  if (variant === "pip") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "absolute bottom-4 left-4 z-10 h-36 w-28 overflow-hidden rounded-xl border-2 border-white/20 shadow-lg transition-opacity sm:h-48 sm:w-36",
        style: {
          opacity: isAvailable ? 1 : 0,
          pointerEvents: isAvailable ? "auto" : "none"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "video",
            {
              ref: videoRef,
              className: "h-full w-full object-cover",
              playsInline: true,
              muted: true
            }
          ),
          !isAvailable && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-neutral-900", children: /* @__PURE__ */ jsxRuntimeExports.jsx(VideoOff, { size: 20, className: "text-white/30" }) })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "video",
      {
        ref: videoRef,
        className: "h-full w-full object-cover",
        style: { display: isAvailable ? void 0 : "none" },
        playsInline: true,
        muted: true
      }
    ),
    !isAvailable && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full w-full flex-col items-center justify-center gap-2 bg-neutral-900", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(VideoOff, { size: 32, className: "text-white/30" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/30", children: "Road camera unavailable" })
    ] })
  ] });
}
function StatusOverlay({
  loading,
  driverState,
  fps
}) {
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm font-medium text-white", children: "Loading face detection…" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-white/40", children: "First load may take a few seconds" })
    ] });
  }
  const display = STATE_DISPLAY[driverState];
  const isWarning = driverState !== "ALERT";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute left-0 right-0 top-0 z-10 flex items-center justify-between px-4 pt-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "rounded-full border px-4 py-1.5 text-sm font-bold tracking-widest backdrop-blur-md transition-colors duration-300",
          style: {
            borderColor: display.border,
            color: display.color,
            backgroundColor: display.bg
          },
          children: display.label
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md bg-black/50 px-2.5 py-1 font-mono text-xs text-white/60 backdrop-blur-sm", children: [
        fps,
        " FPS"
      ] })
    ] }),
    isWarning && display.warning && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "animate-pulse rounded-2xl border-2 px-6 py-3 text-center text-xl font-black tracking-widest backdrop-blur-md",
        style: {
          borderColor: display.color,
          color: display.color,
          backgroundColor: display.bg
        },
        children: display.warning
      }
    ) })
  ] });
}
function ViewModeToggle({
  mode,
  onToggle
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick: onToggle,
      className: "absolute right-4 top-14 z-20 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-all active:scale-95",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 12 }),
        mode === "road" ? "Road View" : "Face View"
      ]
    }
  );
}
function Sparkline({
  values,
  colorClass = "text-primary"
}) {
  if (!values.length) return null;
  const width = 80;
  const height = 24;
  let min = Math.min(...values);
  let max = Math.max(...values);
  if (!Number.isFinite(min) || !Number.isFinite(max)) return null;
  if (min === max) {
    min -= 0.5;
    max += 0.5;
  }
  const points = values.map((v, i) => {
    const x = values.length === 1 ? width : i / (values.length - 1) * width;
    const norm = (v - min) / (max - min);
    const y = height - norm * height;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "svg",
    {
      viewBox: `0 0 ${width} ${height}`,
      className: `h-5 w-20 ${colorClass}`,
      preserveAspectRatio: "none",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "polyline",
        {
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "1.5",
          points
        }
      )
    }
  );
}
function DriverMonitor() {
  const navigate = useNavigate();
  const devices = useCameraDevices();
  const [driverDeviceId, setDriverDeviceId] = reactExports.useState(null);
  const [roadDeviceId, setRoadDeviceId] = reactExports.useState(null);
  const [viewMode, setViewMode] = reactExports.useState("road");
  const canvasRef = reactExports.useRef(null);
  const [debugAccel, setDebugAccel] = reactExports.useState(false);
  const [accelSamples, setAccelSamples] = reactExports.useState([]);
  const [isIOS, setIsIOS] = reactExports.useState(false);
  const [motionPermissionHintShown, setMotionPermissionHintShown] = reactExports.useState(false);
  const [pendingRec, setPendingRec] = reactExports.useState(null);
  const [liveLog, setLiveLog] = reactExports.useState([]);
  const [driveSummary, setDriveSummary] = reactExports.useState(null);
  const [ending, setEnding] = reactExports.useState(false);
  const [sessionScore, setSessionScore] = reactExports.useState(null);
  const sessionIdRef = reactExports.useRef(null);
  const lastSessionIdRef = reactExports.useRef(null);
  const addLog = reactExports.useCallback((msg) => {
    const ts = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-AU", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setLiveLog((prev) => [...prev.slice(-19), `[${ts}] ${msg}`]);
  }, []);
  reactExports.useEffect(() => {
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
  const driverSource = driverDeviceId ? { deviceId: driverDeviceId } : { facingMode: "user" };
  const roadSource = roadDeviceId ? { deviceId: roadDeviceId } : { facingMode: "environment" };
  const frontCamera = useCamera(driverSource);
  const backCamera = useCamera(roadSource, frontCamera.isReady);
  const detection = useFaceDetection(frontCamera.videoRef, canvasRef);
  const frontRecorder = useMediaRecorder(frontCamera.stream);
  const backRecorder = useMediaRecorder(backCamera.stream);
  useDriverEventLogger(detection.driverState, detection.metrics, "front");
  const lastAISummaryRef = reactExports.useRef("");
  const handleFrameBatch = reactExports.useCallback(async (frames) => {
    const sessionId = sessionIdRef.current;
    if (!sessionId) return;
    try {
      const result = await client.analyseRoadFrames({
        sessionId,
        elapsedSec: Math.floor((Date.now() - (driveSessionStore.state.startedAt ?? Date.now())) / 1e3),
        frames,
        camera: "front"
      });
      if (result.severity !== "info" && result.summary !== lastAISummaryRef.current) {
        lastAISummaryRef.current = result.summary;
        addLog(`AI: [${result.severity}] ${result.summary}`);
      }
    } catch (err) {
      addLog(`AI ERROR: ${err instanceof Error ? err.message : "analysis failed"}`);
    }
  }, [addLog]);
  useFrameCapture(frontCamera.videoRef, frontRecorder.isRecording, handleFrameBatch);
  const { speedKmh } = useSpeed();
  const crash = useCrashDetection({
    speedKmh,
    onCrash: () => {
      try {
        if (typeof window !== "undefined") {
          try {
            window.alert("Crash detected. Opening emergency screen…");
          } catch {
          }
          window.sessionStorage.setItem("dashcam.crashTriggered", "1");
        }
      } catch {
      }
      navigate({ to: "/emergency" });
    }
  });
  reactExports.useEffect(() => {
    if (!debugAccel) return;
    if (crash.currentG == null || crash.ax == null || crash.ay == null || crash.az == null) {
      return;
    }
    setAccelSamples((prev) => {
      const next = [
        ...prev,
        { g: crash.currentG, ax: crash.ax, ay: crash.ay, az: crash.az }
      ];
      return next.slice(-80);
    });
  }, [debugAccel, crash.currentG, crash.ax, crash.ay, crash.az]);
  const isRecording = frontRecorder.isRecording || backRecorder.isRecording;
  const loading = !frontCamera.isReady || detection.isModelLoading;
  const handleStartRecording = reactExports.useCallback(() => {
    frontRecorder.startRecording();
    backRecorder.startRecording();
    addLog("Starting session...");
    client.startSession({}).then(({ sessionId }) => {
      sessionIdRef.current = sessionId;
      driveSessionStore.setState(() => ({ sessionId, startedAt: Date.now() }));
      addLog(`Session started: ${sessionId.slice(0, 8)}...`);
    }).catch((err) => addLog(`Session start FAILED: ${err}`));
  }, [frontRecorder, backRecorder, addLog]);
  const handleStopRecording = reactExports.useCallback(async () => {
    const duration = frontRecorder.duration || backRecorder.duration || 0;
    const [frontBlob, backBlob] = await Promise.all([
      frontRecorder.stopRecording(),
      backRecorder.stopRecording()
    ]);
    const sessionId = sessionIdRef.current;
    let finalScore = null;
    if (sessionId) {
      lastSessionIdRef.current = sessionId;
      setEnding(true);
      addLog("Ending session, generating summary...");
      try {
        const { summary, score } = await client.endSession({ sessionId });
        setDriveSummary(summary);
        finalScore = score ?? null;
        setSessionScore(finalScore);
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
      setPendingRec({
        blob,
        duration,
        mimeType: getSupportedMimeType() || "video/webm"
      });
    }
  }, [frontRecorder, backRecorder, addLog]);
  const toggleViewMode = reactExports.useCallback(() => {
    setViewMode((m) => m === "road" ? "face" : "road");
  }, []);
  if (frontCamera.error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen flex-col items-center justify-center gap-4 bg-black p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-red-800 bg-red-950 p-6 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-semibold text-red-400", children: "Camera Error" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-red-300", children: frontCamera.error }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs text-white/40", children: "Allow camera access and ensure no other app is using the webcam." })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex min-h-screen w-full flex-col bg-black", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 overflow-hidden", children: [
      crash.isCrashLikely && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-x-0 top-4 z-30 flex justify-center px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pointer-events-auto flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 animate-pulse rounded-full bg-white" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Crash detected — opening emergency screen…" })
      ] }) }),
      debugAccel && crash.currentG !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pointer-events-none absolute left-3 bottom-[112px] z-30 max-w-[60%] rounded-xl bg-black/80 px-3 py-2 text-[10px] text-white/80 backdrop-blur-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold uppercase tracking-wide text-white/60", children: "Accel Debug" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[10px] text-white", children: [
            crash.currentG.toFixed(2),
            "g"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 grid grid-cols-2 gap-x-2 gap-y-0.5 font-mono", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "ax: ",
            crash.ax?.toFixed(2)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "ay: ",
            crash.ay?.toFixed(2)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "az: ",
            crash.az?.toFixed(2)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "speed:",
            " ",
            speedKmh != null ? `${speedKmh.toFixed(1)} km/h` : "–"
          ] })
        ] }),
        debugAccel && isIOS && !motionPermissionHintShown && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 rounded bg-white/5 px-2 py-1 text-[9px] leading-snug text-white/70", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "underline",
            onClick: async () => {
              const result = await requestMotionPermission();
              if (result !== "granted") {
                setMotionPermissionHintShown(true);
              }
            },
            children: "Tap to enable motion sensors on iOS"
          }
        ) }),
        accelSamples.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-white/50", children: "g" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Sparkline,
              {
                values: accelSamples.map((s) => s.g),
                colorClass: "text-primary"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-white/50", children: "ax" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Sparkline,
              {
                values: accelSamples.map((s) => s.ax),
                colorClass: "text-secondary"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-white/50", children: "ay" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Sparkline,
              {
                values: accelSamples.map((s) => s.ay),
                colorClass: "text-accent-foreground"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-white/50", children: "az" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Sparkline,
              {
                values: accelSamples.map((s) => s.az),
                colorClass: "text-destructive"
              }
            )
          ] })
        ] })
      ] }),
      viewMode === "road" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          RoadCamera,
          {
            videoRef: backCamera.videoRef,
            isAvailable: backCamera.isReady,
            variant: "main"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          DriverCamera,
          {
            videoRef: frontCamera.videoRef,
            canvasRef,
            isReady: frontCamera.isReady,
            variant: "pip"
          }
        )
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          DriverCamera,
          {
            videoRef: frontCamera.videoRef,
            canvasRef,
            isReady: frontCamera.isReady,
            variant: "main"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          RoadCamera,
          {
            videoRef: backCamera.videoRef,
            isAvailable: backCamera.isReady,
            variant: "pip"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatusOverlay,
        {
          loading,
          driverState: detection.driverState,
          fps: detection.fps
        }
      ),
      !loading && /* @__PURE__ */ jsxRuntimeExports.jsx(ViewModeToggle, { mode: viewMode, onToggle: toggleViewMode }),
      !loading && /* @__PURE__ */ jsxRuntimeExports.jsx(
        CameraPicker,
        {
          devices,
          driverDeviceId,
          roadDeviceId,
          onDriverChange: setDriverDeviceId,
          onRoadChange: setRoadDeviceId
        }
      ),
      liveLog.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-x-3 bottom-20 z-20 max-h-28 overflow-y-auto rounded-xl bg-black/80 border border-zinc-700 px-3 py-2 backdrop-blur-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] font-semibold uppercase tracking-widest text-zinc-500 mb-1", children: "Live Log" }),
        liveLog.map((line, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] leading-relaxed text-zinc-300", children: line }, i))
      ] }),
      !loading && /* @__PURE__ */ jsxRuntimeExports.jsx(
        RecordingControls,
        {
          isRecording,
          duration: frontRecorder.duration || backRecorder.duration,
          onStart: handleStartRecording,
          onStop: handleStopRecording
        }
      )
    ] }),
    !loading && /* @__PURE__ */ jsxRuntimeExports.jsx(
      MetricsBar,
      {
        metrics: detection.metrics,
        driverState: detection.driverState
      }
    ),
    driveSummary && !isRecording && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-[90] flex items-center justify-center bg-black/70 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-white/10 bg-zinc-900 px-6 py-5 mx-4 w-full max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-widest text-zinc-500 mb-2", children: "AI Drive Summary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-relaxed text-zinc-200", children: driveSummary }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setDriveSummary(null), className: "mt-4 w-full rounded-xl bg-white/10 py-3 text-sm font-semibold text-white", children: "Dismiss" })
    ] }) }),
    ending && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-[95] flex items-center justify-center bg-black/80", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-2 border-zinc-600 border-t-white" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-zinc-400", children: "Generating drive summary..." })
    ] }) }),
    pendingRec && /* @__PURE__ */ jsxRuntimeExports.jsx(
      SaveRecordingDialog,
      {
        pending: pendingRec,
        sessionId: lastSessionIdRef.current,
        score: sessionScore,
        onDone: () => {
          setPendingRec(null);
          setSessionScore(null);
          setDriveSummary(null);
          lastSessionIdRef.current = null;
          navigate({ to: "/replay", search: { t: Date.now() } });
        }
      }
    )
  ] });
}
const SplitComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsx(DriverMonitor, {});
export {
  SplitComponent as component
};
