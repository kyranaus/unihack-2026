// src/components/driver-monitor/RoadCamera.tsx
import { VideoOff } from "lucide-react";

export function RoadCamera({
	videoRef,
	isAvailable,
	variant = "main",
}: {
	videoRef: React.RefObject<HTMLVideoElement | null>;
	isAvailable: boolean;
	variant?: "pip" | "main";
}) {
	if (variant === "pip") {
		return (
			<div
				className="absolute bottom-4 left-4 z-10 h-36 w-28 overflow-hidden rounded-xl border-2 border-white/20 shadow-lg transition-opacity sm:h-48 sm:w-36"
				style={{
					opacity: isAvailable ? 1 : 0,
					pointerEvents: isAvailable ? "auto" : "none",
				}}
			>
				<video
					ref={videoRef}
					className="h-full w-full object-cover"
					playsInline
					muted
				/>
				{!isAvailable && (
					<div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
						<VideoOff size={20} className="text-white/30" />
					</div>
				)}
			</div>
		);
	}

	return (
		<>
			<video
				ref={videoRef}
				className="h-full w-full object-cover"
				style={{ display: isAvailable ? undefined : "none" }}
				playsInline
				muted
			/>
			{!isAvailable && (
				<div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-neutral-900">
					<VideoOff size={32} className="text-white/30" />
					<p className="text-xs text-white/30">Road camera unavailable</p>
				</div>
			)}
		</>
	);
}
