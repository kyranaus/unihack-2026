// src/components/driver-monitor/StatusOverlay.tsx
import type { DriverState } from "#/lib/driver-monitor-utils";
import { STATE_DISPLAY } from "#/lib/driver-monitor-utils";

export function StatusOverlay({
	loading,
	driverState,
	fps,
}: {
	loading: boolean;
	driverState: DriverState;
	fps: number;
}) {
	if (loading) {
		return (
			<div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90">
				<div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white" />
				<p className="mt-4 text-sm font-medium text-white">
					Loading face detection…
				</p>
				<p className="mt-1 text-xs text-white/40">
					First load may take a few seconds
				</p>
			</div>
		);
	}

	const display = STATE_DISPLAY[driverState];
	const isWarning = driverState !== "ALERT";

	return (
		<>
			<div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between px-4 pt-4">
				<div
					className="rounded-full border px-4 py-1.5 text-sm font-bold tracking-widest backdrop-blur-md transition-colors duration-300"
					style={{
						borderColor: display.border,
						color: display.color,
						backgroundColor: display.bg,
					}}
				>
					{display.label}
				</div>
				<div className="rounded-md bg-black/50 px-2.5 py-1 font-mono text-xs text-white/60 backdrop-blur-sm">
					{fps} FPS
				</div>
			</div>

			{isWarning && display.warning && (
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
		</>
	);
}
