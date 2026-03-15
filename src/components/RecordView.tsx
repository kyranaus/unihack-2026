// src/components/RecordView.tsx
import { useEffect, useRef, useState, useCallback } from "react";
import { RefreshCw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import type {
	DriverState,
	EarCalibration,
	SmoothedMetrics,
} from "#/lib/driver-monitor-utils";
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
import type {
	FaceLandmarker,
	FaceLandmarkerResult,
	NormalizedLandmark,
} from "@mediapipe/tasks-vision";
import { useCamera } from "#/hooks/use-camera";
import { useCameraMode } from "#/hooks/use-camera-mode";
import { useMediaRecorder } from "#/hooks/use-media-recorder";
import { useFrameCapture } from "#/hooks/useFrameCapture";
import { useDriverEventLogger } from "#/hooks/useDriverEventLogger";
import {
	useCrashDetection,
	requestMotionPermission,
} from "#/hooks/use-crash-detection";
import { useSpeed } from "#/hooks/use-speed";
import { useCameraDevices } from "#/hooks/use-camera-devices";
import { usePollyTTS } from "#/lib/use-polly-tts";
import {
	EmergencyOverlay,
	type CrashLocation,
} from "#/components/emergency/EmergencyOverlay";
import { driveSessionStore } from "#/hooks/useDriveSession";
import { client } from "#/server/orpc/client";
import { getSupportedMimeType } from "#/lib/media-utils";
import { SaveRecordingDialog } from "#/components/SaveRecordingDialog";
import { CameraPicker } from "#/components/driver-monitor/CameraPicker";
import { useStreamingUpload } from "#/hooks/use-streaming-upload";
import type { PendingRecording } from "#/hooks/useRecording";
import { DriverFeedback, type SessionData } from "#/components/DriverFeedback";
import { useTrafficDetection } from "#/hooks/use-traffic-detection";
import { TrafficOverlay } from "#/components/record/TrafficOverlay";
import { usePulloverSuggestion } from "#/hooks/usePulloverSuggestion";
import { PulloverSuggestion } from "#/components/PulloverSuggestion";

const MAX_RECORD_SECS = 5 * 60;
const ALARM_SRC = "/denielcz-speed-limit-violation-alert-463066.mp3";

function Sparkline({
	values,
	colorClass = "text-white",
}: {
	values: number[];
	colorClass?: string;
}) {
	if (values.length < 2) return null;
	const width = 80,
		height = 24;
	let min = Math.min(...values),
		max = Math.max(...values);
	if (!Number.isFinite(min) || !Number.isFinite(max)) return null;
	if (min === max) {
		min -= 0.5;
		max += 0.5;
	}
	const points = values
		.map((v, i) => {
			const x = (i / (values.length - 1)) * width;
			const y = height - ((v - min) / (max - min)) * height;
			return `${x.toFixed(1)},${y.toFixed(1)}`;
		})
		.join(" ");
	return (
		<svg
			viewBox={`0 0 ${width} ${height}`}
			className={`h-5 w-20 ${colorClass}`}
			preserveAspectRatio="none"
		>
			<polyline
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				points={points}
			/>
		</svg>
	);
}

export default function RecordView() {
	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const alarmRef = useRef<HTMLAudioElement | null>(null);
	const queryClient = useQueryClient();

	// Camera mode: dual (Android/desktop) vs single (iOS / fallback)
	const { mode: cameraMode, isIOS, downgradeToSingle } = useCameraMode();
	const isSingleCam = cameraMode === "single";

	// Camera device selection
	const devices = useCameraDevices();
	const [driverDeviceId, setDriverDeviceId] = useState<string | null>(null);
	const [roadDeviceId, setRoadDeviceId] = useState<string | null>(null);
	const [activeCamera, setActiveCamera] = useState<"front" | "back">(
		isSingleCam ? "back" : "front",
	);

	// Front camera stream (exposed from MediaPipe init for dual recording)
	const [frontStream, setFrontStream] = useState<MediaStream | null>(null);
	const [frontReady, setFrontReady] = useState(false);

	// Back camera via useCamera
	// Dual mode: waits for front to be ready before opening. Single mode: only when back is active.
	const roadSource = roadDeviceId
		? { deviceId: roadDeviceId }
		: { facingMode: "environment" as const };
	const backCamEnabled = isSingleCam ? activeCamera === "back" : frontReady;
	const backCamera = useCamera(roadSource, backCamEnabled);

	// Streaming S3 upload (chunks uploaded during recording)
	const streamUpload = useStreamingUpload();

	// Recording — in single mode only one recorder is active at a time
	const frontRecorder = useMediaRecorder(frontStream);
	const backRecorder = useMediaRecorder(backCamera.stream, {
		onChunk: (chunk) => {
			console.log(`[BackRec] chunk ${(chunk.size / 1024).toFixed(1)}KB`);
			streamUpload.pushChunk(chunk);
		},
	});
	const isRecording = frontRecorder.isRecording || backRecorder.isRecording;
	const wantRecordingRef = useRef(false);

	// Composite canvas recording refs
	const compositeRecorderRef = useRef<MediaRecorder | null>(null);
	const drawLoopActiveRef = useRef(false);
	const compositeMainCamRef = useRef<"front" | "back">("back");

	// State
	const [pendingRec, setPendingRec] = useState<PendingRecording | null>(null);
	const [driverState, setDriverState] = useState<DriverState>("NO_FACE");
	const [metrics, setMetrics] = useState<SmoothedMetrics>({
		ear: 0,
		yaw: 1,
		pitch: 0.7,
	});
	const [calSamples, setCalSamples] = useState(0);
	const [earThreshold, setEarThreshold] = useState<number>(
		CONFIG.EAR_THRESHOLD,
	);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [recSeconds, setRecSeconds] = useState(0);
	const [sessionData, setSessionData] = useState<SessionData | null>(null);
	const [showReport, setShowReport] = useState(false);
	const [ending, setEnding] = useState(false);
	const [sessionScore, setSessionScore] = useState<number | null>(null);
	const [liveLog, setLiveLog] = useState<string[]>([]);
	const [showTraffic, setShowTraffic] = useState(false);
	const [showTrafficWarning, setShowTrafficWarning] = useState(false);

	// Emergency overlay
	const [emergencyTriggered, setEmergencyTriggered] = useState(false);
	const [emergencyLocation, setEmergencyLocation] =
		useState<CrashLocation | null>(null);

	// debugAccel
	const [debugAccel, setDebugAccel] = useState(false);
	const [motionPermissionHintShown, setMotionPermissionHintShown] =
		useState(false);
	const [accelSamples, setAccelSamples] = useState<
		{ g: number; ax: number; ay: number; az: number }[]
	>([]);

	const sessionIdRef = useRef<string | null>(null);
	const recSecondsRef = useRef(0);
	const speedKmhRef = useRef<number | null>(null);
	const speedTrackRef = useRef<Array<{ elapsedSec: number; speedKmh: number }>>(
		[],
	);
	const lastTTSWarningRef = useRef(0);
	const lastSessionIdRef = useRef<string | null>(null);
	const handleStopRecordingRef = useRef<() => void>(() => {});
	const liveLogRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (liveLogRef.current) {
			liveLogRef.current.scrollTop = liveLogRef.current.scrollHeight;
		}
	}, [liveLog]);

	const addLog = useCallback((msg: string) => {
		const ts = new Date().toLocaleTimeString("en-AU", {
			hour12: false,
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		});
		setLiveLog((prev) => [...prev.slice(-19), `[${ts}] ${msg}`]);
	}, []);

	// In single-cam mode with back camera, loading is resolved by back camera readiness
	useEffect(() => {
		if (isSingleCam && activeCamera === "back" && backCamera.isReady) {
			setLoading(false);
		}
	}, [isSingleCam, activeCamera, backCamera.isReady]);

	// Keep composite main cam in sync with active camera toggle (dual mode only)
	useEffect(() => {
		compositeMainCamRef.current = activeCamera;
	}, [activeCamera]);

	// Detect debugAccel URL param
	useEffect(() => {
		if (typeof window === "undefined") return;
		try {
			const search = new URLSearchParams(window.location.search);
			setDebugAccel(search.get("debugAccel") === "1");
		} catch {
			setDebugAccel(false);
		}
	}, []);

	// Global error/crash logging — helps diagnose what triggers the page crash
	useEffect(() => {
		const onError = (e: ErrorEvent) => {
			console.error(`[CRASH] Uncaught error at ${e.filename}:${e.lineno} — ${e.message}`);
		};
		const onUnhandled = (e: PromiseRejectionEvent) => {
			console.error("[CRASH] Unhandled promise rejection:", e.reason);
		};
		window.addEventListener("error", onError);
		window.addEventListener("unhandledrejection", onUnhandled);
		return () => {
			window.removeEventListener("error", onError);
			window.removeEventListener("unhandledrejection", onUnhandled);
		};
	}, []);

	const { speak } = usePollyTTS();
	useDriverEventLogger(driverState, metrics, "front");

	// GPS speed and location for crash detection context
	const { speedKmh, latitude, longitude, accuracy, heading } = useSpeed();

	// Pullover suggestion when driver is drowsy
	const handlePulloverShow = useCallback(() => {
		speak(
			"Warning. You've dozed off multiple times. Please pull over at the next safe spot.",
		).catch(() => {});
	}, [speak]);
	const pullover = usePulloverSuggestion(
		driverState,
		latitude,
		longitude,
		isRecording,
		handlePulloverShow,
	);

	// Keep ref in sync for use inside timer callback
	useEffect(() => {
		speedKmhRef.current = speedKmh;
	}, [speedKmh]);

	// Crash detection (better accuracy than useCollisionDetection)
	const handleCrash = useCallback(
		async ({ g }: { g: number; speedKmh: number | null }) => {
			addLog(`CRASH: ${g.toFixed(1)}g impact detected`);
			const sessionId = sessionIdRef.current;

			const loc: CrashLocation = {
				latitude,
				longitude,
				accuracy,
				heading,
				speedKmh,
			};

			if (sessionId) {
				await client
					.logDriverEvent({
						sessionId,
						elapsedSec: recSecondsRef.current,
						type: "crash",
						summary: `Collision detected - ${g.toFixed(1)}g impact`,
						severity: "critical",
						camera: "front",
						metadata: { gForce: g, location: loc },
					})
					.catch(console.error);
			}

			setEmergencyLocation(loc);
			setEmergencyTriggered(true);
		},
		[addLog, latitude, longitude, accuracy, heading, speedKmh],
	);

	const crash = useCrashDetection({
		speedKmh,
		onCrash: handleCrash,
		gThreshold: 1.0,
	});

	// Track accel samples for debug sparklines
	useEffect(() => {
		if (!debugAccel || crash.currentG == null) return;
		setAccelSamples((prev) => [
			...prev.slice(-79),
			{
				g: crash.currentG!,
				ax: crash.ax ?? 0,
				ay: crash.ay ?? 0,
				az: crash.az ?? 0,
			},
		]);
	}, [debugAccel, crash.currentG, crash.ax, crash.ay, crash.az]);

	// TTS alerts for driver warnings
	useEffect(() => {
		if (!isRecording || driverState === "ALERT" || driverState === "NO_FACE")
			return;
		const now = Date.now();
		if (now - lastTTSWarningRef.current < 15000) return;
		lastTTSWarningRef.current = now;
		const messages: Record<string, string> = {
			DROWSY: "Warning. You appear drowsy. Please stay alert.",
			DISTRACTED: "Eyes on the road. You appear distracted.",
			ASLEEP: "Wake up! Pull over immediately.",
		};
		const msg = messages[driverState];
		if (msg) speak(msg).catch(() => {});
	}, [driverState, isRecording, speak]);

	// AI road frame analysis
	const handleFrameBatch = useCallback(
		async (frames: string[]) => {
			const sessionId = sessionIdRef.current;
			if (!sessionId) return;
			try {
				const result = await client.analyseRoadFrames({
					sessionId,
					elapsedSec: recSecondsRef.current,
					frames,
					camera: "front",
				});
				addLog(`AI: [${result.severity}] ${result.summary}`);
			} catch (err) {
				addLog(
					`AI ERROR: ${err instanceof Error ? err.message : "analysis failed"}`,
				);
			}
		},
		[addLog],
	);

	useFrameCapture(videoRef, isRecording, handleFrameBatch);

	// REC timer + auto-stop at 5 min
	useEffect(() => {
		if (!isRecording) {
			setRecSeconds(0);
			recSecondsRef.current = 0;
			speedTrackRef.current = [];
			return;
		}
		const id = setInterval(() => {
			setRecSeconds((s) => {
				const next = s + 1;
				recSecondsRef.current = next;
				const spd = speedKmhRef.current;
				if (spd != null)
					speedTrackRef.current.push({ elapsedSec: next, speedKmh: spd });
				// Log memory every 5s to help diagnose crashes
				if (next % 5 === 0) {
					const mem = (performance as any).memory;
					if (mem) {
						const used = (mem.usedJSHeapSize / 1048576).toFixed(1);
						const total = (mem.totalJSHeapSize / 1048576).toFixed(1);
						const limit = (mem.jsHeapSizeLimit / 1048576).toFixed(1);
						console.log(`[Memory] ${next}s — used=${used}MB total=${total}MB limit=${limit}MB`);
					} else {
						console.log(`[Memory] ${next}s — performance.memory not available`);
					}
				}
				if (next >= MAX_RECORD_SECS) {
					handleStopRecordingRef.current();
					return 0;
				}
				return next;
			});
		}, 1000);
		return () => clearInterval(id);
	}, [isRecording]);

	// Recording handlers
	const handleStartRecording = useCallback(async () => {
		console.log(`[REC] handleStartRecording — mode=${isSingleCam ? "single" : "dual"} cam=${activeCamera}`);
		if (isIOS) {
			await requestMotionPermission().catch(() => {});
		}
		wantRecordingRef.current = true;
		if (isSingleCam) {
			// Single-cam (iOS): only one recorder at a time, no composite
			if (activeCamera === "front") frontRecorder.startRecording();
			else backRecorder.startRecording();
		} else {
			// Dual-cam (Android): back recorder streams to S3, composite canvas captures both cameras
			// frontRecorder is NOT started — it would accumulate all chunks in memory with no benefit
			// since the composite already captures the front camera.
			backRecorder.startRecording();

			// 640x360 composite (was 1280x720) — 4x less canvas memory/GPU load on mobile
			const COMP_W = 640, COMP_H = 360;
			const canvas = document.createElement("canvas");
			canvas.width = COMP_W;
			canvas.height = COMP_H;
			const ctx = canvas.getContext("2d");
			drawLoopActiveRef.current = true;

			const PIP_W = 160,
				PIP_H = 90,
				PIP_M = 8;

			// Throttle composite draw to 15fps — no need to burn GPU at 60fps for a recording
			let lastDrawTime = 0;
			const DRAW_INTERVAL = 1000 / 15;
			const drawComposite = (now: number) => {
				if (!drawLoopActiveRef.current || !ctx) return;
				if (now - lastDrawTime >= DRAW_INTERVAL) {
					lastDrawTime = now;
					const isBackMain = compositeMainCamRef.current === "back";
					const mainVid = isBackMain
						? backCamera.videoRef.current
						: videoRef.current;
					const pipVid = isBackMain
						? videoRef.current
						: backCamera.videoRef.current;

					ctx.fillStyle = "#000";
					ctx.fillRect(0, 0, COMP_W, COMP_H);

					if (mainVid && mainVid.readyState >= 2) {
						if (!isBackMain) {
							ctx.save();
							ctx.translate(COMP_W, 0);
							ctx.scale(-1, 1);
							ctx.drawImage(mainVid, 0, 0, COMP_W, COMP_H);
							ctx.restore();
						} else {
							ctx.drawImage(mainVid, 0, 0, COMP_W, COMP_H);
						}
					}

					const px = PIP_M;
					const py = PIP_M;
					if (pipVid && pipVid.readyState >= 2) {
						ctx.save();
						ctx.beginPath();
						ctx.roundRect(px, py, PIP_W, PIP_H, 8);
						ctx.clip();
						if (isBackMain) {
							ctx.translate(px + PIP_W, py);
							ctx.scale(-1, 1);
							ctx.drawImage(pipVid, 0, 0, PIP_W, PIP_H);
						} else {
							ctx.drawImage(pipVid, px, py, PIP_W, PIP_H);
						}
						ctx.restore();
						ctx.strokeStyle = "rgba(255,255,255,0.6)";
						ctx.lineWidth = 2;
						ctx.beginPath();
						ctx.roundRect(px, py, PIP_W, PIP_H, 8);
						ctx.stroke();
					}
				}
				requestAnimationFrame(drawComposite);
			};
			requestAnimationFrame(drawComposite);

			const mimeType = getSupportedMimeType();
			const compositeStream = canvas.captureStream(15);
			const compositeRecorder = new MediaRecorder(
				compositeStream,
				mimeType ? { mimeType } : undefined,
			);
			compositeRecorder.ondataavailable = (e) => {
				if (e.data.size > 0) {
					console.log(`[Composite] chunk ${(e.data.size/1024).toFixed(1)}KB`);
					streamUpload.pushChunk(e.data);
				}
			};
			compositeRecorder.start(1000);
			compositeRecorderRef.current = compositeRecorder;
			console.log("[Composite] recorder started 640x360@15fps");
		}
		addLog("Starting session...");
		client
			.startSession({})
			.then(async ({ sessionId }) => {
				sessionIdRef.current = sessionId;
				driveSessionStore.setState(() => ({
					sessionId,
					startedAt: Date.now(),
				}));
				addLog(`Session started: ${sessionId.slice(0, 8)}...`);
				const mimeType = getSupportedMimeType() || "video/webm";
				await streamUpload.start(sessionId, "back", mimeType);
				addLog("Cloud upload streaming...");
			})
			.catch((err) => addLog(`Session start FAILED: ${err}`));
	}, [
		frontRecorder,
		backRecorder,
		addLog,
		isIOS,
		streamUpload,
		isSingleCam,
		activeCamera,
	]);

	const handleStopRecording = useCallback(async () => {
		console.log(`[REC] handleStopRecording — elapsed=${recSecondsRef.current}s`);
		wantRecordingRef.current = false;
		const duration = frontRecorder.duration || backRecorder.duration || 0;

		// Stop composite recorder
		drawLoopActiveRef.current = false;
		const stopComposite = new Promise<Blob | null>((resolve) => {
			const recorder = compositeRecorderRef.current;
			if (!recorder || recorder.state === "inactive") {
				resolve(null);
				return;
			}
			recorder.onstop = () => {
				// composite was streamed to S3, no local blob needed
				compositeRecorderRef.current = null;
				resolve(null);
			};
			recorder.stop();
		});

		const [compositeBlob, frontBlob, backBlob] = await Promise.all([
			stopComposite,
			frontRecorder.stopRecording(),
			backRecorder.stopRecording(),
		]);

		const sessionId = sessionIdRef.current;
		if (sessionId) {
			lastSessionIdRef.current = sessionId;
			setEnding(true);
			addLog("Finishing cloud upload...");
			const uploaded = await streamUpload.finish();
			addLog(uploaded ? "Cloud upload complete" : "Cloud upload skipped");

			addLog("Ending session, generating summary...");
			try {
				await client.endSession({ sessionId });
				addLog("Fetching full session report...");
				const data = await client.getSession({ sessionId });
				setSessionData({
					id: data.id,
					score: data.score,
					summary: data.summary,
					cameras: data.cameras,
					startedAt: data.startedAt.toISOString
						? data.startedAt.toISOString()
						: String(data.startedAt),
					endedAt: data.endedAt
						? data.endedAt.toISOString
							? data.endedAt.toISOString()
							: String(data.endedAt)
						: null,
					events: data.events.map((e: any) => ({
						id: e.id,
						type: e.type,
						camera: e.camera,
						elapsedSec: e.elapsedSec,
						summary: e.summary,
						severity: e.severity,
						metadata: e.metadata,
					})),
				});
				setSessionScore(data.score ?? 0);
				setShowReport(true);
				addLog(`Session ended: score=${data.score}, events logged`);
				queryClient.invalidateQueries({ queryKey: ["profileStats"] });
			} catch (err) {
				addLog(`End session FAILED: ${err}`);
			} finally {
				setEnding(false);
				sessionIdRef.current = null;
				driveSessionStore.setState(() => ({
					sessionId: null,
					startedAt: null,
				}));
			}
		}

		const blob = compositeBlob ?? backBlob ?? frontBlob;
		if (blob) {
			setPendingRec({
				blob,
				duration,
				mimeType: getSupportedMimeType() || "video/webm",
				frontBlob,
				backBlob,
				speedTrack: [...speedTrackRef.current],
			});
		}

		setLiveLog([]);
	}, [frontRecorder, backRecorder, addLog, queryClient, streamUpload]);

	// Keep ref up-to-date for auto-stop timer
	handleStopRecordingRef.current = handleStopRecording;

	// Flip camera in single-cam mode: stop current recorder, then switch
	const handleFlipCamera = useCallback(async () => {
		if (isSingleCam && wantRecordingRef.current) {
			if (activeCamera === "front") await frontRecorder.stopRecording();
			else await backRecorder.stopRecording();
		}
		setActiveCamera((c) => (c === "front" ? "back" : "front"));
	}, [isSingleCam, activeCamera, frontRecorder, backRecorder]);

	// MediaPipe face detection + front camera init
	// In single-cam mode, only runs when user has flipped to the front camera.
	const frontCamEnabled = !isSingleCam || activeCamera === "front";
	useEffect(() => {
		if (!frontCamEnabled) {
			setFrontStream(null);
			setFrontReady(false);
			setDriverState("NO_FACE");
			return;
		}

		let animFrameId: number;
		let stream: MediaStream | null = null;
		let landmarker: FaceLandmarker | null = null;
		let disposed = false;

		const MIN_DETECT_INTERVAL = 33;

		const s = {
			smoothedEAR: 0.3,
			smoothedYaw: 1.0,
			smoothedPitch: 0.7,
			eyesClosedSince: null as number | null,
			headTurnedSince: null as number | null,
			alarmPlaying: false,
			noFaceFrames: 0,
			currentState: "NO_FACE" as DriverState,
			lastRenderTime: 0,
			lastDetectTime: 0,
			cal: createEarCalibration() as EarCalibration,
		};

		async function init() {
			try {
				console.log("[FaceDetect] Loading MediaPipe...");
				const { FaceLandmarker, FilesetResolver } = await import(
					"@mediapipe/tasks-vision"
				);
				if (disposed) {
					console.log("[FaceDetect] disposed after import");
					return;
				}

				console.log("[FaceDetect] Resolving WASM...");
				const vision = await FilesetResolver.forVisionTasks(MEDIAPIPE_WASM_URL);
				if (disposed) {
					console.log("[FaceDetect] disposed after WASM");
					return;
				}

				console.log("[FaceDetect] Creating landmarker...");
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
					console.log("[FaceDetect] disposed after landmarker");
					return;
				}

				console.log("[FaceDetect] Requesting camera...");
				const videoConstraint = driverDeviceId
					? {
							deviceId: { exact: driverDeviceId },
							width: { ideal: 640 },
							height: { ideal: 480 },
						}
					: {
							facingMode: "user",
							width: { ideal: 640 },
							height: { ideal: 480 },
						};
				stream = await navigator.mediaDevices.getUserMedia({
					video: videoConstraint,
				});
				if (disposed) {
					stream.getTracks().forEach((t) => t.stop());
					console.log("[FaceDetect] disposed after getUserMedia");
					return;
				}

				console.log(
					"[FaceDetect] Camera acquired, attaching to video element...",
				);
				setFrontStream(stream);
				setFrontReady(true);

				let video = videoRef.current;
				for (let i = 0; !video && i < 50; i++) {
					await new Promise((r) => requestAnimationFrame(r));
					if (disposed) {
						console.log("[FaceDetect] disposed waiting for video ref");
						return;
					}
					video = videoRef.current;
				}
				if (!video) {
					console.error("[FaceDetect] videoRef never became available");
					setLoading(false);
					return;
				}
				video.srcObject = stream;
				try {
					await video.play();
				} catch (playErr) {
					console.warn(
						"[FaceDetect] video.play() failed, retrying muted:",
						playErr,
					);
					video.muted = true;
					await video.play();
				}
				console.log("[FaceDetect] Video playing, starting detection loop");
				setLoading(false);
				detect();
			} catch (err) {
				console.error("[FaceDetect] init error:", err);
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
				animFrameId = requestAnimationFrame(detect);
				return;
			}
			const now = performance.now();
			if (now - s.lastDetectTime < MIN_DETECT_INTERVAL) {
				animFrameId = requestAnimationFrame(detect);
				return;
			}
			s.lastDetectTime = now;
			const ctx = canvas.getContext("2d");
			if (!ctx) {
				animFrameId = requestAnimationFrame(detect);
				return;
			}

			let results: FaceLandmarkerResult;
			try {
				results = landmarker!.detectForVideo(video, now);
			} catch {
				animFrameId = requestAnimationFrame(detect);
				return;
			}
			const hasFace = results.faceLandmarks && results.faceLandmarks.length > 0;
			const landmarks: NormalizedLandmark[] | null = hasFace
				? results.faceLandmarks[0]
				: null;

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

				updateEarCalibration(
					s.cal,
					ear.average,
					pose.yawRatio,
					pose.pitchRatio,
				);
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

				if (s.currentState === "DROWSY" && !s.alarmPlaying) {
					s.alarmPlaying = true;
					if (!alarmRef.current) {
						alarmRef.current = new Audio(ALARM_SRC);
						alarmRef.current.loop = true;
					}
					alarmRef.current.currentTime = 0;
					alarmRef.current.play();
				} else if (s.currentState !== "DROWSY" && s.alarmPlaying) {
					s.alarmPlaying = false;
					alarmRef.current?.pause();
				}
			}

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
			drawOverlay(
				ctx,
				vw,
				vh,
				landmarks,
				s.smoothedEAR < getEarThreshold(s.cal),
				true,
			);
			ctx.restore();

			if (now - s.lastRenderTime > CONFIG.RENDER_INTERVAL_MS) {
				setDriverState(s.currentState);
				setMetrics({
					ear: s.smoothedEAR,
					yaw: s.smoothedYaw,
					pitch: s.smoothedPitch,
				});
				setCalSamples(s.cal.buffer.length);
				setEarThreshold(getEarThreshold(s.cal));
				s.lastRenderTime = now;
			}
			animFrameId = requestAnimationFrame(detect);
		}

		init();
		return () => {
			disposed = true;
			setFrontStream(null);
			setFrontReady(false);
			cancelAnimationFrame(animFrameId);
			if (stream) stream.getTracks().forEach((t) => t.stop());
			if (landmarker) landmarker.close();
			alarmRef.current?.pause();
			alarmRef.current = null;
		};
	}, [driverDeviceId, frontCamEnabled]);

	// Dual-mode safety: if the back camera killed the front track (iOS-like), downgrade
	useEffect(() => {
		if (isSingleCam || !backCamera.isReady || !frontStream) return;
		const tracks = frontStream.getVideoTracks();
		const killed =
			tracks.length === 0 || tracks.some((t) => t.readyState === "ended");
		if (killed) {
			downgradeToSingle();
			setActiveCamera("back");
		}
	}, [isSingleCam, backCamera.isReady, frontStream, downgradeToSingle]);

	// In single-cam mode, auto-start recording on the new camera after a flip
	useEffect(() => {
		if (!isSingleCam || !wantRecordingRef.current) return;
		if (
			activeCamera === "back" &&
			backCamera.isReady &&
			backCamera.stream &&
			!backRecorder.isRecording
		) {
			backRecorder.startRecording();
		}
	}, [
		isSingleCam,
		activeCamera,
		backCamera.isReady,
		backCamera.stream,
		backRecorder,
	]);

	useEffect(() => {
		if (!isSingleCam || !wantRecordingRef.current) return;
		if (
			activeCamera === "front" &&
			frontReady &&
			frontStream &&
			!frontRecorder.isRecording
		) {
			frontRecorder.startRecording();
		}
	}, [isSingleCam, activeCamera, frontReady, frontStream, frontRecorder]);

	const display = STATE_DISPLAY[driverState];
	const isWarning = driverState !== "ALERT";
	const eyePct = Math.min(100, Math.round((metrics.ear / 0.32) * 100));
	const headDir = getHeadDirection(metrics.yaw, metrics.pitch);

	const recMins = Math.floor(recSeconds / 60)
		.toString()
		.padStart(2, "0");
	const recSecs = (recSeconds % 60).toString().padStart(2, "0");

	// Traffic detection — runs on the back (road) camera
	const trafficEnabled = showTraffic && backCamera.isReady;
	const {
		detections: trafficDets,
		modelReady: trafficReady,
		modelLoading: trafficLoading,
	} = useTrafficDetection(backCamera.videoRef, trafficEnabled);

	if (error) {
		return (
			<div className="flex h-full flex-col items-center justify-center gap-4 bg-background p-6">
				<div className="rounded-2xl border border-red-800 bg-red-950 p-6 text-center">
					<p className="text-lg font-semibold text-red-400">Camera Error</p>
					<p className="mt-2 text-sm text-red-300">{error}</p>
					<p className="mt-2 text-xs text-foreground/40">
						Allow camera access and ensure no other app is using the webcam.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex h-dvh flex-col bg-background">
			{/* Title */}
			<div
				className="flex flex-none items-center justify-between px-4 pb-2"
				style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}
			>
				{/* Front · Back toggle */}
				<div className="flex items-center rounded-full bg-foreground/10 p-0.5">
					{(["front", "back"] as const).map((cam) => (
						<button
							key={cam}
							type="button"
							onClick={() => {
								if (cam !== activeCamera) handleFlipCamera();
							}}
							className={`rounded-full px-3 py-1 text-xs font-semibold capitalize transition-colors ${
								activeCamera === cam
									? "bg-foreground text-background"
									: "text-foreground/60"
							}`}
						>
							{cam}
						</button>
					))}
				</div>
				<span className="text-base font-bold tracking-wide text-foreground">
					Record
				</span>
				<div className="w-16 text-right">
					<span className="font-mono text-sm font-bold text-foreground">
						{speedKmh != null ? Math.round(speedKmh) : "–"}
					</span>
					<span className="text-[10px] text-foreground/50"> km/h</span>
				</div>
			</div>

			{/* Video window */}
			<div className="relative mx-3 mb-2 mt-1 h-[58vh] flex-none overflow-hidden rounded-2xl bg-zinc-900">
				{/* Crash banner */}
				{crash.isCrashLikely && (
					<div className="absolute inset-x-0 top-0 z-30 flex justify-center px-4 pt-3">
						<div className="flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-lg">
							<span className="h-2 w-2 animate-pulse rounded-full bg-white" />
							Crash detected — opening emergency screen…
						</div>
					</div>
				)}

				{/* Back camera — main in back mode, PiP in dual front mode, hidden in single front mode */}
				<video
					ref={backCamera.videoRef}
					onClick={() => {
						if (!isSingleCam && activeCamera === "front") handleFlipCamera();
					}}
					className={
						activeCamera === "back"
							? "absolute inset-0 z-0 h-full w-full object-cover"
							: isSingleCam
								? "hidden"
								: "absolute top-3 left-3 z-10 h-28 w-20 cursor-pointer rounded-xl object-cover ring-2 ring-white/30"
					}
					playsInline
					muted
				/>

				{/* Traffic detection overlay — main (back cam active) */}
				{activeCamera === "back" && (
					<TrafficOverlay
						videoRef={backCamera.videoRef}
						detections={trafficDets}
						modelReady={trafficReady}
						modelLoading={trafficLoading}
						className="inset-0 h-full w-full"
					/>
				)}

				{/* Traffic detection overlay — PiP (front cam active, dual mode) */}
				{!isSingleCam && activeCamera === "front" && (
					<TrafficOverlay
						videoRef={backCamera.videoRef}
						detections={trafficDets}
						modelReady={trafficReady}
						modelLoading={trafficLoading}
						className="top-3 left-3 h-28 w-20 rounded-xl"
					/>
				)}

				{/* Front camera — main in front mode, PiP in dual back mode, hidden in single back mode */}
				<video
					ref={videoRef}
					onClick={() =>
						!isSingleCam && activeCamera === "back" && handleFlipCamera()
					}
					className={
						activeCamera === "front"
							? "absolute inset-0 z-0 h-full w-full object-cover"
							: isSingleCam
								? "hidden"
								: "absolute top-3 left-3 z-10 h-28 w-20 cursor-pointer rounded-xl object-cover ring-2 ring-white/30"
					}
					style={{ transform: "scaleX(-1)" }}
					playsInline
					muted
				/>

				{/* Face detection canvas — follows front camera, hidden when front inactive in single mode */}
				<canvas
					ref={canvasRef}
					onClick={() =>
						!isSingleCam && activeCamera === "back" && handleFlipCamera()
					}
					className={
						activeCamera === "front"
							? "absolute inset-0 z-1 h-full w-full"
							: isSingleCam
								? "hidden"
								: "absolute top-3 left-3 z-11 h-28 w-20 cursor-pointer rounded-xl"
					}
					style={{ transform: "scaleX(-1)" }}
				/>

				{/* Loading overlay */}
				{loading && (
					<div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90">
						<div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white" />
						<p className="mt-4 text-sm font-medium text-white">
							{isSingleCam && activeCamera === "back"
								? "Starting camera…"
								: "Loading face detection…"}
						</p>
						<p className="mt-1 text-xs text-white/40">
							First load may take a few seconds
						</p>
					</div>
				)}

				{/* REC indicator */}
				{isRecording && (
					<div className="absolute left-1/2 top-3 z-10 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 backdrop-blur-sm">
						<span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
						<span className="font-mono text-xs font-bold text-white">
							REC {recMins}:{recSecs}
						</span>
					</div>
				)}

				{/* Warning banner — only when front camera is active */}
				{!loading &&
					activeCamera === "front" &&
					isWarning &&
					display.warning && (
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

				{/* Driver monitoring paused banner — single-cam mode, back camera active */}
				{!loading && isSingleCam && activeCamera === "back" && (
					<div className="absolute left-4 top-4 z-10">
						<div className="rounded-full bg-black/60 px-3 py-1.5 text-[10px] font-medium text-white/60 backdrop-blur-sm">
							Driver monitoring paused
						</div>
					</div>
				)}

				{/* Metrics strip */}
				{!loading && (
					<div className="absolute bottom-0 left-0 right-0 z-10 flex flex-col bg-gradient-to-t from-black/80 to-transparent px-4 pb-3 pt-8 pr-16">
						{activeCamera === "front" && (
							<>
								<div className="mb-1 flex items-center gap-3 font-mono text-[10px]">
									<span
										className={
											calSamples >= CONFIG.EAR_CALIBRATION_MIN_SAMPLES
												? "text-green-400"
												: "text-yellow-400"
										}
									>
										{calSamples >= CONFIG.EAR_CALIBRATION_MIN_SAMPLES
											? "CAL READY"
											: `CAL ${calSamples}/${CONFIG.EAR_CALIBRATION_MIN_SAMPLES}`}
									</span>
									<span className="text-white/40">
										thr{" "}
										<span className="text-white/80">
											{earThreshold.toFixed(3)}
										</span>
									</span>
									<span className="text-white/40">
										EAR{" "}
										<span className="text-white/80">
											{metrics.ear.toFixed(3)}
										</span>
									</span>
									<span className="text-white/40">
										base{" "}
										<span className="text-white/80">
											{calSamples >= CONFIG.EAR_CALIBRATION_MIN_SAMPLES
												? (earThreshold / CONFIG.EAR_CALIBRATION_RATIO).toFixed(
														3,
													)
												: "—"}
										</span>
									</span>
								</div>
								<div className="flex items-center gap-4">
									<span className="text-[11px] font-semibold text-white/70">
										Eyes <span className="text-white">{eyePct}%</span>
									</span>
									<span className="text-[11px] font-semibold text-white/70">
										State{" "}
										<span style={{ color: display.color }}>
											{display.label}
										</span>
									</span>
									<span className="text-[11px] font-semibold text-white/70">
										Head <span className="text-white">{headDir}</span>
									</span>
								</div>
							</>
						)}
						<div className="mt-0.5 flex items-center gap-4">
							<span className="text-[11px] font-semibold text-white/70">
								Speed{" "}
								<span className="text-white">
									{speedKmh != null ? `${Math.round(speedKmh)} km/h` : "–"}
								</span>
							</span>
							{crash.currentG != null && (
								<span className="text-[11px] font-semibold text-white/70">
									G{" "}
									<span className="text-white">
										{crash.currentG.toFixed(2)}g
									</span>
								</span>
							)}
							{isSingleCam && (
								<span className="text-[11px] font-semibold text-white/70">
									Mode <span className="text-white">Single</span>
								</span>
							)}
						</div>
					</div>
				)}

				{/* Camera picker */}
				{!loading && (
					<CameraPicker
						devices={devices}
						driverDeviceId={driverDeviceId}
						roadDeviceId={roadDeviceId}
						onDriverChange={setDriverDeviceId}
						onRoadChange={setRoadDeviceId}
						cameraMode={cameraMode}
						activeCamera={activeCamera}
					/>
				)}

				{/* Switch camera */}
				<button
					type="button"
					onClick={handleFlipCamera}
					className="absolute bottom-3 right-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-transform active:scale-95"
				>
					<RefreshCw size={18} />
				</button>

				{/* Debug accelerometer panel (?debugAccel=1) */}
				{debugAccel && crash.currentG !== null && (
					<div className="absolute left-3 bottom-16 z-20 max-w-[60%] rounded-xl bg-black/80 px-3 py-2 text-[10px] text-white/80 backdrop-blur-md">
						<div className="flex items-center justify-between gap-2">
							<span className="font-semibold uppercase tracking-wide text-white/60">
								Accel Debug
							</span>
							<span className="font-mono text-white">
								{crash.currentG.toFixed(2)}g
							</span>
						</div>
						<div className="mt-1 grid grid-cols-2 gap-x-2 gap-y-0.5 font-mono">
							<span>ax: {crash.ax?.toFixed(2)}</span>
							<span>ay: {crash.ay?.toFixed(2)}</span>
							<span>az: {crash.az?.toFixed(2)}</span>
							<span>
								speed: {speedKmh != null ? `${speedKmh.toFixed(1)} km/h` : "–"}
							</span>
						</div>
						{isIOS && !motionPermissionHintShown && (
							<div className="mt-1 rounded bg-white/5 px-2 py-1 text-[9px] leading-snug text-white/70">
								<button
									type="button"
									className="underline"
									onClick={async () => {
										const result = await requestMotionPermission();
										if (result !== "granted")
											setMotionPermissionHintShown(true);
									}}
								>
									Tap to enable motion sensors on iOS
								</button>
							</div>
						)}
						{accelSamples.length > 1 && (
							<div className="mt-2 space-y-1.5">
								{[
									{ label: "g", values: accelSamples.map((s) => s.g) },
									{ label: "ax", values: accelSamples.map((s) => s.ax) },
									{ label: "ay", values: accelSamples.map((s) => s.ay) },
									{ label: "az", values: accelSamples.map((s) => s.az) },
								].map(({ label, values }) => (
									<div
										key={label}
										className="flex items-center justify-between gap-2"
									>
										<span className="text-[9px] text-white/50">{label}</span>
										<Sparkline values={values} />
									</div>
								))}
							</div>
						)}
					</div>
				)}
			</div>

			{/* Controls */}
			<div className="flex flex-none flex-col items-center gap-3 pb-6 pt-2">
				<button
					type="button"
					onClick={() =>
						isRecording ? handleStopRecording() : handleStartRecording()
					}
					disabled={loading}
					className={`flex h-20 w-20 items-center justify-center rounded-full border-4 border-foreground transition-transform active:scale-95 disabled:opacity-30 ${isRecording ? "animate-pulse" : ""}`}
					aria-label={isRecording ? "Stop recording" : "Start recording"}
				>
					<span
						className={`bg-red-500 transition-all duration-200 ${isRecording ? "h-8 w-8 rounded-lg" : "h-14 w-14 rounded-full"}`}
					/>
				</button>

				{/* Object detection toggle */}
				<div className="flex w-full items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
					<div>
						<p className="text-sm font-medium text-foreground">Object Detection</p>
						<p className="text-xs text-muted-foreground">Detects vehicles, pedestrians &amp; signs</p>
					</div>
					<button
						type="button"
						onClick={() => {
							if (!showTraffic) setShowTrafficWarning(true);
							else setShowTraffic(false);
						}}
						className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${showTraffic ? "bg-primary" : "bg-muted"}`}
						aria-label="Toggle object detection"
					>
						<span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${showTraffic ? "translate-x-6" : "translate-x-1"}`} />
					</button>
				</div>

				{/* Live log */}
				{liveLog.length > 0 && (
					<div
						ref={liveLogRef}
						className="mx-3 w-full max-h-24 overflow-y-auto rounded-xl border border-border bg-card px-3 py-2"
					>
						<p className="mb-1 text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">
							Live Log
						</p>
						{liveLog.map((line, i) => (
							<p
								key={i}
								className="font-mono text-[10px] leading-relaxed text-foreground/70"
							>
								{line}
							</p>
						))}
					</div>
				)}
			</div>

			{/* Drive report modal */}
			<DriverFeedback
				isOpen={showReport}
				sessionData={sessionData}
				onClose={() => {
					setShowReport(false);
					setSessionData(null);
				}}
			/>

			{ending && (
				<div className="fixed inset-0 z-[95] flex items-center justify-center bg-background/80 backdrop-blur-sm">
					<div className="flex flex-col items-center gap-3">
						<div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-foreground" />
						<p className="text-sm text-muted-foreground">
							Generating drive summary...
						</p>
					</div>
				</div>
			)}

			{/* Object detection hardware warning */}
			{showTrafficWarning && (
				<div className="fixed inset-0 z-[90] flex items-end justify-center p-4 bg-black/60 backdrop-blur-sm">
					<div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-xl">
						<div className="mb-4 flex items-start gap-3">
							<div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/15">
								<svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
									<path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
								</svg>
							</div>
							<div>
								<h3 className="text-sm font-semibold text-foreground">Hardware Requirement</h3>
								<p className="mt-1 text-sm text-muted-foreground leading-relaxed">
									Object detection runs a real-time neural network on your device. On devices without dedicated AI or GPU hardware, this may significantly reduce performance during recording.
								</p>
							</div>
						</div>
						<div className="flex gap-3">
							<button
								type="button"
								onClick={() => setShowTrafficWarning(false)}
								className="flex-1 rounded-xl border border-border bg-muted px-4 py-2.5 text-sm font-medium text-foreground transition-colors active:opacity-70"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={() => { setShowTraffic(true); setShowTrafficWarning(false); }}
								className="flex-1 rounded-xl bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-colors active:opacity-70"
							>
								Enable Anyway
							</button>
						</div>
					</div>
				</div>
			)}

			{pendingRec && (
				<SaveRecordingDialog
					pending={pendingRec}
					sessionId={lastSessionIdRef.current}
					score={sessionScore}
					onDone={() => {
						setPendingRec(null);
						setSessionScore(null);
						lastSessionIdRef.current = null;
					}}
				/>
			)}

			<PulloverSuggestion
				spots={pullover.spots}
				visible={pullover.visible}
				onDismiss={pullover.dismiss}
			/>

			<EmergencyOverlay
				triggered={emergencyTriggered}
				crashLocation={emergencyLocation}
				onDismiss={() => setEmergencyTriggered(false)}
			/>
		</div>
	);
}
