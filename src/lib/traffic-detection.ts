// src/lib/traffic-detection.ts
// YOLOv8n ONNX-based traffic/object detection for browser use

export const YOLO_MODEL_URL = "/models/yolov8n.onnx";
export const YOLO_INPUT_SIZE = 640; // YOLOv8n expects 640×640

/** COCO class names (80 classes) */
const COCO_CLASSES = [
  "person", "bicycle", "car", "motorcycle", "airplane", "bus", "train",
  "truck", "boat", "traffic light", "fire hydrant", "stop sign",
  "parking meter", "bench", "bird", "cat", "dog", "horse", "sheep", "cow",
  "elephant", "bear", "zebra", "giraffe", "backpack", "umbrella", "handbag",
  "tie", "suitcase", "frisbee", "skis", "snowboard", "sports ball", "kite",
  "baseball bat", "baseball glove", "skateboard", "surfboard", "tennis racket",
  "bottle", "wine glass", "cup", "fork", "knife", "spoon", "bowl", "banana",
  "apple", "sandwich", "orange", "broccoli", "carrot", "hot dog", "pizza",
  "donut", "cake", "chair", "couch", "potted plant", "bed", "dining table",
  "toilet", "tv", "laptop", "mouse", "remote", "keyboard", "cell phone",
  "microwave", "oven", "toaster", "sink", "refrigerator", "book", "clock",
  "vase", "scissors", "teddy bear", "hair drier", "toothbrush",
] as const;

/** Classes relevant to road/traffic scenes */
export const TRAFFIC_CLASSES = new Set([
  "person", "bicycle", "car", "motorcycle", "bus", "truck",
  "traffic light", "stop sign",
]);

/** Colour per class family */
export const CLASS_COLORS: Record<string, string> = {
  person: "#f97316",      // orange
  bicycle: "#06b6d4",     // cyan
  motorcycle: "#06b6d4",  // cyan
  car: "#facc15",         // yellow
  truck: "#4ade80",       // green
  bus: "#4ade80",         // green
  "traffic light": "#a78bfa", // purple
  "stop sign": "#f87171",     // red
};

export interface Detection {
  classId: number;
  label: string;
  confidence: number;
  /** [x_center, y_center, width, height] normalised 0–1 relative to *original* image */
  bbox: [number, number, number, number];
  color: string;
}

// ── ONNX runtime singleton ───────────────────────────────────────────────────

let _ortModule: typeof import("onnxruntime-web") | null = null;
async function getOrt() {
  if (!_ortModule) _ortModule = await import("onnxruntime-web");
  return _ortModule;
}

// ── ONNX session singleton ────────────────────────────────────────────────────

let sessionPromise: Promise<unknown> | null = null;

export async function loadYoloModel(): Promise<unknown> {
  if (sessionPromise) return sessionPromise;
  sessionPromise = (async () => {
    const ort = await getOrt();
    ort.env.wasm.numThreads = navigator.hardwareConcurrency > 4 ? 2 : 1;
    // Prefer WebGL GPU, fall back to WASM
    ort.env.wasm.wasmPaths = "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.24.3/dist/";
    const opts: Record<string, unknown> = { executionProviders: ["webgl", "wasm"] };
    try {
      const sess = await ort.InferenceSession.create(YOLO_MODEL_URL, opts);
      console.log("[TrafficDetect] Model loaded (WebGL/WASM)");
      return sess;
    } catch (err: any) {
      console.warn("[TrafficDetect] WebGL failed:", err?.message || err);
      try {
        const sess = await ort.InferenceSession.create(YOLO_MODEL_URL, {
          executionProviders: ["wasm"],
        });
        console.log("[TrafficDetect] Model loaded (WASM)");
        return sess;
      } catch (wasmErr: any) {
        console.error("[TrafficDetect] WASM also failed:", wasmErr?.message || wasmErr);
        throw wasmErr;
      }
    }
  })();
  return sessionPromise;
}

// ── Pre/post processing ──────────────────────────────────────────────────────

let _offscreen: HTMLCanvasElement | null = null;
let _offCtx: CanvasRenderingContext2D | null = null;

