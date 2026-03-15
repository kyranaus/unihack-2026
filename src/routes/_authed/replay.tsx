// src/routes/_authed/replay.tsx
import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useState, useRef, useCallback, useEffect } from "react";
import { z } from "zod";
import { Play, Pause, BarChart2, Clock, Download, Zap, Link2, ShieldCheck, ShieldX, Loader2, ExternalLink, Cloud } from "lucide-react";

const EXPLORER_URL = "https://sepolia.basescan.org/tx";
import { DriverFeedback } from "#/components/DriverFeedback";
import type { SessionData } from "#/components/DriverFeedback";
import { listRecordings, getRecording } from "#/lib/replay-store";
import type { RecordingMeta, SpeedSample } from "#/lib/replay-store";
import { client } from "#/server/orpc/client";

export const Route = createFileRoute("/_authed/replay")({
  component: ReplayPage,
  validateSearch: z.object({ t: z.number().optional() }),
});

function fmt(s: number) {
  if (!Number.isFinite(s) || isNaN(s)) return "0:00";
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

function speedAtTime(track: SpeedSample[] | undefined, timeSec: number): number | null {
  if (!track || track.length === 0) return null;
  if (timeSec <= track[0].elapsedSec) return track[0].speedKmh;
  if (timeSec >= track[track.length - 1].elapsedSec) return track[track.length - 1].speedKmh;
  for (let i = 1; i < track.length; i++) {
    if (timeSec <= track[i].elapsedSec) {
      const prev = track[i - 1];
      const next = track[i];
      const t = (timeSec - prev.elapsedSec) / (next.elapsedSec - prev.elapsedSec);
      return prev.speedKmh + t * (next.speedKmh - prev.speedKmh);
    }
  }
  return null;
}

interface DriveEntry {
  meta: RecordingMeta;
  url: string;
  backUrl: string | null;
  source: "local" | "cloud";
  videoKey?: string;
  speedTrack?: SpeedSample[];
  txHash?: string | null;
}

function ReplayPage() {
  const { t: refreshKey } = useSearch({ from: "/_authed/replay" });
  const [drives, setDrives] = useState<DriveEntry[]>([]);
  const [loadingDrives, setLoadingDrives] = useState(true);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeCamera, setActiveCamera] = useState<"front" | "back">("back");
  const [showDownloadSheet, setShowDownloadSheet] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [verifyState, setVerifyState] = useState<"idle" | "hashing" | "checking" | "pass" | "fail">("idle");
  const frontVideoRef = useRef<HTMLVideoElement>(null);
  const backVideoRef = useRef<HTMLVideoElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  // Tracks blob URLs we created so we can revoke them on unmount
  const blobUrlsRef = useRef<string[]>([]);
  const loadDrives = useCallback(async () => {
    setLoadingDrives(true);
    try {
      const [localMetas, serverResult] = await Promise.all([
        listRecordings(),
        client.listDriveSessions({}).catch(() => ({ sessions: [] })),
      ]);

      // Don't load blobs upfront — only store metas, resolve URLs lazily when selected.
      const localEntries: DriveEntry[] = localMetas.map((meta) => ({
        meta,
        url: "",
        backUrl: null,
        source: "local" as const,
      }));

      const localSessionIds = new Set(localMetas.map((m) => m.sessionId).filter(Boolean));
      const cloudEntries: DriveEntry[] = serverResult.sessions
        .filter((s) => s.videoKey && !localSessionIds.has(s.id))
        .map((s) => ({
          meta: {
            id: s.id,
            timestamp: new Date(s.startedAt).getTime(),
            duration: s.endedAt
              ? Math.round((new Date(s.endedAt).getTime() - new Date(s.startedAt).getTime()) / 1000)
              : 0,
            mimeType: "video/webm",
            score: s.score ?? 0,
            sessionId: s.id,
          },
          url: "",
          backUrl: null,
          source: "cloud" as const,
          videoKey: s.videoKey!,
          txHash: s.txHash,
        }));

      const all = [...localEntries, ...cloudEntries].sort(
        (a, b) => b.meta.timestamp - a.meta.timestamp,
      );

      setDrives(all);
      setSelectedIdx(0);
    } catch (e) {
      console.error("Failed to load recordings", e);
    } finally {
      setLoadingDrives(false);
    }
  }, []);

  useEffect(() => { loadDrives(); }, [loadDrives, refreshKey]);

  // Revoke all blob URLs we created when the component unmounts.
  useEffect(() => {
    return () => {
      for (const url of blobUrlsRef.current) URL.revokeObjectURL(url);
    };
  }, []);

  // Lazily resolve URL for the selected drive (local blob or cloud signed URL).
  // Depends on selectedIdx AND drives so the effect fires after initial load
  // when drives are populated. The bail-out check (drive.url truthy) prevents
  // a feedback loop when setDrives updates the URL.
  useEffect(() => {
    const drive = drives[selectedIdx];
    if (!drive || drive.url) return;

    let cancelled = false;

    if (drive.source === "local") {
      getRecording(drive.meta.id).then((rec) => {
        if (cancelled || !rec) return;
        const url = URL.createObjectURL(rec.videoBlob);
        const backUrl = rec.backVideoBlob ? URL.createObjectURL(rec.backVideoBlob) : null;
        blobUrlsRef.current.push(url);
        if (backUrl) blobUrlsRef.current.push(backUrl);
        setDrives((prev) =>
          prev.map((d) =>
            d.meta.id === drive.meta.id
              ? { ...d, url, backUrl, speedTrack: rec.speedTrack }
              : d,
          ),
        );
      }).catch((err) => console.error("Failed to load local recording:", err));
    } else if (drive.source === "cloud" && drive.videoKey) {
      client.getVideoDownloadUrl({ key: drive.videoKey }).then(({ url }) => {
        if (cancelled) return;
        setDrives((prev) =>
          prev.map((d) => (d.videoKey === drive.videoKey ? { ...d, url } : d)),
        );
      }).catch((err) => console.error("Failed to get cloud video URL:", err));
    }

    return () => { cancelled = true; };
  }, [selectedIdx, drives]);

  // Reset player state when selected drive changes
  useEffect(() => {
    setPlaying(false);
    setCurrentTime(0);
    setDuration(drives[selectedIdx]?.meta.duration ?? 0);
    setActiveCamera(drives[selectedIdx]?.backUrl ? "back" : "front");
  }, [selectedIdx, drives]);

  const getPercent = () => (duration > 0 ? (currentTime / duration) * 100 : 0);

  const scrubTo = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const track = trackRef.current;
      const front = frontVideoRef.current;
      const back = backVideoRef.current;
      if (!track || !front || !duration) return;
      const rect = track.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      front.currentTime = ratio * duration;
      if (back) back.currentTime = ratio * duration;
      setCurrentTime(front.currentTime);
    },
    [duration]
  );

  const togglePlay = () => {
    const front = frontVideoRef.current;
    const back = backVideoRef.current;
    const selected = drives[selectedIdx];
    if (!front || !selected?.url) return;
    if (playing) {
      front.pause();
      back?.pause();
      setPlaying(false);
    } else {
      front.play().catch(() => {});
      back?.play().catch(() => {});
      setPlaying(true);
    }
  };

  const selected = drives[selectedIdx];
  const color = selected ? scoreColor(selected.meta.score) : "#22c55e";
  const dateStr = selected ? new Date(selected.meta.timestamp).toISOString().slice(0, 10) : "recording";

  return (
    <main className="min-h-0 bg-background text-foreground">
      <div className="mx-auto w-full max-w-3xl px-8 pt-4 pb-32 md:pb-12 flex flex-col gap-4">

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
                <>
                  {/* Front cam */}
                  <video
                    key={`${selected.meta.id}-front`}
                    ref={frontVideoRef}
                    src={selected.url}
                    className={activeCamera === "front"
                      ? "absolute inset-0 z-0 h-full w-full object-cover"
                      : "absolute top-3 left-3 z-10 h-28 w-20 cursor-pointer rounded-xl object-cover ring-2 ring-white/30"}
                    onClick={() => activeCamera === "back" && setActiveCamera("front")}
                    playsInline
                    preload="auto"
                    onLoadedMetadata={() => {
                      const vidDuration = frontVideoRef.current?.duration;
                      setDuration(
                        vidDuration && Number.isFinite(vidDuration)
                          ? vidDuration
                          : selected.meta.duration
                      );
                    }}
                    onTimeUpdate={() => setCurrentTime(frontVideoRef.current?.currentTime ?? 0)}
                    onEnded={() => setPlaying(false)}
                    onWaiting={() => {
                      // Resume after a stall — common with MediaRecorder WebM files that lack seek tables
                      const v = frontVideoRef.current;
                      if (v) v.play().catch(() => {});
                    }}
                  />

                  {/* Back cam (PiP — only if available) */}
                  {selected.backUrl && (
                    <video
                      key={`${selected.meta.id}-back`}
                      ref={backVideoRef}
                      src={selected.backUrl}
                      className={activeCamera === "back"
                        ? "absolute inset-0 z-0 h-full w-full object-cover"
                        : "absolute top-3 left-3 z-10 h-28 w-20 cursor-pointer rounded-xl object-cover ring-2 ring-white/30"}
                      onClick={() => activeCamera === "front" && setActiveCamera("back")}
                      playsInline
                      preload="auto"
                      onWaiting={() => {
                        const v = backVideoRef.current;
                        if (v) v.play().catch(() => {});
                      }}
                    />
                  )}
                </>
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
                className="absolute bottom-3 left-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm"
              >
                {playing
                  ? <Pause size={18} fill="white" color="white" />
                  : <Play size={18} fill="white" color="white" />
                }
              </button>

              {/* Download */}
              {selected?.url && (
                <button
                  onClick={() => setShowDownloadSheet(true)}
                  className="absolute bottom-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm"
                  title="Download recording"
                >
                  <Download size={16} color="white" />
                </button>
              )}

              {/* Speed / score badge (top-right) */}
              {selected && (
                <div className="absolute top-3 right-3 z-20 flex flex-col items-center rounded-xl bg-black/60 px-3 py-2 backdrop-blur-sm min-w-[56px]">
                  <span className="font-mono text-xl font-black text-white leading-none">
                    {selected.speedTrack?.length
                      ? Math.round(speedAtTime(selected.speedTrack, currentTime) ?? 0)
                      : "–"}
                  </span>
                  <span className="text-[9px] font-semibold uppercase tracking-wider text-white/50 mt-0.5">km/h</span>
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
                      score: data.score ?? selected?.meta.score ?? 0,
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
                      className="flex items-center justify-between px-5 py-3 text-left transition cursor-pointer hover:bg-secondary/50"
                      style={selectedIdx === i ? { backgroundColor: "rgba(234,179,8,0.06)" } : {}}
                    >
                      <div>
                        <p className="text-sm font-semibold">
                          {relDate(d.meta.timestamp)}
                          {d.source === "cloud" && (
                            <span className="ml-1.5 inline-flex items-center gap-0.5 text-[9px] font-semibold uppercase tracking-wide text-primary">
                            <Cloud size={9} /> Cloud
                          </span>
                          )}
                          {d.txHash && (
                            <span className="ml-1.5 inline-flex items-center gap-0.5 text-[9px] font-semibold uppercase tracking-wide text-emerald-400">
                              <Link2 size={9} /> On-chain
                            </span>
                          )}
                        </p>
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

      {/* Download sheet */}
      {showDownloadSheet && selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => { setShowDownloadSheet(false); setVerifyState("idle"); }}
        >
          <div
            className="w-full max-w-sm mx-4 rounded-2xl bg-zinc-900 border border-white/10 px-6 py-5"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-white font-bold text-base text-center mb-4">Download recordings</p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-white">Front cam</p>
                  <p className="text-[10px] text-white/40">Driver view</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const a = document.createElement("a");
                    a.href = selected.url;
                    a.download = `front-cam-${dateStr}`;
                    a.click();
                  }}
                  className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white active:bg-white/20"
                >
                  <Download size={12} />
                  Download
                </button>
              </div>
              {selected.backUrl && (
                <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-white">Back cam</p>
                    <p className="text-[10px] text-white/40">Road view</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const a = document.createElement("a");
                      a.href = selected.backUrl!;
                      a.download = `back-cam-${dateStr}`;
                      a.click();
                    }}
                    className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white active:bg-white/20"
                  >
                    <Download size={12} />
                    Download
                  </button>
                </div>
              )}
            </div>

            {/* Blockchain verification */}
            {selected.txHash && (
              <div className="mt-3 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
                <div className="flex items-center gap-2 mb-2">
                  <Link2 size={13} className="text-emerald-400" />
                  <p className="text-[11px] font-semibold text-emerald-400">Blockchain integrity proof</p>
                </div>
                <a
                  href={`${EXPLORER_URL}/${selected.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-3 flex items-center gap-1.5 text-[10px] font-mono text-white/40 hover:text-emerald-400/80 transition"
                >
                  <span className="truncate">{selected.txHash}</span>
                  <ExternalLink size={10} className="shrink-0" />
                </a>
                <button
                  type="button"
                  disabled={verifyState === "checking"}
                  onClick={async () => {
                    const sid = (selected.meta as any).sessionId as string | undefined;
                    if (!sid) return;
                    try {
                      setVerifyState("checking");
                      const result = await client.verifyVideoHash({ sessionId: sid });
                      setVerifyState(result.verified ? "pass" : "fail");
                    } catch {
                      setVerifyState("fail");
                    }
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-900/40 py-2 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-900/60 disabled:opacity-50"
                >
                  {verifyState === "checking" && <><Loader2 size={13} className="animate-spin" /> Verifying on-chain…</>}
                  {verifyState === "pass" && <><ShieldCheck size={13} /> Verified — unmodified</>}
                  {verifyState === "fail" && <><ShieldX size={13} className="text-red-400" /> <span className="text-red-300">Verification failed</span></>}
                  {verifyState === "idle" && <><ShieldCheck size={13} /> Verify integrity</>}
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => { setShowDownloadSheet(false); setVerifyState("idle"); }}
              className="mt-4 w-full rounded-xl bg-white/10 py-3 text-sm font-semibold text-white/70"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <DriverFeedback
        isOpen={showReport}
        sessionData={sessionData}
        onClose={() => { setShowReport(false); setSessionData(null); }}
      />
    </main>
  );
}
