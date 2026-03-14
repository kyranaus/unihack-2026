// ===================================================================
// Driver Monitor — Detection Utilities
// ===================================================================
//
// WHY BROWSER-BASED FACE LANDMARKS OVER YOLO?
// MediaPipe Face Mesh runs entirely in-browser via WASM+GPU, providing
// 478 facial landmarks at ~30fps with zero backend. YOLO-based drowsiness
// detection would require a custom-trained model, server-side inference,
// and a heavier pipeline — overkill for an MVP where eye openness and
// head pose can be derived purely from geometric landmark distances.
//
// NEXT STEPS:
// - Yawn detection via mouth landmark distances (upper/lower lip gap)
// - Phone-use detection via hand landmarks near face region
// - Road-facing camera: YOLO object detection for obstacles/pedestrians
// - Incident report generation: log risky events w/ timestamps + screenshots
// ===================================================================

// ==================== TYPES ====================

export type DriverState = "ALERT" | "DROWSY" | "DISTRACTED" | "NO_FACE";

export interface SmoothedMetrics {
  ear: number;
  yaw: number;
  pitch: number;
}

// ==================== TUNABLE THRESHOLDS ====================
// Adjust these constants to calibrate sensitivity per user / camera setup.

export const CONFIG = {
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
  DISTRACTED_TIME_MS: 2000,
  /** Consecutive frames without a face before NO_FACE (~0.5s at 30fps) */
  NO_FACE_FRAME_THRESHOLD: 15,
  /** React state update interval to avoid excessive re-renders */
  RENDER_INTERVAL_MS: 80,
} as const;

// ==================== MEDIAPIPE WASM + MODEL URLS ====================
// Pinned to match the installed npm package version for WASM compatibility.

export const MEDIAPIPE_WASM_URL =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.32/wasm";

export const FACE_LANDMARKER_MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task";

// ==================== LANDMARK INDICES ====================
// MediaPipe Face Mesh provides 478 landmarks. We reference specific indices
// for eye openness and head pose estimation.

// 6-point Eye Aspect Ratio landmarks per eye
const RIGHT_EYE = {
  outer: 33,
  upperOuter: 160,
  upperInner: 158,
  inner: 133,
  lowerInner: 153,
  lowerOuter: 144,
};

const LEFT_EYE = {
  inner: 362,
  upperInner: 385,
  upperOuter: 387,
  outer: 263,
  lowerOuter: 373,
  lowerInner: 380,
};

// Head pose reference points
const NOSE_TIP = 1;
const FOREHEAD = 10;
const CHIN = 152;
const LEFT_CHEEK = 234;
const RIGHT_CHEEK = 454;

// Contour index sequences for canvas drawing
const RIGHT_EYE_CONTOUR = [
  33, 246, 161, 160, 159, 158, 157, 173, 133, 155, 154, 153, 145, 144, 163,
  7, 33,
];
const LEFT_EYE_CONTOUR = [
  362, 398, 384, 385, 386, 387, 388, 466, 263, 249, 390, 373, 374, 380, 381,
  382, 362,
];
const FACE_OVAL = [
  10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379,
  378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127,
  162, 21, 54, 103, 67, 109, 10,
];

// ==================== MATH HELPERS ====================

interface Point {
  x: number;
  y: number;
  z: number;
}

function dist(a: Point, b: Point): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

/** Exponential Moving Average for signal smoothing. */
export function ema(
  current: number,
  previous: number,
  alpha: number,
): number {
  return alpha * current + (1 - alpha) * previous;
}

// ==================== DETECTION FUNCTIONS ====================

/**
 * Eye Aspect Ratio (EAR): ratio of vertical to horizontal eye opening.
 * ~0.3 when eyes are open, drops toward 0 as they close.
 * Uses 6 landmarks per eye — 2 vertical pairs + 1 horizontal pair.
 *
 *   EAR = (|p2 - p6| + |p3 - p5|) / (2 * |p1 - p4|)
 */
export function computeEAR(landmarks: Point[]): {
  left: number;
  right: number;
  average: number;
} {
  const rightV1 = dist(
    landmarks[RIGHT_EYE.upperOuter],
    landmarks[RIGHT_EYE.lowerOuter],
  );
  const rightV2 = dist(
    landmarks[RIGHT_EYE.upperInner],
    landmarks[RIGHT_EYE.lowerInner],
  );
  const rightH = dist(
    landmarks[RIGHT_EYE.outer],
    landmarks[RIGHT_EYE.inner],
  );
  const rightEAR = rightH > 0.001 ? (rightV1 + rightV2) / (2 * rightH) : 0;

  const leftV1 = dist(
    landmarks[LEFT_EYE.upperInner],
    landmarks[LEFT_EYE.lowerInner],
  );
  const leftV2 = dist(
    landmarks[LEFT_EYE.upperOuter],
    landmarks[LEFT_EYE.lowerOuter],
  );
  const leftH = dist(landmarks[LEFT_EYE.inner], landmarks[LEFT_EYE.outer]);
  const leftEAR = leftH > 0.001 ? (leftV1 + leftV2) / (2 * leftH) : 0;

  return {
    left: leftEAR,
    right: rightEAR,
    average: (leftEAR + rightEAR) / 2,
  };
}

