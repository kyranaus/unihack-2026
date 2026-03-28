// src/hooks/useRoadBehaviorLogger.ts
import { useEffect, useRef } from "react";
import type { RoadBehaviorMetrics } from "#/hooks/use-road-behavior";
import { getActiveSession } from "#/hooks/useDriveSession";
import { client } from "#/server/orpc/client";

const COOLDOWNS: Record<string, number> = {
	harsh_braking: 15_000,
	rapid_acceleration: 15_000,
	close_following: 20_000,
};

export function useRoadBehaviorLogger(
	metrics: RoadBehaviorMetrics,
	camera: "front" | "back" = "back",
) {
	const lastLogRef = useRef<Record<string, number>>({});

	useEffect(() => {
		const session = getActiveSession();
		if (!session) return;

		const now = Date.now();
		const elapsed = Math.max(0, session.elapsedSec);

		const log = (
			type: "harsh_braking" | "rapid_acceleration" | "close_following",
			summary: string,
			severity: "warning" | "critical",
			metadata: Record<string, unknown>,
		) => {
			const last = lastLogRef.current[type] ?? 0;
			if (now - last < (COOLDOWNS[type] ?? 15_000)) return;
			lastLogRef.current[type] = now;

			client
				.logDriverEvent({
					sessionId: session.sessionId,
					elapsedSec: elapsed,
					type,
					summary,
					severity,
					camera,
					metadata,
				})
				.catch(() => {});
		};

		if (metrics.isHarshBraking) {
			log("harsh_braking", "Harsh braking detected", "warning", {
				accel: Number(metrics.longitudinalAccel.toFixed(2)),
			});
		}

		if (metrics.isRapidAcceleration) {
			log("rapid_acceleration", "Rapid acceleration detected", "warning", {
				accel: Number(metrics.longitudinalAccel.toFixed(2)),
			});
		}

		if (metrics.followingDistance === "too_close") {
			log("close_following", "Following distance too close", "warning", {
				proximity: Number(metrics.leadVehicleProximity.toFixed(3)),
			});
		}
	}, [metrics, camera]);
}
