// src/workers/traffic-detection-worker.ts
// Web Worker for YOLO traffic detection inference — keeps main thread free.

import { InferenceSession, Tensor, env } from "onnxruntime-web/webgpu";

const YOLO_INPUT_SIZE = 320;
const INV_SIZE = 1 / YOLO_INPUT_SIZE;

const COCO_CLASSES = [
	"person",
	"bicycle",
	"car",
	"motorcycle",
	"airplane",
	"bus",
	"train",
	"truck",
	"boat",
	"traffic light",
	"fire hydrant",
	"stop sign",
	"parking meter",
	"bench",
	"bird",
	"cat",
	"dog",
	"horse",
	"sheep",
	"cow",
	"elephant",
	"bear",
	"zebra",
	"giraffe",
	"backpack",
	"umbrella",
	"handbag",
	"tie",
	"suitcase",
	"frisbee",
	"skis",
	"snowboard",
	"sports ball",
	"kite",
	"baseball bat",
	"baseball glove",
	"skateboard",
	"surfboard",
	"tennis racket",
	"bottle",
	"wine glass",
	"cup",
	"fork",
	"knife",
	"spoon",
	"bowl",
	"banana",
	"apple",
	"sandwich",
	"orange",
	"broccoli",
	"carrot",
	"hot dog",
	"pizza",
	"donut",
	"cake",
	"chair",
	"couch",
	"potted plant",
	"bed",
	"dining table",
	"toilet",
	"tv",
	"laptop",
	"mouse",
	"remote",
	"keyboard",
	"cell phone",
	"microwave",
	"oven",
	"toaster",
	"sink",
	"refrigerator",
	"book",
	"clock",
	"vase",
	"scissors",
	"teddy bear",
	"hair drier",
	"toothbrush",
] as const;

// COCO class indices for traffic-relevant classes — only scan these 8 instead of all 80
const TRAFFIC_CLASS_INDICES = [0, 1, 2, 3, 5, 7, 9, 11]; // person,bicycle,car,motorcycle,bus,truck,traffic light,stop sign

const CLASS_COLORS: Record<string, string> = {
	person: "#f97316",
	bicycle: "#06b6d4",
	motorcycle: "#06b6d4",
	car: "#facc15",
	truck: "#4ade80",
	bus: "#4ade80",
	"traffic light": "#a78bfa",
	"stop sign": "#f87171",
};

interface Detection {
	classId: number;
	label: string;
	confidence: number;
	bbox: [number, number, number, number];
	color: string;
}

// ── State ────────────────────────────────────────────────────────────────────

let session: InferenceSession | null = null;
let tensorBuf: Float32Array | null = null;
const offscreen = new OffscreenCanvas(320, 320);
const offCtx = offscreen.getContext("2d", { willReadFrequently: true })!;

// ── Preprocessing ────────────────────────────────────────────────────────────

function preprocess(bitmap: ImageBitmap): Float32Array {
	const size = YOLO_INPUT_SIZE;
	offCtx.drawImage(bitmap, 0, 0, size, size);
	const { data } = offCtx.getImageData(0, 0, size, size);

	const pixels = size * size;
	if (!tensorBuf || tensorBuf.length !== 3 * pixels) {
		tensorBuf = new Float32Array(3 * pixels);
	}
	const t = tensorBuf;
	const p1 = pixels;
	const p2 = pixels * 2;
	for (let i = 0, j = 0; i < pixels; i++, j += 4) {
		t[i] = data[j] * 0.00392156862;
		t[i + p1] = data[j + 1] * 0.00392156862;
		t[i + p2] = data[j + 2] * 0.00392156862;
	}
	return t;
}

// ── NMS ──────────────────────────────────────────────────────────────────────

function iou(a: number[], b: number[]) {
	const ax1 = a[0] - a[2] / 2,
		ay1 = a[1] - a[3] / 2;
	const ax2 = a[0] + a[2] / 2,
		ay2 = a[1] + a[3] / 2;
	const bx1 = b[0] - b[2] / 2,
		by1 = b[1] - b[3] / 2;
	const bx2 = b[0] + b[2] / 2,
		by2 = b[1] + b[3] / 2;
	const ix = Math.max(0, Math.min(ax2, bx2) - Math.max(ax1, bx1));
	const iy = Math.max(0, Math.min(ay2, by2) - Math.max(ay1, by1));
	const inter = ix * iy;
	const union = (ax2 - ax1) * (ay2 - ay1) + (bx2 - bx1) * (by2 - by1) - inter;
	return union > 0 ? inter / union : 0;
}

function nms(dets: Detection[], iouThresh = 0.45): Detection[] {
	dets.sort((a, b) => b.confidence - a.confidence);
	const keep: Detection[] = [];
	const suppressed = new Set<number>();
	for (let i = 0; i < dets.length; i++) {
		if (suppressed.has(i)) continue;
		keep.push(dets[i]);
		for (let j = i + 1; j < dets.length; j++) {
			if (suppressed.has(j)) continue;
			if (
				dets[i].classId === dets[j].classId &&
				iou(dets[i].bbox, dets[j].bbox) > iouThresh
			) {
				suppressed.add(j);
			}
		}
	}
	return keep;
}

