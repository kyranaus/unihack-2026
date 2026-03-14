// src/lib/media-utils.ts

const MIME_PRIORITY = [
	"video/webm;codecs=vp9,opus",
	"video/webm;codecs=vp8,opus",
	"video/webm",
	"video/mp4",
] as const;

export function getSupportedMimeType(): string {
	if (typeof MediaRecorder === "undefined") return "";
	for (const type of MIME_PRIORITY) {
		if (MediaRecorder.isTypeSupported(type)) return type;
	}
	return "";
}

export function downloadBlob(blob: Blob, filename: string): void {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

export function formatDuration(seconds: number): string {
	const m = Math.floor(seconds / 60)
		.toString()
		.padStart(2, "0");
	const s = (seconds % 60).toString().padStart(2, "0");
	return `${m}:${s}`;
}
