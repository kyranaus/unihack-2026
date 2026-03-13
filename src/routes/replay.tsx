// src/routes/replay.tsx
import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useCallback } from "react";
import { Play, Pause, BarChart2 } from "lucide-react";
import { DriverFeedback } from "#/components/DriverFeedback";

export const Route = createFileRoute("/replay")({ component: ReplayPage });

const TOTAL = 25 * 60 + 45; // 25:45 in seconds

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const ss = Math.floor(s % 60);
  return `${m}:${ss.toString().padStart(2, "0")}`;
}

function ReplayPage() {
  const [current, setCurrent] = useState(11 * 60 + 2); // start at 11:02
  const [playing, setPlaying] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const getPercent = () => (current / TOTAL) * 100;

  const scrubTo = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const clientX =
      "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    setCurrent(Math.round(ratio * TOTAL));
  }, []);

  return (
    <main className="h-screen overflow-hidden bg-background text-foreground">
      <div className="mx-auto flex h-full max-w-md flex-col px-4 pt-10 pb-32">
        <header className="mb-4 shrink-0">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            DashCam
          </p>
          <h1 className="mt-1 text-2xl font-semibold">Replay</h1>
        </header>

        {/* Video placeholder */}
        <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl bg-card">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm text-muted-foreground">No footage selected</span>
          </div>
          {/* Play/pause overlay */}
          <button
            onClick={() => setPlaying((p) => !p)}
            className="absolute bottom-3 left-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm"
          >
            {playing ? (
              <Pause size={18} fill="white" color="white" />
            ) : (
              <Play size={18} fill="white" color="white" />
            )}
          </button>
        </div>

        {/* Scrubber */}
        <div className="mt-4 px-1">
          {/* Track */}
          <div
            ref={trackRef}
            className="relative h-5 cursor-pointer flex items-center"
            onClick={scrubTo}
            onMouseMove={(e) => e.buttons === 1 && scrubTo(e)}
          >
            {/* Background */}
            <div className="absolute inset-x-0 h-1 rounded-full bg-muted" />
            {/* Progress */}
            <div
              className="absolute left-0 h-1 rounded-full bg-primary"
              style={{ width: `${getPercent()}%` }}
            />
            {/* Thumb */}
            <div
              className="absolute h-4 w-4 -translate-x-1/2 rounded-full bg-zinc-400 shadow"
              style={{ left: `${getPercent()}%` }}
            />
          </div>

          {/* Times */}
          <div className="mt-1 flex justify-between text-xs text-muted-foreground">
            <span>{fmt(current)}</span>
            <span>{fmt(TOTAL)}</span>
          </div>
        </div>

        {/* Drive report button */}
        <button
          onClick={() => setShowReport(true)}
          className="mt-4 shrink-0 flex w-full items-center justify-center gap-2 rounded-2xl bg-card border border-border py-3 text-sm font-semibold text-foreground transition hover:bg-secondary"
        >
          <BarChart2 size={16} />
          View Drive Report
        </button>
      </div>

      <DriverFeedback isOpen={showReport} onClose={() => setShowReport(false)} />
    </main>
  );
}
