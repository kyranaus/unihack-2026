import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useSearch } from "../_libs/tanstack__react-router.mjs";
import { l as listRecordings, g as getRecording } from "./replay-store-hei_UiKG.mjs";
import { c as client } from "./client-Bs9qvbFn.mjs";
import { P as Pause, c as Play, D as Download, d as Clock, Z as Zap, e as ChartNoAxesColumn, X, f as Camera, T as TriangleAlert, g as Car, E as Eye } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/tiny-invariant.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tiny-warning.mjs";
import "../_libs/orpc__server.mjs";
import "../_libs/orpc__shared.mjs";
import "../_libs/orpc__standard-server-fetch.mjs";
import "../_libs/orpc__standard-server.mjs";
import "../_libs/orpc__client.mjs";
import "../_libs/orpc__contract.mjs";
import "../_libs/orpc__tanstack-query.mjs";
import "../_libs/tanstack__query-core.mjs";
import "./router-DL5qrXNE.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/zod.mjs";
import "node:buffer";
import "../_libs/orpc__openapi.mjs";
import "../_libs/rou3.mjs";
import "../_libs/orpc__openapi-client.mjs";
import "../_libs/json-schema-typed.mjs";
import "../_libs/orpc__zod.mjs";
import "../_libs/orpc__json-schema.mjs";
import "../_libs/radash.mjs";
import "node:path";
import "node:url";
import "@prisma/client/runtime/client";
import "../_libs/prisma__adapter-pg.mjs";
import "../_libs/prisma__driver-adapter-utils.mjs";
import "../_libs/prisma__debug.mjs";
import "../_libs/pg.mjs";
import "events";
import "../_libs/pg-types.mjs";
import "../_libs/postgres-array.mjs";
import "../_libs/postgres-date.mjs";
import "../_libs/postgres-interval.mjs";
import "../_libs/xtend.mjs";
import "../_libs/postgres-bytea.mjs";
import "../_libs/pg-int8.mjs";
import "dns";
import "../_libs/pg-connection-string.mjs";
import "fs";
import "../_libs/pg-protocol.mjs";
import "net";
import "tls";
import "../_libs/pg-cloudflare.mjs";
import "../_libs/pgpass.mjs";
import "path";
import "../_libs/split2.mjs";
import "string_decoder";
import "../_libs/pg-pool.mjs";
import "../_libs/better-auth__core.mjs";
import "../_libs/better-call.mjs";
import "../_libs/better-auth__utils.mjs";
import "../_libs/better-fetch__fetch.mjs";
import "../_libs/jose.mjs";
import "../_libs/noble__ciphers.mjs";
import "../_libs/noble__hashes.mjs";
import "../_libs/defu.mjs";
import "../_libs/better-auth__kysely-adapter.mjs";
import "../_libs/kysely.mjs";
import "../_libs/better-auth__telemetry.mjs";
import "node:fs";
import "node:fs/promises";
import "node:os";
import "../_libs/better-auth__prisma-adapter.mjs";
import "../_libs/openai.mjs";
import "./server-BubZoQFo.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/srvx.mjs";
function fmt$1(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
const SEVERITY_DOT = {
  info: "text-zinc-400",
  warning: "text-amber-400",
  critical: "text-red-400"
};
const TYPE_ICON = {
  driver_state: Eye,
  road_analysis: Car,
  crash: TriangleAlert
};
function grade(score) {
  if (score >= 90) return { label: "Excellent" };
  if (score >= 75) return { label: "Good" };
  if (score >= 60) return { label: "Fair" };
  return { label: "Needs Work" };
}
function DriverFeedback({ sessionData, onClose, isOpen }) {
  if (!isOpen) return null;
  if (!sessionData || sessionData.events.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4",
        onClick: (e) => e.target === e.currentTarget && onClose(),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-sm rounded-3xl bg-zinc-900 text-white px-6 py-8 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-zinc-400", children: "No event data for this drive." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-zinc-600 mt-1", children: "Record with AI enabled to see a report." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: onClose,
              className: "mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-800 py-3 text-sm font-semibold text-white",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16 }),
                " Close"
              ]
            }
          )
        ] })
      }
    );
  }
  const score = sessionData.score ?? 0;
  const { label } = grade(score);
  const ringColor = score >= 80 ? "#22c55e" : score >= 60 ? "#eab308" : "#ef4444";
  const circumference = 2 * Math.PI * 40;
  const dash = score / 100 * circumference;
  const durationSec = sessionData.endedAt ? Math.round((new Date(sessionData.endedAt).getTime() - new Date(sessionData.startedAt).getTime()) / 1e3) : 0;
  const warnings = sessionData.events.filter((e) => e.severity === "warning");
  const criticals = sessionData.events.filter((e) => e.severity === "critical");
  const frontEvents = sessionData.events.filter((e) => e.camera === "front");
  const backEvents = sessionData.events.filter((e) => e.camera === "back");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4",
      onClick: (e) => e.target === e.currentTarget && onClose(),
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-[78vh] w-full max-w-sm flex-col overflow-hidden rounded-3xl bg-zinc-900 text-white", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-0 flex-1 overflow-y-auto px-6 pt-8 pb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex h-28 w-28 items-center justify-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "absolute inset-0 -rotate-90", viewBox: "0 0 100 100", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "50", cy: "50", r: "40", fill: "none", stroke: "#27272a", strokeWidth: "8" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "circle",
                  {
                    cx: "50",
                    cy: "50",
                    r: "40",
                    fill: "none",
                    stroke: ringColor,
                    strokeWidth: "8",
                    strokeLinecap: "round",
                    strokeDasharray: `${dash} ${circumference}`,
                    style: { transition: "stroke-dasharray 0.6s ease" }
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl font-bold", children: score })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-xl font-semibold", children: label }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-sm text-zinc-400", children: [
              fmt$1(durationSec),
              " drive"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 flex items-center justify-center gap-3", children: sessionData.cameras.map((cam) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 rounded-full bg-zinc-800 px-3 py-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { size: 12, className: "text-zinc-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold capitalize text-zinc-300", children: [
              cam,
              " cam"
            ] })
          ] }, cam)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 grid grid-cols-3 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center rounded-xl bg-zinc-800 py-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-black text-zinc-200", children: sessionData.events.length }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-widest text-zinc-500", children: "Events" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center rounded-xl bg-zinc-800 py-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-black text-amber-400", children: warnings.length }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-widest text-zinc-500", children: "Warnings" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center rounded-xl bg-zinc-800 py-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-black text-red-400", children: criticals.length }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-widest text-zinc-500", children: "Critical" })
            ] })
          ] }),
          sessionData.summary && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-500", children: "AI Summary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-relaxed text-zinc-300", children: sessionData.summary })
          ] }),
          frontEvents.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-500", children: [
              "Front Camera (",
              frontEvents.length,
              ")"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(EventList, { events: frontEvents })
          ] }),
          backEvents.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-500", children: [
              "Back Camera (",
              backEvents.length,
              ")"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(EventList, { events: backEvents })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 px-6 pb-6 pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: onClose,
            className: "flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-800 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16 }),
              " Close"
            ]
          }
        ) })
      ] })
    }
  );
}
function EventList({ events }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: events.map((e) => {
    const Icon = TYPE_ICON[e.type] ?? TriangleAlert;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 rounded-xl bg-zinc-800/60 px-3 py-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 13, className: `mt-0.5 shrink-0 ${SEVERITY_DOT[e.severity] ?? "text-zinc-400"}` }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs leading-relaxed text-zinc-300", children: e.summary }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-0.5 text-[10px] text-zinc-600", children: [
          fmt$1(e.elapsedSec),
          " - ",
          e.type.replace("_", " ")
        ] })
      ] })
    ] }, e.id);
  }) });
}
function fmt(s) {
  const t = Math.floor(s);
  return `${Math.floor(t / 60)}:${(t % 60).toString().padStart(2, "0")}`;
}
function relDate(ts) {
  const diff = Math.floor((Date.now() - ts) / 864e5);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return new Date(ts).toLocaleDateString("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short"
  });
}
function fmtTime(ts) {
  return new Date(ts).toLocaleTimeString("en-AU", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });
}
function scoreColor(score) {
  return score >= 85 ? "#22c55e" : score >= 70 ? "#f59e0b" : "#ef4444";
}
function ReplayPage() {
  const {
    t: refreshKey
  } = useSearch({
    from: "/replay"
  });
  const [drives, setDrives] = reactExports.useState([]);
  const [loadingDrives, setLoadingDrives] = reactExports.useState(true);
  const [selectedIdx, setSelectedIdx] = reactExports.useState(0);
  const [playing, setPlaying] = reactExports.useState(false);
  const [currentTime, setCurrentTime] = reactExports.useState(0);
  const [duration, setDuration] = reactExports.useState(0);
  const [showReport, setShowReport] = reactExports.useState(false);
  const [sessionData, setSessionData] = reactExports.useState(null);
  const [loadingReport, setLoadingReport] = reactExports.useState(false);
  const videoRef = reactExports.useRef(null);
  const trackRef = reactExports.useRef(null);
  const loadDrives = reactExports.useCallback(async () => {
    setLoadingDrives(true);
    try {
      const metas = await listRecordings();
      const entries = await Promise.all(metas.map(async (meta) => {
        const rec = await getRecording(meta.id);
        const url = rec ? URL.createObjectURL(rec.videoBlob) : "";
        return {
          meta,
          url
        };
      }));
      setDrives((prev) => {
        prev.forEach((d) => {
          if (d.url) URL.revokeObjectURL(d.url);
        });
        return entries;
      });
      setSelectedIdx(0);
    } catch (e) {
      console.error("Failed to load recordings", e);
    } finally {
      setLoadingDrives(false);
    }
  }, []);
  reactExports.useEffect(() => {
    loadDrives();
  }, [loadDrives, refreshKey]);
  reactExports.useEffect(() => {
    const onFocus = () => loadDrives();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [loadDrives]);
  reactExports.useEffect(() => {
    setPlaying(false);
    setCurrentTime(0);
    setDuration(drives[selectedIdx]?.meta.duration ?? 0);
  }, [selectedIdx, drives]);
  const getPercent = () => duration > 0 ? currentTime / duration * 100 : 0;
  const scrubTo = reactExports.useCallback((e) => {
    const track = trackRef.current;
    const video = videoRef.current;
    if (!track || !video || !duration) return;
    const rect = track.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    video.currentTime = ratio * duration;
    setCurrentTime(video.currentTime);
  }, [duration]);
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video || !drives[selectedIdx]?.url) return;
    if (playing) {
      video.pause();
      setPlaying(false);
    } else {
      video.play().catch(() => {
      });
      setPlaying(true);
    }
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto w-full max-w-md md:max-w-5xl px-4 md:px-8 pt-10 md:pt-20 pb-32 md:pb-12 flex flex-col gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "mb-2 shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground", children: "DashCam" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 text-2xl font-semibold", children: "Replay" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:grid md:grid-cols-[3fr_2fr] md:gap-6 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full overflow-hidden rounded-2xl bg-card border border-border", style: {
            aspectRatio: "16/9"
          }, children: [
            selected?.url ? /* @__PURE__ */ jsxRuntimeExports.jsx("video", { ref: videoRef, src: selected.url, className: "absolute inset-0 h-full w-full object-cover", playsInline: true, onLoadedMetadata: () => setDuration(videoRef.current?.duration ?? selected.meta.duration), onTimeUpdate: () => setCurrentTime(videoRef.current?.currentTime ?? 0), onEnded: () => setPlaying(false) }, selected.meta.id) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: loadingDrives ? "Loading…" : "No recordings yet" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: togglePlay, className: "absolute bottom-3 left-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm", children: playing ? /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { size: 18, fill: "white", color: "white" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { size: 18, fill: "white", color: "white" }) }),
            selected?.url && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleDownload, className: "absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm", title: "Download recording", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 16, color: "white" }) }),
            selected && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-3 right-3 rounded-full px-3 py-1 text-sm font-black backdrop-blur-sm", style: {
              color,
              backgroundColor: "rgba(0,0,0,0.5)"
            }, children: selected.meta.score })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: trackRef, className: "relative h-5 cursor-pointer flex items-center", onClick: scrubTo, onMouseMove: (e) => e.buttons === 1 && scrubTo(e), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-0 h-1 rounded-full bg-muted" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-0 h-1 rounded-full bg-primary", style: {
                width: `${getPercent()}%`
              } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute h-4 w-4 -translate-x-1/2 rounded-full bg-zinc-400 shadow", style: {
                left: `${getPercent()}%`
              } })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex justify-between text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: fmt(currentTime) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: fmt(duration) })
            ] })
          ] }),
          selected && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 12, className: "text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold", children: fmt(selected.meta.duration) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 12, className: "text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold", style: {
                color
              }, children: [
                "Score ",
                selected.meta.score
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: async () => {
            const meta = selected?.meta;
            if (!meta) return;
            const sid = meta.sessionId;
            if (sid) {
              setLoadingReport(true);
              try {
                const data = await client.getSession({
                  sessionId: sid
                });
                setSessionData({
                  id: data.id,
                  score: data.score,
                  summary: data.summary,
                  cameras: data.cameras,
                  startedAt: data.startedAt.toISOString ? data.startedAt.toISOString() : String(data.startedAt),
                  endedAt: data.endedAt ? data.endedAt.toISOString ? data.endedAt.toISOString() : String(data.endedAt) : null,
                  events: data.events.map((e) => ({
                    id: e.id,
                    type: e.type,
                    camera: e.camera,
                    elapsedSec: e.elapsedSec,
                    summary: e.summary,
                    severity: e.severity,
                    metadata: e.metadata
                  }))
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
          }, disabled: !selected || loadingReport, className: "flex w-full items-center justify-center gap-2 rounded-2xl bg-card border border-border py-3 text-sm font-semibold text-foreground transition hover:bg-secondary disabled:opacity-40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChartNoAxesColumn, { size: 16 }),
            loadingReport ? "Loading..." : "View Drive Report"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-card border border-border overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-5 pt-4 pb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground border-b border-border", children: "Recent drives" }),
          loadingDrives ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-8 text-center text-sm text-muted-foreground", children: "Loading…" }) : drives.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-8 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No drives recorded yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/60 mt-1", children: "Record a drive to see it here" })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col divide-y divide-border", children: drives.map((d, i) => {
            const c = scoreColor(d.meta.score);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setSelectedIdx(i), className: "flex items-center justify-between px-5 py-3 text-left transition hover:bg-secondary/50", style: selectedIdx === i ? {
              backgroundColor: "rgba(234,179,8,0.06)"
            } : {}, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", children: relDate(d.meta.timestamp) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                  fmtTime(d.meta.timestamp),
                  " · ",
                  fmt(d.meta.duration)
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base font-black", style: {
                  color: c
                }, children: d.meta.score }),
                selectedIdx === i && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-1.5 rounded-full", style: {
                  backgroundColor: "var(--primary)"
                } })
              ] })
            ] }, d.meta.id);
          }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DriverFeedback, { isOpen: showReport, sessionData, onClose: () => {
      setShowReport(false);
      setSessionData(null);
    } })
  ] });
}
export {
  ReplayPage as component
};
