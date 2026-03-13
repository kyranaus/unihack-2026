// src/components/driver-monitor/MetricsBar.tsx
import type { DriverState, SmoothedMetrics } from "#/lib/driver-monitor-utils";
import {
	CONFIG,
	getHeadDirection,
	STATE_DISPLAY,
} from "#/lib/driver-monitor-utils";

const EAR_OPEN_REF = 0.32;

export function MetricsBar({
	metrics,
	driverState,
}: {
	metrics: SmoothedMetrics;
	driverState: DriverState;
}) {
	const display = STATE_DISPLAY[driverState];
	const headDir = getHeadDirection(metrics.yaw, metrics.pitch);
	const eyePct = Math.min(100, Math.round((metrics.ear / EAR_OPEN_REF) * 100));
	const eyeOpen = metrics.ear >= CONFIG.EAR_THRESHOLD;

	return (
		<div className="z-10 flex items-stretch divide-x divide-white/10 bg-black/80 backdrop-blur-md">
			<MetricPill
				label="Eyes"
				value={`${eyePct}%`}
				sub={eyeOpen ? "Open" : "Closed"}
				color={eyeOpen ? "#22c55e" : "#ef4444"}
			/>
			<MetricPill
				label="Direction"
				value={headDir}
				sub={`yaw ${metrics.yaw.toFixed(1)}`}
				color={
					Math.abs(metrics.yaw - 1.0) > CONFIG.YAW_THRESHOLD
						? "#f59e0b"
						: "#22c55e"
				}
			/>
			<MetricPill
				label="Tilt"
				value={
					metrics.pitch > CONFIG.PITCH_DOWN_THRESHOLD
						? "Down"
						: metrics.pitch < CONFIG.PITCH_UP_THRESHOLD
							? "Up"
							: "Level"
				}
				sub={`pitch ${metrics.pitch.toFixed(1)}`}
				color={
					metrics.pitch > CONFIG.PITCH_DOWN_THRESHOLD ||
					metrics.pitch < CONFIG.PITCH_UP_THRESHOLD
						? "#f59e0b"
						: "#22c55e"
				}
			/>
			<MetricPill
				label="Status"
				value={display.label}
				sub="driver state"
				color={display.color}
			/>
		</div>
	);
}

function MetricPill({
	label,
	value,
	sub,
	color,
}: {
	label: string;
	value: string;
	sub: string;
	color: string;
}) {
	return (
		<div className="flex flex-1 flex-col items-center justify-center px-2 py-3">
			<span className="text-[10px] font-semibold uppercase tracking-widest text-white/40">
				{label}
			</span>
			<span
				className="mt-0.5 text-base font-bold leading-tight"
				style={{ color }}
			>
				{value}
			</span>
			<span className="text-[10px] text-white/30">{sub}</span>
		</div>
	);
}
