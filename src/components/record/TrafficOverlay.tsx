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

const BRACKET_LEN = 12; // corner bracket arm length in px
const BRACKET_WIDTH = 2.5;

/** Draw a corner-bracket style bounding box */
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

  const corners: [number, number, number, number, number, number][] = [
    // [startX, startY, midX, midY, endX, endY]  — top-left
    [x, y + BRACKET_LEN, x, y, x + BRACKET_LEN, y],
    // top-right
    [x + w - BRACKET_LEN, y, x + w, y, x + w, y + BRACKET_LEN],
    // bottom-left
    [x, y + h - BRACKET_LEN, x, y + h, x + BRACKET_LEN, y + h],
    // bottom-right
    [x + w - BRACKET_LEN, y + h, x + w, y + h, x + w, y + h - BRACKET_LEN],
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

/** Draw a thin transparent fill to make boxes pop */
function drawFill(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
) {
  ctx.save();
  ctx.fillStyle = color + "15"; // 8% opacity
  ctx.fillRect(x, y, w, h);
  ctx.restore();
}

/** Draw the label pill */
function drawLabel(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  color: string,
) {
  ctx.save();
  ctx.font = "bold 11px 'SF Mono', 'Consolas', monospace";
  const metrics = ctx.measureText(text);
  const pw = metrics.width + 8;
  const ph = 16;
  const px = x;
  const py = y - ph - 2;

  // pill background
  ctx.fillStyle = "rgba(0,0,0,0.75)";
  ctx.beginPath();
  ctx.roundRect(px, py, pw, ph, 4);
  ctx.fill();

  // coloured left accent
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(px, py, 3, ph, [4, 0, 0, 4]);
  ctx.fill();

  // text
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

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Sync canvas dimensions to displayed video size
    const cw = canvas.clientWidth;
    const ch = canvas.clientHeight;
    if (cw > 0 && ch > 0 && (canvas.width !== cw || canvas.height !== ch)) {
      canvas.width = cw;
      canvas.height = ch;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!video || !modelReady || detections.length === 0) return;

    const vw = video.videoWidth || 1;
    const vh = video.videoHeight || 1;
    const cWidth = canvas.width;
    const cHeight = canvas.height;

    // Map normalised bbox coords → canvas pixels (object-cover scaling)
    const coverScale = Math.max(cWidth / vw, cHeight / vh);
    const ox = (vw * coverScale - cWidth) / 2;
    const oy = (vh * coverScale - cHeight) / 2;

    for (const det of detections) {
      const [ncx, ncy, nw, nh] = det.bbox;
      const px = (ncx - nw / 2) * vw * coverScale - ox;
      const py = (ncy - nh / 2) * vh * coverScale - oy;
      const pw = nw * vw * coverScale;
      const ph = nh * vh * coverScale;

      if (pw < 10 || ph < 10) continue;

      drawFill(ctx, px, py, pw, ph, det.color);
      drawBracketBox(ctx, px, py, pw, ph, det.color, true);
      const pct = Math.round(det.confidence * 100);
      drawLabel(ctx, `${det.label} ${pct}%`, px, py, det.color);
    }
  }, [detections, modelReady, videoRef]);

  return (
    <>
      {/* Canvas overlay — covers the same area as the video */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 pointer-events-none ${className}`}
        style={{ zIndex: 12 }}
      />

      {/* HUD badge — top-right corner */}
      <div
        className="absolute top-3 right-12 z-20 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-bold tracking-widest uppercase backdrop-blur-sm select-none pointer-events-none"
        style={{
          background: "rgba(0,0,0,0.55)",
          border: "1px solid rgba(255,255,255,0.12)",
          color: modelLoading ? "rgba(255,255,255,0.5)" : modelReady ? "#4ade80" : "rgba(255,255,255,0.3)",
        }}
      >
        {/* Animated dot */}
        <span
          className={`h-1.5 w-1.5 rounded-full ${modelLoading ? "animate-pulse bg-yellow-400" : modelReady ? "bg-green-400" : "bg-zinc-500"}`}
        />
        {modelLoading ? "AI Loading…" : `Traffic AI${detections.length > 0 ? ` · ${detections.length}` : ""}`}
      </div>
    </>
  );
}
