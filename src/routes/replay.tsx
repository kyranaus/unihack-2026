// src/routes/replay.tsx
import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useCallback } from "react";
import { Play, Pause, BarChart2, Clock, Route as RouteIcon, Zap } from "lucide-react";
import { DriverFeedback } from "#/components/DriverFeedback";

export const Route = createFileRoute("/replay")({ component: ReplayPage });

const TOTAL = 25 * 60 + 45; // 25:45 in seconds

const DRIVE_LIST = [
  { label: "Today", time: "8:42 AM", duration: "14 min", score: 91, color: "#22c55e" },
  { label: "Yesterday", time: "6:15 PM", duration: "32 min", score: 78, color: "#f59e0b" },
  { label: "Mon 10 Mar", time: "9:00 AM", duration: "21 min", score: 88, color: "#22c55e" },
  { label: "Sun 9 Mar", time: "2:30 PM", duration: "18 min", score: 72, color: "#f59e0b" },
  { label: "Sat 8 Mar", time: "11:15 AM", duration: "45 min", score: 95, color: "#22c55e" },
];

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const ss = Math.floor(s % 60);
  return `${m}:${ss.toString().padStart(2, "0")}`;
}

function ReplayPage() {
  const [current, setCurrent] = useState(11 * 60 + 2);
  const [playing, setPlaying] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [selectedDrive, setSelectedDrive] = useState(0);
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

  const selected = DRIVE_LIST[selectedDrive];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-md md:max-w-5xl px-4 md:px-8 pt-10 md:pt-20 pb-32 md:pb-12 flex flex-col gap-4">

        <header className="mb-2 shrink-0">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            DashCam
          </p>
          <h1 className="mt-1 text-2xl font-semibold">Replay</h1>
        </header>

        {/* ── Desktop: video left + drive list right / Mobile: stacked ── */}
        <div className="flex flex-col md:grid md:grid-cols-[3fr_2fr] md:gap-6 gap-4">

          {/* ── Left: player ── */}
          <div className="flex flex-col gap-3">

            {/* Video placeholder */}
            <div className="relative w-full overflow-hidden rounded-2xl bg-card border border-border" style={{ aspectRatio: "16/9" }}>
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
              {/* Score badge */}
              <div
                className="absolute top-3 right-3 rounded-full px-3 py-1 text-sm font-black backdrop-blur-sm"
                style={{ color: selected.color, backgroundColor: "rgba(0,0,0,0.5)" }}
              >
                {selected.score}
              </div>
            </div>

            {/* Scrubber */}
            <div className="px-1">
              <div
                ref={trackRef}
                className="relative h-5 cursor-pointer flex items-center"
                onClick={scrubTo}
                onMouseMove={(e) => e.buttons === 1 && scrubTo(e)}
              >
                <div className="absolute inset-x-0 h-1 rounded-full bg-muted" />
                <div
                  className="absolute left-0 h-1 rounded-full bg-primary"
                  style={{ width: `${getPercent()}%` }}
                />
                <div
                  className="absolute h-4 w-4 -translate-x-1/2 rounded-full bg-zinc-400 shadow"
                  style={{ left: `${getPercent()}%` }}
                />
              </div>
              <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                <span>{fmt(current)}</span>
                <span>{fmt(TOTAL)}</span>
              </div>
            </div>

            {/* Drive info chips — desktop only */}
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5">
                <Clock size={12} className="text-muted-foreground" />
                <span className="text-xs font-semibold">{selected.duration}</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5">
                <RouteIcon size={12} className="text-muted-foreground" />
                <span className="text-xs font-semibold">12.4 km</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5">
                <Zap size={12} className="text-primary" />
                <span className="text-xs font-semibold" style={{ color: selected.color }}>Score {selected.score}</span>
              </div>
            </div>

            {/* Drive report button */}
            <button
              onClick={() => setShowReport(true)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-card border border-border py-3 text-sm font-semibold text-foreground transition hover:bg-secondary"
            >
              <BarChart2 size={16} />
              View Drive Report
            </button>
          </div>

          {/* ── Right: drive list ── */}
          <div className="rounded-2xl bg-card border border-border overflow-hidden">
            <p className="px-5 pt-4 pb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground border-b border-border">
              Recent drives
            </p>
            <div className="flex flex-col divide-y divide-border">
              {DRIVE_LIST.map((d, i) => (
                <button
                  key={d.label}
                  onClick={() => setSelectedDrive(i)}
                  className="flex items-center justify-between px-5 py-3 text-left transition hover:bg-secondary/50"
                  style={selectedDrive === i ? { backgroundColor: "rgba(234,179,8,0.06)" } : {}}
                >
                  <div>
                    <p className="text-sm font-semibold">{d.label}</p>
                    <p className="text-xs text-muted-foreground">{d.time} · {d.duration}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black" style={{ color: d.color }}>{d.score}</span>
                    {selectedDrive === i && (
                      <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "var(--primary)" }} />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      <DriverFeedback isOpen={showReport} onClose={() => setShowReport(false)} />
    </main>
  );
}
