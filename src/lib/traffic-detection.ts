// src/lib/traffic-detection.ts
// Shared types and constants for traffic detection (inference runs in worker)

export const YOLO_INPUT_SIZE = 320;

/** Classes relevant to road/traffic scenes */
export const TRAFFIC_CLASSES = new Set([
	"person",
	"bicycle",
	"car",
	"motorcycle",
	"bus",
	"truck",
	"traffic light",
	"stop sign",
]);

/** Colour per class family */
export const CLASS_COLORS: Record<string, string> = {
	person: "#f97316",
	bicycle: "#06b6d4",
	motorcycle: "#06b6d4",
	car: "#facc15",
	truck: "#4ade80",
	bus: "#4ade80",
	"traffic light": "#a78bfa",
	"stop sign": "#f87171",
};

export interface Detection {
	classId: number;
	label: string;
	confidence: number;
	/** [x_center, y_center, width, height] normalised 0–1 relative to *original* image */
	bbox: [number, number, number, number];
	color: string;
}

/** How close the nearest lead vehicle appears (based on bbox size) */
export type FollowingDistance = "too_close" | "close" | "safe" | "clear";

const LEAD_VEHICLE_CLASSES = new Set(["car", "motorcycle", "bus", "truck"]);

/**
 * Estimate following distance from YOLO detections.
 * Uses bbox area as a proxy for proximity — larger area = closer vehicle.
 * Only considers vehicles roughly in the centre third of the frame (ahead).
 */
export function estimateFollowingDistance(detections: Detection[]): {
	level: FollowingDistance;
	proximity: number;
} {
	const ahead = detections.filter(
		(d) =>
			LEAD_VEHICLE_CLASSES.has(d.label) &&
			d.bbox[0] > 0.2 &&
			d.bbox[0] < 0.8,
	);
	if (ahead.length === 0) return { level: "clear", proximity: 0 };

	const maxProximity = Math.max(...ahead.map((d) => d.bbox[2] * d.bbox[3]));

	let level: FollowingDistance;
	if (maxProximity > 0.25) level = "too_close";
	else if (maxProximity > 0.1) level = "close";
	else if (maxProximity > 0.03) level = "safe";
	else level = "clear";

	return { level, proximity: maxProximity };
}
