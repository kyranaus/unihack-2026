// src/components/record/TrafficOverlay.tsx
import { useEffect, useRef } from "react";
import type { Detection } from "#/lib/traffic-detection";

interface TrafficOverlayProps {
	videoRef: React.RefObject<HTMLVideoElement | null>;
	detections: Detection[];
	modelLoading: boolean;
	modelReady: boolean;
	className?: string;
}

const BRACKET_LEN = 12;
const BRACKET_WIDTH = 2.5;
// Time-based smoothing: boxes reach ~95% of target in this many ms
const SMOOTH_MS = 120;
// Keep a lost box visible for this many ms before removing
const HOLD_MS = 300;

interface TrackedBox {
	id: number;
	classId: number;
	label: string;
	confidence: number;
	color: string;
	// target (from latest detection)
	tx: number;
	ty: number;
	tw: number;
	th: number;
	// display (smoothed)
	dx: number;
	dy: number;
	dw: number;
	dh: number;
	// when last matched to a live detection
	lastSeen: number;
	alive: boolean;
}

let nextBoxId = 0;

function drawBracketBox(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	w: number,
	h: number,
	color: string,
	glow: boolean,
) {
	ctx.save();
	ctx.strokeStyle = color;
	ctx.lineWidth = BRACKET_WIDTH;
	ctx.lineCap = "round";
	if (glow) {
		ctx.shadowColor = color;
		ctx.shadowBlur = 8;
	}
	const bl = Math.min(BRACKET_LEN, w / 3, h / 3);
	const corners: [number, number, number, number, number, number][] = [
		[x, y + bl, x, y, x + bl, y],
		[x + w - bl, y, x + w, y, x + w, y + bl],
		[x, y + h - bl, x, y + h, x + bl, y + h],
		[x + w - bl, y + h, x + w, y + h, x + w, y + h - bl],
	];
	for (const [x1, y1, cx, cy, x2, y2] of corners) {
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(cx, cy);
		ctx.lineTo(x2, y2);
		ctx.stroke();
	}
	ctx.restore();
}

function drawFill(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	w: number,
	h: number,
	color: string,
	alpha: number,
) {
	ctx.save();
	ctx.globalAlpha = alpha * 0.08;
	ctx.fillStyle = color;
	ctx.fillRect(x, y, w, h);
	ctx.restore();
}

function drawLabel(
	ctx: CanvasRenderingContext2D,
	text: string,
	x: number,
	y: number,
	color: string,
	alpha: number,
) {
	ctx.save();
	ctx.globalAlpha = alpha;
	ctx.font = "bold 11px 'SF Mono', 'Consolas', monospace";
	const metrics = ctx.measureText(text);
	const pw = metrics.width + 8;
	const ph = 16;
	const px = x;
	const py = y - ph - 2;
	ctx.fillStyle = "rgba(0,0,0,0.75)";
	ctx.beginPath();
	ctx.roundRect(px, py, pw, ph, 4);
	ctx.fill();
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.roundRect(px, py, 3, ph, [4, 0, 0, 4]);
	ctx.fill();
	ctx.fillStyle = "#ffffff";
	ctx.textBaseline = "middle";
	ctx.fillText(text, px + 7, py + ph / 2);
	ctx.restore();
}

