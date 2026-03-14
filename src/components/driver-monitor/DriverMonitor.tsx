// src/components/driver-monitor/DriverMonitor.tsx
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useCamera } from "#/hooks/use-camera";
import { useCameraDevices } from "#/hooks/use-camera-devices";
import { useFaceDetection } from "#/hooks/use-face-detection";
import { useMediaRecorder } from "#/hooks/use-media-recorder";
import { useSpeed } from "#/hooks/use-speed";
import { requestMotionPermission, useCrashDetection } from "#/hooks/use-crash-detection";
import { useFrameCapture } from "#/hooks/useFrameCapture";
import { useDriverEventLogger } from "#/hooks/useDriverEventLogger";
import { driveSessionStore } from "#/hooks/useDriveSession";
import { client } from "#/server/orpc/client";
import type { PendingRecording } from "#/hooks/useRecording";
import { getSupportedMimeType } from "#/lib/media-utils";
import { SaveRecordingDialog } from "#/components/SaveRecordingDialog";
import { useStreamingUpload } from "#/hooks/use-streaming-upload";
import { CameraPicker } from "./CameraPicker";
import { DriverCamera } from "./DriverCamera";
import { MetricsBar } from "./MetricsBar";
import { RecordingControls } from "./RecordingControls";
import { RoadCamera } from "./RoadCamera";
import { StatusOverlay } from "./StatusOverlay";
import { type ViewMode, ViewModeToggle } from "./ViewModeToggle";