/** Resize & normalize a video frame into a Float32 NCHW tensor [1, 3, 640, 640] */
function preprocessFrame(video: HTMLVideoElement, size: number): Float32Array {
  if (!_offscreen) {
    _offscreen = document.createElement("canvas");
    _offscreen.width = size;
    _offscreen.height = size;
    _offCtx = _offscreen.getContext("2d")!;
  }
  _offCtx!.drawImage(video, 0, 0, size, size);
  const { data } = _offCtx!.getImageData(0, 0, size, size); // RGBA uint8

  const tensor = new Float32Array(3 * size * size);
  for (let i = 0; i < size * size; i++) {
    tensor[i]                 = data[i * 4]     / 255; // R
    tensor[i + size * size]   = data[i * 4 + 1] / 255; // G
    tensor[i + size * size * 2] = data[i * 4 + 2] / 255; // B
  }
  return tensor;
}

/** IoU of two [cx,cy,w,h] boxes */
function iou(a: number[], b: number[]) {
  const ax1 = a[0] - a[2] / 2, ay1 = a[1] - a[3] / 2;
  const ax2 = a[0] + a[2] / 2, ay2 = a[1] + a[3] / 2;
  const bx1 = b[0] - b[2] / 2, by1 = b[1] - b[3] / 2;
  const bx2 = b[0] + b[2] / 2, by2 = b[1] + b[3] / 2;
  const ix = Math.max(0, Math.min(ax2, bx2) - Math.max(ax1, bx1));
  const iy = Math.max(0, Math.min(ay2, by2) - Math.max(ay1, by1));
  const inter = ix * iy;
  const union = (ax2 - ax1) * (ay2 - ay1) + (bx2 - bx1) * (by2 - by1) - inter;
  return union > 0 ? inter / union : 0;
}

/** Simple NMS */
function nms(dets: Detection[], iouThresh = 0.45): Detection[] {
  dets.sort((a, b) => b.confidence - a.confidence);
  const keep: Detection[] = [];
  const suppressed = new Set<number>();
  for (let i = 0; i < dets.length; i++) {
    if (suppressed.has(i)) continue;
    keep.push(dets[i]);
    for (let j = i + 1; j < dets.length; j++) {
      if (suppressed.has(j)) continue;
      if (dets[i].classId === dets[j].classId && iou(dets[i].bbox, dets[j].bbox) > iouThresh) {
        suppressed.add(j);
      }
    }
  }
  return keep;
}

// ── Main inference ────────────────────────────────────────────────────────────

export async function runDetection(
  session: unknown,
  video: HTMLVideoElement,
  confThresh = 0.45,
): Promise<Detection[]> {
  const ort = await getOrt();
  const size = YOLO_INPUT_SIZE;
  const data = preprocessFrame(video, size);
  const tensor = new ort.Tensor("float32", data, [1, 3, size, size]);

  // YOLOv8 feeds: "images"
  const feeds: Record<string, unknown> = { images: tensor };
  const out = await (session as { run: (f: Record<string, unknown>) => Promise<Record<string, { data: Float32Array; dims: number[] }>> }).run(feeds);

  // YOLOv8 output: shape [1, 84, 8400] — rows = [cx,cy,w,h, class0…class79]
  const output = out["output0"] || out[Object.keys(out)[0]];
  const [, , numDets] = output.dims; // 8400
  const raw = output.data;

  const dets: Detection[] = [];
  for (let d = 0; d < numDets; d++) {
    // cx, cy, w, h are rows 0–3; class scores are rows 4–83
    const cx = raw[0 * numDets + d];
    const cy = raw[1 * numDets + d];
    const w  = raw[2 * numDets + d];
    const h  = raw[3 * numDets + d];

    let maxScore = 0;
    let classId = 0;
    for (let c = 0; c < 80; c++) {
      const score = raw[(4 + c) * numDets + d];
      if (score > maxScore) { maxScore = score; classId = c; }
    }
    if (maxScore < confThresh) continue;

    const label = COCO_CLASSES[classId];
    if (!TRAFFIC_CLASSES.has(label)) continue;

    dets.push({
      classId,
      label,
      confidence: maxScore,
      // Normalise to 0–1
      bbox: [cx / size, cy / size, w / size, h / size],
      color: CLASS_COLORS[label] ?? "#ffffff",
    });
  }

  return nms(dets);
}