export function TrafficOverlay({
	videoRef,
	detections,
	modelLoading,
	modelReady,
	className = "",
}: TrafficOverlayProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const trackedRef = useRef<TrackedBox[]>([]);
	const detsRef = useRef(detections);
	detsRef.current = detections;
	const readyRef = useRef(modelReady);
	readyRef.current = modelReady;
	const prevTimeRef = useRef(0);

	// Whenever new detections arrive, match them to tracked boxes
	useEffect(() => {
		const now = performance.now();
		const tracked = trackedRef.current;
		const used = new Set<number>();

		for (const det of detections) {
			const [cx, cy, w, h] = det.bbox;
			let bestIdx = -1;
			let bestDist = 0.2; // max manhattan distance to match
			for (let i = 0; i < tracked.length; i++) {
				if (used.has(i)) continue;
				if (tracked[i].classId !== det.classId) continue;
				const dist =
					Math.abs(tracked[i].tx - cx) + Math.abs(tracked[i].ty - cy);
				if (dist < bestDist) {
					bestDist = dist;
					bestIdx = i;
				}
			}

			if (bestIdx >= 0) {
				// Update existing tracked box target
				const box = tracked[bestIdx];
				box.tx = cx;
				box.ty = cy;
				box.tw = w;
				box.th = h;
				box.confidence = det.confidence;
				box.color = det.color;
				box.label = det.label;
				box.lastSeen = now;
				box.alive = true;
				used.add(bestIdx);
			} else {
				// New detection — create with display = target (no lerp jump)
				tracked.push({
					id: nextBoxId++,
					classId: det.classId,
					label: det.label,
					confidence: det.confidence,
					color: det.color,
					tx: cx,
					ty: cy,
					tw: w,
					th: h,
					dx: cx,
					dy: cy,
					dw: w,
					dh: h,
					lastSeen: now,
					alive: true,
				});
			}
		}

		// Mark unmatched boxes as not alive (they'll fade out)
		for (let i = 0; i < tracked.length; i++) {
			if (!used.has(i) && tracked[i].lastSeen !== now) {
				tracked[i].alive = false;
			}
		}
	}, [detections]);

	// Single rAF draw loop — runs at display refresh rate
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		let raf: number;
		const ctx = canvas.getContext("2d");

		const draw = (now: number) => {
			if (!ctx) {
				raf = requestAnimationFrame(draw);
				return;
			}

			const dt = prevTimeRef.current > 0 ? now - prevTimeRef.current : 16;
			prevTimeRef.current = now;
			// Exponential smoothing factor based on elapsed time
			const alpha = 1 - Math.exp((-dt * 3) / SMOOTH_MS);

			const cw = canvas.clientWidth;
			const ch = canvas.clientHeight;
			if (cw > 0 && ch > 0 && (canvas.width !== cw || canvas.height !== ch)) {
				canvas.width = cw;
				canvas.height = ch;
			}
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			const tracked = trackedRef.current;
			const video = videoRef.current;
			if (!video || !readyRef.current || tracked.length === 0) {
				raf = requestAnimationFrame(draw);
				return;
			}

			const vw = video.videoWidth || 1;
			const vh = video.videoHeight || 1;
			const coverScale = Math.max(canvas.width / vw, canvas.height / vh);
			const ox = (vw * coverScale - canvas.width) / 2;
			const oy = (vh * coverScale - canvas.height) / 2;

			// Remove boxes that have been gone too long
			for (let i = tracked.length - 1; i >= 0; i--) {
				if (!tracked[i].alive && now - tracked[i].lastSeen > HOLD_MS) {
					tracked.splice(i, 1);
				}
			}

			for (const box of tracked) {
				// Smoothly move display values toward target
				box.dx += (box.tx - box.dx) * alpha;
				box.dy += (box.ty - box.dy) * alpha;
				box.dw += (box.tw - box.dw) * alpha;
				box.dh += (box.th - box.dh) * alpha;

				// Fade out boxes that lost their detection
				const fade = box.alive
					? 1
					: Math.max(0, 1 - (now - box.lastSeen) / HOLD_MS);

				const px = (box.dx - box.dw / 2) * vw * coverScale - ox;
				const py = (box.dy - box.dh / 2) * vh * coverScale - oy;
				const pw = box.dw * vw * coverScale;
				const ph = box.dh * vh * coverScale;

				if (pw < 10 || ph < 10) continue;

				ctx.globalAlpha = fade;
				drawFill(ctx, px, py, pw, ph, box.color, fade);
				drawBracketBox(ctx, px, py, pw, ph, box.color, box.confidence > 0.7);
				const pct = Math.round(box.confidence * 100);
				drawLabel(ctx, `${box.label} ${pct}%`, px, py, box.color, fade);
				ctx.globalAlpha = 1;
			}

			raf = requestAnimationFrame(draw);
		};

		raf = requestAnimationFrame(draw);
		return () => {
			cancelAnimationFrame(raf);
			prevTimeRef.current = 0;
		};
	}, [videoRef]);

	return (
		<>
			<canvas
				ref={canvasRef}
				className={`absolute inset-0 pointer-events-none ${className}`}
				style={{ zIndex: 12 }}
			/>
		</>
	);
}
