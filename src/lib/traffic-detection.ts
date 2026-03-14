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
