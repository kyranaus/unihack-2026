// src/hooks/use-road-behavior.ts
import { useState, useEffect, useMemo } from "react";
import {
	estimateFollowingDistance,
	type FollowingDistance,
	type Detection,
} from "#/lib/traffic-detection";

export interface RoadBehaviorMetrics {
	followingDistance: FollowingDistance;
	/** 0–1, higher = closer lead vehicle */
	leadVehicleProximity: number;
	isHarshBraking: boolean;
	isRapidAcceleration: boolean;
	/** Smoothed longitudinal acceleration in m/s² (positive = forward, negative = braking) */
	longitudinalAccel: number;
}

// Thresholds (m/s²) — tuned for typical landscape windshield mount using y-axis
const HARSH_BRAKE_MS2 = -4;
const RAPID_ACCEL_MS2 = 4;
/** Must sustain threshold for this long before flagging */
const SUSTAIN_MS = 350;
const SMOOTH_ALPHA = 0.25;

export function useRoadBehavior(
	detections: Detection[],
	enabled: boolean,
): RoadBehaviorMetrics {
	// Computed synchronously during render — no extra setState / re-render cycle
	const { level: followingDistance, proximity: leadVehicleProximity } = useMemo(
		() =>
			enabled
				? estimateFollowingDistance(detections)
				: { level: "clear" as FollowingDistance, proximity: 0 },
		[detections, enabled],
	);

	const [accel, setAccel] = useState({
		isHarshBraking: false,
		isRapidAcceleration: false,
		longitudinalAccel: 0,
	});

	// Acceleration / braking — DeviceMotion
	useEffect(() => {
		if (!enabled || typeof window === "undefined") return;
		if (typeof DeviceMotionEvent === "undefined") return;

		let smoothed = 0;
		let harshBrakeStart = 0;
		let rapidAccelStart = 0;

		const handleMotion = (e: DeviceMotionEvent) => {
			// Prefer gravity-free acceleration; fall back to includesGravity
			const acc = e.acceleration ?? e.accelerationIncludingGravity;
			if (!acc) return;

			// y-axis is the longitudinal axis for a landscape-mounted phone
			const raw = acc.y ?? 0;
			smoothed = smoothed * (1 - SMOOTH_ALPHA) + raw * SMOOTH_ALPHA;

			const now = Date.now();

			if (smoothed < HARSH_BRAKE_MS2) {
				if (!harshBrakeStart) harshBrakeStart = now;
			} else {
				harshBrakeStart = 0;
			}

			if (smoothed > RAPID_ACCEL_MS2) {
				if (!rapidAccelStart) rapidAccelStart = now;
			} else {
				rapidAccelStart = 0;
			}

			setAccel({
				isHarshBraking: harshBrakeStart > 0 && now - harshBrakeStart >= SUSTAIN_MS,
				isRapidAcceleration: rapidAccelStart > 0 && now - rapidAccelStart >= SUSTAIN_MS,
				longitudinalAccel: smoothed,
			});
		};

		window.addEventListener("devicemotion", handleMotion);
		return () => {
			window.removeEventListener("devicemotion", handleMotion);
			setAccel({ isHarshBraking: false, isRapidAcceleration: false, longitudinalAccel: 0 });
		};
	}, [enabled]);

	return { followingDistance, leadVehicleProximity, ...accel };
}
