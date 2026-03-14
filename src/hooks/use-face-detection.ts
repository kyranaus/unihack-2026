// src/hooks/use-face-detection.ts
import { useEffect, useState } from "react";
import type { DriverState, EarCalibration, SmoothedMetrics } from "#/lib/driver-monitor-utils";
import {
	CONFIG,
	computeEAR,
	computeHeadPose,
	createEarCalibration,
	drawOverlay,
	ema,
	FACE_LANDMARKER_MODEL_URL,
	getEarThreshold,
	MEDIAPIPE_WASM_URL,
	updateEarCalibration,
} from "#/lib/driver-monitor-utils";

export function useFaceDetection(
	videoRef: React.RefObject<HTMLVideoElement | null>,
	canvasRef: React.RefObject<HTMLCanvasElement | null>,
) {
	const [driverState, setDriverState] = useState<DriverState>("NO_FACE");
	const [metrics, setMetrics] = useState<SmoothedMetrics>({
		ear: 0,
		yaw: 1,
		pitch: 0.7,
	});
	const [fps, setFps] = useState(0);
	const [isModelLoading, setIsModelLoading] = useState(true);
	const [calSamples, setCalSamples] = useState(0);
	const [earThreshold, setEarThreshold] = useState(0.2);

	useEffect(() => {
		let animFrameId: number;
		// biome-ignore lint/suspicious/noExplicitAny: MediaPipe FaceLandmarker has no exported type
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
			if (now - s.lastFpsTime >= 1000) {
				s.currentFps = s.frameCount;
				s.frameCount = 0;
				s.lastFpsTime = now;
			}

		let results: any;
		try {
			results = landmarker.detectForVideo(video, now);
		} catch {
			animFrameId = requestAnimationFrame(detect);
			return;
		}
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
				CONFIG.HEAD_SMOOTHING,
			);
			s.smoothedPitch = ema(
				pose.pitchRatio,
				s.smoothedPitch,
				CONFIG.HEAD_SMOOTHING,
			);

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

			drawOverlay(
				ctx,
				canvas.width,
				canvas.height,
				landmarks,
				s.smoothedEAR < getEarThreshold(s.cal),
			);

			if (now - s.lastRenderTime > CONFIG.RENDER_INTERVAL_MS) {
				setDriverState(s.currentState);
				setMetrics({
					ear: s.smoothedEAR,
					yaw: s.smoothedYaw,
					pitch: s.smoothedPitch,
				});
				setFps(s.currentFps);
				setCalSamples(s.cal.buffer.length);
				setEarThreshold(getEarThreshold(s.cal));
				s.lastRenderTime = now;
			}

			animFrameId = requestAnimationFrame(detect);
		}

		init();

		return () => {
			disposed = true;
			cancelAnimationFrame(animFrameId);
			// biome-ignore lint/suspicious/noExplicitAny: MediaPipe cleanup
			if (landmarker) (landmarker as any).close();
		};
	}, [videoRef, canvasRef]);

	return { driverState, metrics, fps, isModelLoading, calSamples, earThreshold };
}
