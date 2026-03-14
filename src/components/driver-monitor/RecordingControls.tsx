// src/components/driver-monitor/RecordingControls.tsx
import { Circle, Square } from "lucide-react";
import { formatDuration } from "#/lib/media-utils";

export function RecordingControls({
	isRecording,
	duration,
	onStart,
	onStop,
	disabled,
}: {
	isRecording: boolean;
	duration: number;
	onStart: () => void;
	onStop: () => void;
	disabled?: boolean;
}) {
	return (
		<div className="absolute bottom-4 right-4 z-10 flex items-center gap-3">
			{isRecording && (
				<div className="flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 backdrop-blur-sm">
					<span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />
					<span className="font-mono text-sm font-semibold text-white">
						{formatDuration(duration)}
					</span>
				</div>
			)}

			<button
				type="button"
				onClick={isRecording ? onStop : onStart}
				disabled={disabled}
				className="flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-white/80 transition-colors disabled:opacity-40"
				aria-label={isRecording ? "Stop recording" : "Start recording"}
			>
				{isRecording ? (
					<Square size={22} className="text-red-500" fill="#ef4444" />
				) : (
					<Circle size={28} className="text-red-500" fill="#ef4444" />
				)}
			</button>
		</div>
	);
}
