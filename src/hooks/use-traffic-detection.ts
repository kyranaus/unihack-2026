// src/hooks/use-traffic-detection.ts
import { useEffect, useRef, useState, useCallback } from "react";
import type { Detection } from "#/lib/traffic-detection";
import TrafficWorker from "#/workers/traffic-detection-worker?worker";

interface Options {
	/** Minimum ms between sending frames to worker (default 0 = as fast as possible) */
	intervalMs?: number;
	/** Confidence threshold 0–1 (default 0.45) */
	confThresh?: number;
}

interface UseTrafficDetectionResult {
	detections: Detection[];
	modelReady: boolean;
	modelLoading: boolean;
}

export function useTrafficDetection(
	videoRef: React.RefObject<HTMLVideoElement | null>,
	enabled: boolean,
	options: Options = {},
): UseTrafficDetectionResult {
	const { intervalMs = 0, confThresh = 0.45 } = options;

	const [modelReady, setModelReady] = useState(false);
	const [modelLoading, setModelLoading] = useState(false);
	const [detections, setDetections] = useState<Detection[]>([]);

	const workerRef = useRef<Worker | null>(null);
	const rafRef = useRef<number>(0);
	const lastSendRef = useRef<number>(0);
	const pendingRef = useRef(false);
	const idRef = useRef(0);
	const latestIdRef = useRef(0);
	const fpsCountRef = useRef(0);
	const fpsTimeRef = useRef(0);

	// Spin up worker and load model
	useEffect(() => {
		if (!enabled) return;

		setModelLoading(true);

		const worker = new TrafficWorker();
		workerRef.current = worker;

		worker.onmessage = (e: MessageEvent) => {
			const { type } = e.data;
			if (type === "MODEL_LOADED") {
				console.log(
					`[TrafficDetect] Model loaded via worker (${e.data.backend})`,
				);
				setModelReady(true);
				setModelLoading(false);
			} else if (type === "MODEL_ERROR") {
				console.error(
					"[TrafficDetect] Worker model load failed:",
					e.data.error,
				);
				setModelLoading(false);
			} else if (type === "DETECTIONS") {
				if (e.data.id >= latestIdRef.current) {
					latestIdRef.current = e.data.id;
					setDetections(e.data.detections as Detection[]);
				}
				pendingRef.current = false;

				// Log FPS every 2s
				fpsCountRef.current++;
				const now = performance.now();
				if (now - fpsTimeRef.current > 2000) {
					const fps = (
						(fpsCountRef.current * 1000) /
						(now - fpsTimeRef.current)
					).toFixed(1);
					const t = e.data.timing;
					if (t) {
						console.log(
							`[TrafficDetect] ${fps} fps | pre=${t.preprocess}ms inf=${t.inference}ms post=${t.postprocess}ms total=${t.total}ms`,
						);
					} else {
						console.log(`[TrafficDetect] ${fps} fps`);
					}
					fpsCountRef.current = 0;
					fpsTimeRef.current = now;
				}
			}
		};

		// Try WebGPU first, worker will fallback internally
		const supportsWebGPU =
			typeof navigator !== "undefined" && "gpu" in navigator;
		worker.postMessage({
			type: "LOAD_MODEL",
			modelUrl: "/models/yolov8n.onnx",
			backend: supportsWebGPU ? "webgpu" : "wasm",
		});

		return () => {
			worker.terminate();
			workerRef.current = null;
			setModelReady(false);
			setModelLoading(false);
		};
	}, [enabled]);

	// Send frames to worker in a rAF loop
	const sendFrame = useCallback(async () => {
		const video = videoRef.current;
		const worker = workerRef.current;
		if (
			!video ||
			!worker ||
			video.readyState < 2 ||
			video.paused ||
			document.hidden
		)
			return;

		try {
			const bitmap = await createImageBitmap(video);
			const id = ++idRef.current;
			worker.postMessage({ type: "DETECT", bitmap, confThresh, id }, [bitmap]);
			pendingRef.current = true;
		} catch {
			// ignore capture errors
		}
	}, [videoRef, confThresh]);

	useEffect(() => {
		if (!enabled || !modelReady) {
			setDetections([]);
			return;
		}

		let cancelled = false;

		const loop = (now: number) => {
			if (cancelled) return;
			// Only send a new frame if the previous result came back
			if (!pendingRef.current && now - lastSendRef.current >= intervalMs) {
				lastSendRef.current = now;
				sendFrame();
			}
			rafRef.current = requestAnimationFrame(loop);
		};
		rafRef.current = requestAnimationFrame(loop);

		return () => {
			cancelled = true;
			cancelAnimationFrame(rafRef.current);
		};
	}, [enabled, modelReady, intervalMs, sendFrame]);

	useEffect(() => {
		if (!enabled) setDetections([]);
	}, [enabled]);

	return { detections, modelReady, modelLoading };
}
