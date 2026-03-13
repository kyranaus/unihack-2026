import { useEffect, useRef, useState } from "react";

type CrashDetectionOptions = {
	speedKmh?: number | null;
	gThreshold?: number;
	speedThresholdKmh?: number;
	debounceMs?: number;
	onCrash?: (info: { g: number; speedKmh: number | null }) => void;
};

export type CrashDetectionState = {
	isCrashLikely: boolean;
	lastImpactG: number | null;
	lastSpeedKmh: number | null;
	triggeredAt: number | null;
	currentG: number | null;
	ax: number | null;
	ay: number | null;
	az: number | null;
};

export function useCrashDetection({
	speedKmh = null,
	gThreshold = 3.0,
	// Speed threshold currently disabled — we only use g-force.
	speedThresholdKmh = 0,
	debounceMs = 5000,
	onCrash,
}: CrashDetectionOptions): CrashDetectionState {
	const [state, setState] = useState<CrashDetectionState>({
		isCrashLikely: false,
		lastImpactG: null,
		lastSpeedKmh: null,
		triggeredAt: null,
		currentG: null,
		ax: null,
		ay: null,
		az: null,
	});

	const lastTriggerRef = useRef<number | null>(null);

	useEffect(() => {
		if (typeof window === "undefined") return;
		if (typeof DeviceMotionEvent === "undefined") {
			// Motion sensors not available (e.g. some desktop browsers).
			return;
		}
		if (typeof DeviceMotionEvent === "undefined") {
			// Motion sensors not available (e.g. some desktop browsers).
			return;
		}

		const handleMotion = (event: DeviceMotionEvent) => {
			// Prefer acceleration without gravity when available.
			let acc = event.acceleration;
			let usingIncludingGravity = false;

			if (
				!acc ||
				((acc.x == null || Number.isNaN(acc.x)) &&
					(acc.y == null || Number.isNaN(acc.y)) &&
					(acc.z == null || Number.isNaN(acc.z)))
			) {
				acc = event.accelerationIncludingGravity;
				usingIncludingGravity = true;
			}

			if (!acc) return;

			const ax = acc.x ?? 0;
			const ay = acc.y ?? 0;
			const az = acc.z ?? 0;

			const magnitudeMs2 = Math.sqrt(ax * ax + ay * ay + az * az);
			let g = magnitudeMs2 / 9.80665;

			// If we only have accelerationIncludingGravity, subtract ~1g baseline
			// so that "rest" is near 0g instead of ~1g.
			if (usingIncludingGravity) {
				g = Math.max(0, g - 1);
			}

			if (!Number.isFinite(g)) return;

			const now = Date.now();

			// Crash trigger: currently based on g-force only.
			const shouldTriggerCrash = g >= gThreshold;

			if (
				shouldTriggerCrash &&
				lastTriggerRef.current !== null &&
				now - lastTriggerRef.current < debounceMs
			) {
				// Still update live readings for debug UI, but don't re-trigger.
				setState((prev) => ({
					...prev,
					currentG: g,
					ax,
					ay,
					az,
				}));
				return;
			}

			if (shouldTriggerCrash) {
				lastTriggerRef.current = now;

				setState((prev) => ({
					...prev,
					isCrashLikely: true,
					lastImpactG: g,
					lastSpeedKmh: speedKmh ?? null,
					triggeredAt: now,
					currentG: g,
					ax,
					ay,
					az,
				}));

				onCrash?.({
					g,
					speedKmh: speedKmh ?? null,
				});
			} else {
				// No crash, but keep debug readings live.
				setState((prev) => ({
					...prev,
					currentG: g,
					ax,
					ay,
					az,
				}));
			}
		};

		window.addEventListener("devicemotion", handleMotion);

		return () => {
			window.removeEventListener("devicemotion", handleMotion);
		};
	}, [debounceMs, gThreshold, onCrash, speedKmh, speedThresholdKmh]);

	return state;
}

// Helper for iOS Safari (must be called from a user gesture handler).
export async function requestMotionPermission():
	Promise<"granted" | "denied" | "unavailable"> {
	if (typeof DeviceMotionEvent === "undefined") {
		return "unavailable";
	}

	const anyDM = DeviceMotionEvent as unknown as {
		requestPermission?: () => Promise<"granted" | "denied">;
	};

	if (typeof anyDM.requestPermission !== "function") {
		// Older iOS / non-iOS browsers that don't use the permission API.
		return "unavailable";
	}

	try {
		const result = await anyDM.requestPermission();
		return result === "granted" ? "granted" : "denied";
	} catch {
		return "denied";
	}
}


