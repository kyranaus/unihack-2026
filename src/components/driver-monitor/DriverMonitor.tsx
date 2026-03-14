// src/components/driver-monitor/DriverMonitor.tsx
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useCamera } from "#/hooks/use-camera";
import { useCameraDevices } from "#/hooks/use-camera-devices";
import { useFaceDetection } from "#/hooks/use-face-detection";
import { useMediaRecorder } from "#/hooks/use-media-recorder";
import { useSpeed } from "#/hooks/use-speed";
import { requestMotionPermission, useCrashDetection } from "#/hooks/use-crash-detection";
import type { PendingRecording } from "#/hooks/useRecording";
import { getSupportedMimeType } from "#/lib/media-utils";
import { SaveRecordingDialog } from "#/components/SaveRecordingDialog";
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
	const frontRecorder = useMediaRecorder(frontCamera.stream);
	const backRecorder = useMediaRecorder(backCamera.stream);

	const { speedKmh } = useSpeed();

	const crash = useCrashDetection({
		speedKmh,
		onCrash: () => {
			try {
				if (typeof window !== "undefined") {
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
	}, [frontRecorder, backRecorder]);

	const handleStopRecording = useCallback(async () => {
		const duration = frontRecorder.duration || backRecorder.duration || 0;
		const [frontBlob, backBlob] = await Promise.all([
			frontRecorder.stopRecording(),
			backRecorder.stopRecording(),
		]);
		// Use road (back) blob for save-to-replays; show Save dialog
		const blob = backBlob ?? frontBlob;
		if (blob) {
			setPendingRec({
				blob,
				duration,
				mimeType: getSupportedMimeType() || "video/webm",
			});
		}
	}, [frontRecorder, backRecorder]);

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
				/>
			)}

			{pendingRec && (
				<SaveRecordingDialog
					pending={pendingRec}
					onDone={() => setPendingRec(null)}
				/>
			)}
		</div>
	);
}