/**
 * Estimates head yaw (left/right) and pitch (up/down) from landmark
 * asymmetry — a lightweight alternative to full 3D pose estimation.
 *
 * yawRatio ≈ 1.0 when centered. <1 = turned right, >1 = turned left.
 * pitchRatio ≈ 0.7 when centered. Higher = down, lower = up.
 */
export function computeHeadPose(landmarks: Point[]): {
  yawRatio: number;
  pitchRatio: number;
} {
  const nose = landmarks[NOSE_TIP];
  const forehead = landmarks[FOREHEAD];
  const chin = landmarks[CHIN];
  const left = landmarks[LEFT_CHEEK];
  const right = landmarks[RIGHT_CHEEK];

  // Yaw: compare horizontal distance from nose to each face edge
  const leftDist = nose.x - left.x;
  const rightDist = right.x - nose.x;
  const yawRatio = rightDist > 0.001 ? leftDist / rightDist : 1.0;

  // Pitch: compare vertical distance from forehead→nose vs nose→chin
  const topDist = nose.y - forehead.y;
  const bottomDist = chin.y - nose.y;
  const pitchRatio = bottomDist > 0.001 ? topDist / bottomDist : 0.7;

  return { yawRatio, pitchRatio };
}

/**
 * Converts smoothed yaw/pitch metrics into a human-readable direction label.
 */
export function getHeadDirection(yaw: number, pitch: number): string {
  const yawOk = Math.abs(yaw - 1.0) <= CONFIG.YAW_THRESHOLD;
  const pitchOk =
    pitch <= CONFIG.PITCH_DOWN_THRESHOLD && pitch >= CONFIG.PITCH_UP_THRESHOLD;

  if (yawOk && pitchOk) return "Forward";

  const parts: string[] = [];
  if (yaw < 1.0 - CONFIG.YAW_THRESHOLD) parts.push("Right");
  else if (yaw > 1.0 + CONFIG.YAW_THRESHOLD) parts.push("Left");
  if (pitch > CONFIG.PITCH_DOWN_THRESHOLD) parts.push("Down");
  else if (pitch < CONFIG.PITCH_UP_THRESHOLD) parts.push("Up");
  return parts.join(" + ") || "Forward";
}

// ==================== CANVAS OVERLAY DRAWING ====================

/**
 * Draws lightweight face landmarks on the canvas overlay:
 * - Face oval silhouette (teal)
 * - Eye contours (green when open, red when closed)
 * - Nose direction line
 */
export function drawOverlay(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  landmarks: Point[] | null,
  earBelowThreshold: boolean,
  skipClear = false,
): void {
  if (!skipClear) ctx.clearRect(0, 0, w, h);
  if (!landmarks) return;

  // Face oval
  drawPath(ctx, landmarks, FACE_OVAL, w, h, "rgba(79,184,178,0.3)", 1.5);

  // Eye contours — color-coded by openness
  const eyeColor = earBelowThreshold
    ? "rgba(239,68,68,0.8)"
    : "rgba(34,197,94,0.7)";
  drawPath(ctx, landmarks, RIGHT_EYE_CONTOUR, w, h, eyeColor, 2);
  drawPath(ctx, landmarks, LEFT_EYE_CONTOUR, w, h, eyeColor, 2);

  // Direction indicator: forehead → nose
  const nose = landmarks[NOSE_TIP];
  const forehead = landmarks[FOREHEAD];
  ctx.beginPath();
  ctx.strokeStyle = "rgba(79,184,178,0.5)";
  ctx.lineWidth = 2;
  ctx.moveTo(forehead.x * w, forehead.y * h);
  ctx.lineTo(nose.x * w, nose.y * h);
  ctx.stroke();

  // Nose dot
  ctx.beginPath();
  ctx.fillStyle = "rgba(79,184,178,0.8)";
  ctx.arc(nose.x * w, nose.y * h, 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawPath(
  ctx: CanvasRenderingContext2D,
  landmarks: Point[],
  indices: number[],
  w: number,
  h: number,
  color: string,
  lineWidth: number,
): void {
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

// ==================== STATE DISPLAY CONFIG ====================

export const STATE_DISPLAY: Record<
  DriverState,
  {
    label: string;
    color: string;
    bg: string;
    border: string;
    warning?: string;
  }
> = {
  ALERT: {
    label: "ALERT",
    color: "#22c55e",
    bg: "rgba(34,197,94,0.12)",
    border: "rgba(34,197,94,0.3)",
  },
  DROWSY: {
    label: "DROWSY",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.12)",
    border: "rgba(239,68,68,0.3)",
    warning: "WAKE UP!",
  },
  DISTRACTED: {
    label: "DISTRACTED",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.12)",
    border: "rgba(245,158,11,0.3)",
    warning: "WATCH THE ROAD!",
  },
  NO_FACE: {
    label: "NO FACE",
    color: "#6b7280",
    bg: "rgba(107,114,128,0.12)",
    border: "rgba(107,114,128,0.3)",
    warning: "NO DRIVER DETECTED",
  },
};