function Sparkline({
	values,
	colorClass = "text-primary",
}: {
	values: number[];
	colorClass?: string;
}) {
	if (!values.length) return null;

	const width = 80;
	const height = 24;

	let min = Math.min(...values);
	let max = Math.max(...values);
	if (!Number.isFinite(min) || !Number.isFinite(max)) return null;
	if (min === max) {
		// Avoid flat-line division by zero.
		min -= 0.5;
		max += 0.5;
	}

	const points = values
		.map((v, i) => {
			const x =
				values.length === 1
					? width
					: (i / (values.length - 1)) * width;
			const norm = (v - min) / (max - min);
			const y = height - norm * height;
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

export default function DriverMonitor() {
	const navigate = useNavigate();
	const devices = useCameraDevices();
	const [driverDeviceId, setDriverDeviceId] = useState<string | null>(null);
	const [roadDeviceId, setRoadDeviceId] = useState<string | null>(null);
	const [viewMode, setViewMode] = useState<ViewMode>("road");
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [debugAccel, setDebugAccel] = useState(false);
	const [accelSamples, setAccelSamples] = useState<
		{ g: number; ax: number; ay: number; az: number }[]
	>([]);
	const [isIOS, setIsIOS] = useState(false);
	const [motionPermissionHintShown, setMotionPermissionHintShown] =
		useState(false);
	const [pendingRec, setPendingRec] = useState<PendingRecording | null>(null);
	const [liveLog, setLiveLog] = useState<string[]>([]);
	const [driveSummary, setDriveSummary] = useState<string | null>(null);
	const [ending, setEnding] = useState(false);
	const [sessionScore, setSessionScore] = useState<number | null>(null);
	const sessionIdRef = useRef<string | null>(null);
	const lastSessionIdRef = useRef<string | null>(null);

	const addLog = useCallback((msg: string) => {
		const ts = new Date().toLocaleTimeString("en-AU", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
		setLiveLog((prev) => [...prev.slice(-19), `[${ts}] ${msg}`]);
	}, []);

	useEffect(() => {
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

	const driverSource = driverDeviceId
		? { deviceId: driverDeviceId }
		: { facingMode: "user" as const };
	const roadSource = roadDeviceId
		? { deviceId: roadDeviceId }
		: { facingMode: "environment" as const };

	const frontCamera = useCamera(driverSource);
	const backCamera = useCamera(roadSource, frontCamera.isReady);

	const detection = useFaceDetection(frontCamera.videoRef, canvasRef);
	const streamUpload = useStreamingUpload();
	const frontRecorder = useMediaRecorder(frontCamera.stream);
	const backRecorder = useMediaRecorder(backCamera.stream, {
		onChunk: (chunk) => streamUpload.pushChunk(chunk),
	});

	useDriverEventLogger(detection.driverState, detection.metrics, "front");

	const lastAISummaryRef = useRef("");
	const liveLogRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (liveLogRef.current) {
			liveLogRef.current.scrollTop = liveLogRef.current.scrollHeight;
		}
	}, [liveLog]);

	const handleFrameBatch = useCallback(async (frames: string[]) => {
		const sessionId = sessionIdRef.current;
		if (!sessionId) return;
		try {
			const result = await client.analyseRoadFrames({
				sessionId,
				elapsedSec: Math.floor((Date.now() - (driveSessionStore.state.startedAt ?? Date.now())) / 1000),
				frames,
				camera: "front",
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

	const { speedKmh, latitude, longitude, accuracy, heading } = useSpeed();

	const crash = useCrashDetection({
		speedKmh,
		onCrash: () => {
			try {
				if (typeof window !== "undefined") {
					// Capture location at time of crash
					const crashLocation = {
						latitude,
						longitude,
						accuracy,
						heading,
						speedKmh,
					};
					
					// Store crash location for emergency page
					try {
						window.sessionStorage.setItem("dashcam.crashLocation", JSON.stringify(crashLocation));
					} catch {
						// ignore storage errors
					}
					
					// Simple prompt-style alert so the driver knows a crash was detected.
					try {
						window.alert("Crash detected. Opening emergency screen…");
					} catch {
						// ignore alert failures (e.g. blocked by browser)
					}
					window.sessionStorage.setItem("dashcam.crashTriggered", "1");
				}
			} catch {
				// ignore storage errors
			}
			navigate({ to: "/emergency" });
		},
	});

	// Track recent accelerometer samples for debug graphs.
	useEffect(() => {
		if (!debugAccel) return;
		if (
			crash.currentG == null ||
			crash.ax == null ||
			crash.ay == null ||
			crash.az == null
		) {
			return;
		}

		setAccelSamples((prev) => {
			const next = [
				...prev,
				{ g: crash.currentG!, ax: crash.ax!, ay: crash.ay!, az: crash.az! },
			];
			// Keep last ~80 samples (~a few seconds depending on device frequency).
			return next.slice(-80);
		});
	}, [debugAccel, crash.currentG, crash.ax, crash.ay, crash.az]);

	const isRecording = frontRecorder.isRecording || backRecorder.isRecording;
	const loading = !frontCamera.isReady || detection.isModelLoading;

	const handleStartRecording = useCallback(() => {
		frontRecorder.startRecording();
		backRecorder.startRecording();
		addLog("Starting session...");
		client.startSession({}).then(async ({ sessionId }) => {
			sessionIdRef.current = sessionId;
			driveSessionStore.setState(() => ({ sessionId, startedAt: Date.now() }));
			addLog(`Session started: ${sessionId.slice(0, 8)}...`);
			const mimeType = getSupportedMimeType() || "video/webm";
			await streamUpload.start(sessionId, "back", mimeType);
			addLog("Cloud upload streaming...");
		}).catch((err) => addLog(`Session start FAILED: ${err}`));
	}, [frontRecorder, backRecorder, addLog, streamUpload]);

	const handleStopRecording = useCallback(async () => {
		const duration = frontRecorder.duration || backRecorder.duration || 0;
		const [frontBlob, backBlob] = await Promise.all([
			frontRecorder.stopRecording(),
			backRecorder.stopRecording(),
		]);

		const sessionId = sessionIdRef.current;
		let finalScore: number | null = null;

		if (sessionId) {
			lastSessionIdRef.current = sessionId;
			setEnding(true);
			addLog("Finishing cloud upload...");
			const uploaded = await streamUpload.finish();
			addLog(uploaded ? "Cloud upload complete" : "Cloud upload skipped");

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
				mimeType: getSupportedMimeType() || "video/webm",
			});
		}
	}, [frontRecorder, backRecorder, addLog, streamUpload]);

	const toggleViewMode = useCallback(() => {
		setViewMode((m) => (m === "road" ? "face" : "road"));
	}, []);

	if (frontCamera.error) {
		return (
			<div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-black p-6">
				<div className="rounded-2xl border border-red-800 bg-red-950 p-6 text-center">
					<p className="text-lg font-semibold text-red-400">Camera Error</p>
					<p className="mt-2 text-sm text-red-300">{frontCamera.error}</p>
					<p className="mt-2 text-xs text-white/40">
						Allow camera access and ensure no other app is using the webcam.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="relative flex min-h-screen w-full flex-col bg-black">
			<div className="relative flex-1 overflow-hidden">
				{crash.isCrashLikely && (
					<div className="pointer-events-none absolute inset-x-0 top-4 z-30 flex justify-center px-4">
						<div className="pointer-events-auto flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-lg">
							<span className="h-2 w-2 animate-pulse rounded-full bg-white" />
							<span>Crash detected — opening emergency screen…</span>
						</div>
					</div>
				)}

				{debugAccel && crash.currentG !== null && (
					<div className="pointer-events-none absolute left-3 bottom-[112px] z-30 max-w-[60%] rounded-xl bg-black/80 px-3 py-2 text-[10px] text-white/80 backdrop-blur-md">
						<div className="flex items-center justify-between gap-2">
							<span className="font-semibold uppercase tracking-wide text-white/60">
								Accel Debug
							</span>
							<span className="font-mono text-[10px] text-white">
								{crash.currentG.toFixed(2)}g
							</span>
						</div>
						<div className="mt-1 grid grid-cols-2 gap-x-2 gap-y-0.5 font-mono">
							<span>ax: {crash.ax?.toFixed(2)}</span>
							<span>ay: {crash.ay?.toFixed(2)}</span>
							<span>az: {crash.az?.toFixed(2)}</span>
							<span>
								speed:{" "}
								{speedKmh != null ? `${speedKmh.toFixed(1)} km/h` : "–"}
							</span>
						</div>
						{debugAccel && isIOS && !motionPermissionHintShown && (
							<div className="mt-1 rounded bg-white/5 px-2 py-1 text-[9px] leading-snug text-white/70">
								<button
									type="button"
									className="underline"
									onClick={async () => {
										const result = await requestMotionPermission();
										if (result !== "granted") {
											setMotionPermissionHintShown(true);
										}
									}}
								>
									Tap to enable motion sensors on iOS
								</button>
							</div>
						)}
						{accelSamples.length > 1 && (
							<div className="mt-2 space-y-1.5">
								<div className="flex items-center justify-between gap-2">
									<span className="text-[9px] text-white/50">g</span>
									<Sparkline
										values={accelSamples.map((s) => s.g)}
										colorClass="text-primary"
									/>
								</div>
								<div className="flex items-center justify-between gap-2">
									<span className="text-[9px] text-white/50">ax</span>
									<Sparkline
										values={accelSamples.map((s) => s.ax)}
										colorClass="text-secondary"
									/>
								</div>
								<div className="flex items-center justify-between gap-2">
									<span className="text-[9px] text-white/50">ay</span>
									<Sparkline
										values={accelSamples.map((s) => s.ay)}
										colorClass="text-accent-foreground"
									/>
								</div>
								<div className="flex items-center justify-between gap-2">
									<span className="text-[9px] text-white/50">az</span>
									<Sparkline
										values={accelSamples.map((s) => s.az)}
										colorClass="text-destructive"
									/>
								</div>
							</div>
						)}
					</div>
				)}

				{viewMode === "road" ? (
					<>
						<RoadCamera
							videoRef={backCamera.videoRef}
							isAvailable={backCamera.isReady}
							variant="main"
						/>
						<DriverCamera
							videoRef={frontCamera.videoRef}
							canvasRef={canvasRef}
							isReady={frontCamera.isReady}
							variant="pip"
						/>
					</>
				) : (
					<>
						<DriverCamera
							videoRef={frontCamera.videoRef}
							canvasRef={canvasRef}
							isReady={frontCamera.isReady}
							variant="main"
						/>
						<RoadCamera
							videoRef={backCamera.videoRef}
							isAvailable={backCamera.isReady}
							variant="pip"
						/>
					</>
				)}

				<StatusOverlay
					loading={loading}
					driverState={detection.driverState}
					fps={detection.fps}
				/>

				{!loading && (
					<ViewModeToggle mode={viewMode} onToggle={toggleViewMode} />
				)}

				{!loading && (
					<CameraPicker
						devices={devices}
						driverDeviceId={driverDeviceId}
						roadDeviceId={roadDeviceId}
						onDriverChange={setDriverDeviceId}
						onRoadChange={setRoadDeviceId}
					/>
				)}

				{liveLog.length > 0 && (
					<div ref={liveLogRef} className="absolute inset-x-3 bottom-20 z-20 max-h-28 overflow-y-auto rounded-xl bg-black/80 border border-zinc-700 px-3 py-2 backdrop-blur-sm">
						<p className="text-[9px] font-semibold uppercase tracking-widest text-zinc-500 mb-1">Live Log</p>
						{liveLog.map((line, i) => (
							<p key={i} className="font-mono text-[10px] leading-relaxed text-zinc-300">{line}</p>
						))}
					</div>
				)}

				{!loading && (
					<RecordingControls
						isRecording={isRecording}
						duration={frontRecorder.duration || backRecorder.duration}
						onStart={handleStartRecording}
						onStop={handleStopRecording}
					/>
				)}
			</div>

			{!loading && (
				<MetricsBar
					metrics={detection.metrics}
					driverState={detection.driverState}
					calSamples={detection.calSamples}
					earThreshold={detection.earThreshold}
				/>
			)}

			{/* Drive summary overlay */}
			{driveSummary && !isRecording && (
				<div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 backdrop-blur-sm">
					<div className="rounded-2xl border border-white/10 bg-zinc-900 px-6 py-5 mx-4 w-full max-w-sm">
						<p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 mb-2">AI Drive Summary</p>
						<p className="text-sm leading-relaxed text-zinc-200">{driveSummary}</p>
						<button type="button" onClick={() => setDriveSummary(null)} className="mt-4 w-full rounded-xl bg-white/10 py-3 text-sm font-semibold text-white">Dismiss</button>
					</div>
				</div>
			)}

			{ending && (
				<div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/80">
					<div className="flex flex-col items-center gap-3">
						<div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-600 border-t-white" />
						<p className="text-sm text-zinc-400">Generating drive summary...</p>
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
						setDriveSummary(null);
						lastSessionIdRef.current = null;
						navigate({ to: "/replay", search: { t: Date.now() } });
					}}
				/>
			)}
		</div>
	);
}
