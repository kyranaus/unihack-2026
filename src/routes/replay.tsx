// src/routes/replay.tsx
import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useCallback, useEffect } from "react";
import { Play, Pause, BarChart2, Clock, Download, Zap } from "lucide-react";
import { DriverFeedback } from "#/components/DriverFeedback";
import type { SessionData } from "#/components/DriverFeedback";
import { listRecordings, getRecording } from "#/lib/replay-store";
import type { RecordingMeta } from "#/lib/replay-store";
import { client } from "#/server/orpc/client";

export const Route = createFileRoute("/replay")({ component: ReplayPage });

function fmt(s: number) {
  const t = Math.floor(s);
  return `${Math.floor(t / 60)}:${(t % 60).toString().padStart(2, "0")}`;
}

function relDate(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return new Date(ts).toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short" });
}

function fmtTime(ts: number): string {
  return new Date(ts).toLocaleTimeString("en-AU", { hour: "numeric", minute: "2-digit", hour12: true });
}

function scoreColor(score: number): string {
  return score >= 85 ? "#22c55e" : score >= 70 ? "#f59e0b" : "#ef4444";
}

interface DriveEntry {
  meta: RecordingMeta;
  url: string;
}

function ReplayPage() {
  const [drives, setDrives] = useState<DriveEntry[]>([]);
  const [loadingDrives, setLoadingDrives] = useState(true);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showReport, setShowReport] = useState(false);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Load recordings from IndexedDB
  useEffect(() => {
    let cancelled = false;
    const urls: string[] = [];

    async function load() {
      try {
        const metas = await listRecordings();
        if (cancelled) return;

        const entries: DriveEntry[] = await Promise.all(
          metas.map(async (meta) => {
            const rec = await getRecording(meta.id);
            const url = rec ? URL.createObjectURL(rec.videoBlob) : "";
            if (url) urls.push(url);
            return { meta, url };
          })
        );

        if (!cancelled) {
          setDrives(entries);
          setSelectedIdx(0);
        }
      } catch (e) {
        console.error("Failed to load recordings", e);
      } finally {
        if (!cancelled) setLoadingDrives(false);
      }
    }

    load();
    return () => {
      cancelled = true;
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, []);

  // Reset video state when selected drive changes
  useEffect(() => {
    setPlaying(false);
    setCurrentTime(0);
    setDuration(drives[selectedIdx]?.meta.duration ?? 0);
  }, [selectedIdx, drives]);

  const getPercent = () => (duration > 0 ? (currentTime / duration) * 100 : 0);

  const scrubTo = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const track = trackRef.current;
      const video = videoRef.current;
      if (!track || !video || !duration) return;
      const rect = track.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      video.currentTime = ratio * duration;
      setCurrentTime(video.currentTime);
    },
    [duration]
  );

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video || !drives[selectedIdx]?.url) return;
    if (playing) { video.pause(); setPlaying(false); }
    else { video.play().catch(() => {}); setPlaying(true); }
  };

  const handleDownload = () => {
    const drive = drives[selectedIdx];
    if (!drive?.url) return;
    const a = document.createElement("a");
    a.href = drive.url;
    a.download = `beesafe-${new Date(drive.meta.timestamp).toISOString().slice(0, 10)}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const selected = drives[selectedIdx];
  const color = selected ? scoreColor(selected.meta.score) : "#22c55e";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-md md:max-w-5xl px-4 md:px-8 pt-10 md:pt-20 pb-32 md:pb-12 flex flex-col gap-4">

        <header className="mb-2 shrink-0">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">DashCam</p>
          <h1 className="mt-1 text-2xl font-semibold">Replay</h1>
        </header>

        <div className="flex flex-col md:grid md:grid-cols-[3fr_2fr] md:gap-6 gap-4">

          {/* ── Left: player ── */}
          <div className="flex flex-col gap-3">

            {/* Video */}
            <div className="relative w-full overflow-hidden rounded-2xl bg-card border border-border" style={{ aspectRatio: "16/9" }}>
              {selected?.url ? (
                <video
                  key={selected.meta.id}
                  ref={videoRef}
                  src={selected.url}
                  className="absolute inset-0 h-full w-full object-cover"
                  playsInline
                  onLoadedMetadata={() => setDuration(videoRef.current?.duration ?? selected.meta.duration)}
                  onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime ?? 0)}
                  onEnded={() => setPlaying(false)}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm text-muted-foreground">
                    {loadingDrives ? "Loading…" : "No recordings yet"}
                  </span>
                </div>
              )}

              {/* Play/pause */}
              <button
                onClick={togglePlay}
                className="absolute bottom-3 left-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm"
              >
                {playing
                  ? <Pause size={18} fill="white" color="white" />
                  : <Play size={18} fill="white" color="white" />
                }
              </button>

              {/* Download */}
              {selected?.url && (
                <button
                  onClick={handleDownload}
                  className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm"
                  title="Download recording"
                >
                  <Download size={16} color="white" />
                </button>
              )}

              {/* Score badge */}
              {selected && (
                <div
                  className="absolute top-3 right-3 rounded-full px-3 py-1 text-sm font-black backdrop-blur-sm"
                  style={{ color, backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                  {selected.meta.score}
                </div>
              )}
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
                <div className="absolute left-0 h-1 rounded-full bg-primary" style={{ width: `${getPercent()}%` }} />
                <div className="absolute h-4 w-4 -translate-x-1/2 rounded-full bg-zinc-400 shadow" style={{ left: `${getPercent()}%` }} />
              </div>
              <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                <span>{fmt(currentTime)}</span>
                <span>{fmt(duration)}</span>
              </div>
            </div>

            {/* Desktop info chips */}
            {selected && (
              <div className="hidden md:flex items-center gap-3">
                <div className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5">
                  <Clock size={12} className="text-muted-foreground" />
                  <span className="text-xs font-semibold">{fmt(selected.meta.duration)}</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5">
                  <Zap size={12} className="text-primary" />
                  <span className="text-xs font-semibold" style={{ color }}>Score {selected.meta.score}</span>
                </div>
              </div>
            )}

            {/* Report button */}
            <button
              onClick={async () => {
                const meta = selected?.meta;
                if (!meta) return;
                const sid = (meta as any).sessionId as string | null;
                if (sid) {
                  setLoadingReport(true);
                  try {
                    const data = await client.getSession({ sessionId: sid });
                    setSessionData({
                      id: data.id,
                      score: data.score,
                      summary: data.summary,
                      cameras: data.cameras,
                      startedAt: data.startedAt.toISOString ? data.startedAt.toISOString() : String(data.startedAt),
                      endedAt: data.endedAt ? (data.endedAt.toISOString ? data.endedAt.toISOString() : String(data.endedAt)) : null,
                      events: data.events.map((e: any) => ({
                        id: e.id,
                        type: e.type,
                        camera: e.camera,
                        elapsedSec: e.elapsedSec,
                        summary: e.summary,
                        severity: e.severity,
                        metadata: e.metadata,
                      })),
                    });
                  } catch (err) {
                    console.error("Failed to fetch session:", err);
                    setSessionData(null);
                  } finally {
                    setLoadingReport(false);
                  }
                } else {
                  setSessionData(null);
                }
                setShowReport(true);
              }}
              disabled={!selected || loadingReport}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-card border border-border py-3 text-sm font-semibold text-foreground transition hover:bg-secondary disabled:opacity-40"
            >
              <BarChart2 size={16} />
              {loadingReport ? "Loading..." : "View Drive Report"}
            </button>
          </div>

          {/* ── Right: drive list ── */}
          <div className="rounded-2xl bg-card border border-border overflow-hidden">
            <p className="px-5 pt-4 pb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground border-b border-border">
              Recent drives
            </p>
            {loadingDrives ? (
              <div className="px-5 py-8 text-center text-sm text-muted-foreground">Loading…</div>
            ) : drives.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <p className="text-sm text-muted-foreground">No drives recorded yet</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Record a drive to see it here</p>
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-border">
                {drives.map((d, i) => {
                  const c = scoreColor(d.meta.score);
                  return (
                    <button
                      key={d.meta.id}
                      onClick={() => setSelectedIdx(i)}
                      className="flex items-center justify-between px-5 py-3 text-left transition hover:bg-secondary/50"
                      style={selectedIdx === i ? { backgroundColor: "rgba(234,179,8,0.06)" } : {}}
                    >
                      <div>
                        <p className="text-sm font-semibold">{relDate(d.meta.timestamp)}</p>
                        <p className="text-xs text-muted-foreground">{fmtTime(d.meta.timestamp)} · {fmt(d.meta.duration)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black" style={{ color: c }}>{d.meta.score}</span>
                        {selectedIdx === i && (
                          <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "var(--primary)" }} />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>

      <DriverFeedback
        isOpen={showReport}
        sessionData={sessionData}
        onClose={() => { setShowReport(false); setSessionData(null); }}
      />
    </main>
  );
}
