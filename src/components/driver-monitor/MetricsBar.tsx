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
	calSamples,
	earThreshold,
}: {
	metrics: SmoothedMetrics;
	driverState: DriverState;
	calSamples?: number;
	earThreshold?: number;
}) {
	const display = STATE_DISPLAY[driverState];
	const headDir = getHeadDirection(metrics.yaw, metrics.pitch);
	const threshold = earThreshold ?? CONFIG.EAR_THRESHOLD;
	const eyePct = Math.min(100, Math.round((metrics.ear / EAR_OPEN_REF) * 100));
	const eyeOpen = metrics.ear >= threshold;
	const minSamples = CONFIG.EAR_CALIBRATION_MIN_SAMPLES;
	const calReady = (calSamples ?? 0) >= minSamples;

	return (
		<div className="z-10 flex flex-col bg-black/80 backdrop-blur-md">
			{calSamples !== undefined && (
				<div className="flex items-center gap-3 border-b border-white/10 px-3 py-1.5 text-[10px] font-mono">
					<span className={calReady ? "text-green-400" : "text-yellow-400"}>
						{calReady ? "CAL READY" : `CAL ${calSamples}/${minSamples}`}
					</span>
					<span className="text-white/40">
						threshold <span className="text-white/70">{threshold.toFixed(3)}</span>
					</span>
					<span className="text-white/40">
						EAR <span className="text-white/70">{metrics.ear.toFixed(3)}</span>
					</span>
					<span className="text-white/40">
						baseline <span className="text-white/70">{calReady ? (threshold / CONFIG.EAR_CALIBRATION_RATIO).toFixed(3) : "—"}</span>
					</span>
				</div>
			)}
			<div className="flex items-stretch divide-x divide-white/10">
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
