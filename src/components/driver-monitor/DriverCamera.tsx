// src/components/driver-monitor/DriverCamera.tsx
export function DriverCamera({
	videoRef,
	canvasRef,
	isReady,
	variant = "pip",
}: {
	videoRef: React.RefObject<HTMLVideoElement | null>;
	canvasRef: React.RefObject<HTMLCanvasElement | null>;
	isReady: boolean;
	variant?: "pip" | "main";
}) {
	if (variant === "main") {
		return (
			<>
				<video
					ref={videoRef}
					className="h-full w-full object-cover"
					style={{
						transform: "scaleX(-1)",
						display: isReady ? undefined : "none",
					}}
					playsInline
					muted
				/>
				<canvas
					ref={canvasRef}
					className="absolute inset-0 h-full w-full"
					style={{ transform: "scaleX(-1)" }}
				/>
			</>
		);
	}

	return (
		<div
			className="absolute bottom-4 left-4 z-10 h-36 w-28 overflow-hidden rounded-xl border-2 border-white/20 shadow-lg transition-opacity sm:h-48 sm:w-36"
			style={{
				opacity: isReady ? 1 : 0,
				pointerEvents: isReady ? "auto" : "none",
			}}
		>
			<video
				ref={videoRef}
				className="h-full w-full object-cover"
				style={{ transform: "scaleX(-1)" }}
				playsInline
				muted
			/>
			<canvas
				ref={canvasRef}
				className="absolute inset-0 h-full w-full"
				style={{ transform: "scaleX(-1)" }}
			/>
		</div>
	);
}