// ── Postprocessing ───────────────────────────────────────────────────────────

function postprocess(
	raw: Float32Array,
	numDets: number,
	confThresh: number,
): Detection[] {
	const dets: Detection[] = [];
	const tci = TRAFFIC_CLASS_INDICES;
	const tciLen = tci.length;

	for (let d = 0; d < numDets; d++) {
		let maxScore = 0;
		let classId = 0;
		// Only check the 8 traffic-relevant class scores instead of all 80
		for (let k = 0; k < tciLen; k++) {
			const c = tci[k];
			const score = raw[(4 + c) * numDets + d];
			if (score > maxScore) {
				maxScore = score;
				classId = c;
			}
		}
		if (maxScore < confThresh) continue;
		const label = COCO_CLASSES[classId];
		dets.push({
			classId,
			label,
			confidence: maxScore,
			bbox: [
				raw[d] * INV_SIZE,
				raw[numDets + d] * INV_SIZE,
				raw[2 * numDets + d] * INV_SIZE,
				raw[3 * numDets + d] * INV_SIZE,
			],
			color: CLASS_COLORS[label] ?? "#ffffff",
		});
	}
	return nms(dets);
}

// ── Message handler ──────────────────────────────────────────────────────────

self.addEventListener("message", async (event: MessageEvent) => {
	const { type } = event.data;

	if (type === "LOAD_MODEL") {
		const { modelUrl, backend: requestedBackend } = event.data as {
			type: string;
			modelUrl: string;
			backend: string;
		};
		// WebGPU may not be available in workers on all browsers
		const gpuAvailable =
			requestedBackend === "webgpu" &&
			typeof navigator !== "undefined" &&
			"gpu" in navigator;
		const backend = gpuAvailable ? "webgpu" : "wasm";

		try {
			env.wasm.wasmPaths =
				"https://cdn.jsdelivr.net/npm/onnxruntime-web@1.24.3/dist/";
			env.wasm.numThreads = 1;

			if (backend === "webgpu") {
				(env.webgpu as any).powerPreference = "high-performance";
			}

			const opts: InferenceSession.SessionOptions = {
				executionProviders: [backend as any],
			};

			session = await InferenceSession.create(modelUrl, opts);

			// Warm-up: first run triggers shader compilation / JIT
			const size = YOLO_INPUT_SIZE;
			const dummy = new Tensor("float32", new Float32Array(3 * size * size), [
				1,
				3,
				size,
				size,
			]);
			const warmup = await session.run({ images: dummy });
			const outKey = Object.keys(warmup)[0];
			warmup[outKey].dispose();
			dummy.dispose();

			self.postMessage({ type: "MODEL_LOADED", backend });
		} catch (err: any) {
			// If WebGPU/WebGL failed, retry with WASM
			if (backend !== "wasm") {
				console.warn(
					`[TrafficWorker] ${backend} failed, retrying WASM:`,
					err?.message,
				);
				try {
					session = await InferenceSession.create(modelUrl, {
						executionProviders: ["wasm"],
					});
					const size = YOLO_INPUT_SIZE;
					const dummy = new Tensor(
						"float32",
						new Float32Array(3 * size * size),
						[1, 3, size, size],
					);
					const warmup = await session.run({ images: dummy });
					const outKey = Object.keys(warmup)[0];
					warmup[outKey].dispose();
					dummy.dispose();
					self.postMessage({ type: "MODEL_LOADED", backend: "wasm" });
				} catch (wasmErr: any) {
					self.postMessage({
						type: "MODEL_ERROR",
						error: wasmErr?.message || "Failed to load model",
					});
				}
			} else {
				self.postMessage({
					type: "MODEL_ERROR",
					error: err?.message || "Failed to load model",
				});
			}
		}
	}

	if (type === "DETECT") {
		if (!session) return;
		const { bitmap, confThresh, id } = event.data as {
			type: string;
			bitmap: ImageBitmap;
			confThresh: number;
			id: number;
		};

		try {
			const t0 = performance.now();
			const data = preprocess(bitmap);
			bitmap.close();
			const t1 = performance.now();

			const size = YOLO_INPUT_SIZE;
			const tensor = new Tensor("float32", data, [1, 3, size, size]);
			const out = await session.run({ images: tensor });
			tensor.dispose();
			const t2 = performance.now();

			const output = out.output0 ?? out[Object.keys(out)[0]];
			const numDets = output.dims[2];
			const raw = output.data as Float32Array;
			const dets = postprocess(raw, numDets, confThresh);
			output.dispose();
			const t3 = performance.now();

			self.postMessage({
				type: "DETECTIONS",
				detections: dets,
				id,
				timing: {
					preprocess: +(t1 - t0).toFixed(1),
					inference: +(t2 - t1).toFixed(1),
					postprocess: +(t3 - t2).toFixed(1),
					total: +(t3 - t0).toFixed(1),
				},
			});
		} catch (err: any) {
			bitmap.close();
			self.postMessage({ type: "DETECTIONS", detections: [], id });
		}
	}
});
