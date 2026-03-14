import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useFrameCapture, d as driveSessionStore } from "./useDriveSession-DLVe633O.mjs";
import { c as client } from "./client-Bs9qvbFn.mjs";
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
import "../_libs/tanstack__store.mjs";
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
import "../_libs/lucide-react.mjs";
import "../_libs/openai.mjs";
import "./server-BubZoQFo.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/srvx.mjs";
function useBackCamera() {
  const videoRef = reactExports.useRef(null);
  const streamRef = reactExports.useRef(null);
  const [status, setStatus] = reactExports.useState("idle");
  const [error, setError] = reactExports.useState(null);
  const startCamera = reactExports.useCallback(async () => {
    setStatus("requesting");
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStatus("active");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Camera access denied";
      setError(message);
      setStatus("error");
    }
  }, []);
  const stopCamera = reactExports.useCallback(() => {
    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) {
        track.stop();
      }
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStatus("idle");
  }, []);
  reactExports.useEffect(() => {
    return () => {
      if (streamRef.current) {
        for (const track of streamRef.current.getTracks()) {
          track.stop();
        }
      }
    };
  }, []);
  return { videoRef, status, error, startCamera, stopCamera };
}
const SEVERITY_STYLES = {
  info: "border-zinc-700 bg-zinc-900/80 text-zinc-300",
  warning: "border-amber-800/60 bg-amber-950/60 text-amber-200",
  critical: "border-red-800/60 bg-red-950/60 text-red-200"
};
function EventLog({ events }) {
  const scrollRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);
  if (events.length === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-0 bottom-[96px] px-3 pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      ref: scrollRef,
      className: "flex max-h-[180px] flex-col gap-1.5 overflow-y-auto scrollbar-none",
      children: events.map((event) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `flex items-start gap-2 rounded-xl border px-3 py-2 backdrop-blur-sm ${SEVERITY_STYLES[event.severity]}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-0.5 shrink-0 font-mono text-[10px] text-zinc-500", children: event.time }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs leading-relaxed", children: event.analysing ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-pulse text-zinc-500", children: "Analysing road..." }) : event.summary })
          ]
        },
        event.id
      ))
    }
  ) });
}
function BackCamView() {
  const { videoRef, status, error, startCamera, stopCamera } = useBackCamera();
  const [isRecording, setIsRecording] = reactExports.useState(false);
  const [elapsed, setElapsed] = reactExports.useState(0);
  const [events, setEvents] = reactExports.useState([]);
  const [driveSummary, setDriveSummary] = reactExports.useState(null);
  const [ending, setEnding] = reactExports.useState(false);
  const sessionIdRef = reactExports.useRef(null);
  const elapsedRef = reactExports.useRef(0);
  reactExports.useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);
  reactExports.useEffect(() => {
    if (!isRecording) return;
    const interval = setInterval(() => {
      setElapsed((s) => {
        elapsedRef.current = s + 1;
        return s + 1;
      });
    }, 1e3);
    return () => clearInterval(interval);
  }, [isRecording]);
  const handleBatchReady = reactExports.useCallback(async (frames) => {
    const sessionId = sessionIdRef.current;
    if (!sessionId) return;
    const tempId = `pending-${Date.now()}`;
    const time = formatTime(elapsedRef.current);
    setEvents((prev) => [
      ...prev.slice(-9),
      { id: tempId, time, summary: "", severity: "info", analysing: true }
    ]);
    try {
      const result = await client.analyseRoadFrames({
        sessionId,
        elapsedSec: elapsedRef.current,
        frames,
        camera: "back"
      });
      setEvents(
        (prev) => prev.map(
          (e) => e.id === tempId ? { ...e, id: result.id, summary: result.summary, severity: result.severity, analysing: false } : e
        )
      );
    } catch (err) {
      console.error("Frame analysis failed:", err);
      setEvents(
        (prev) => prev.map(
          (e) => e.id === tempId ? { ...e, summary: "Analysis unavailable", analysing: false } : e
        )
      );
    }
  }, []);
  useFrameCapture(videoRef, isRecording, handleBatchReady);
  const startRecording = async () => {
    try {
      const { sessionId } = await client.startSession({});
      sessionIdRef.current = sessionId;
      driveSessionStore.setState(() => ({ sessionId, startedAt: Date.now() }));
      setEvents([]);
      setDriveSummary(null);
      setElapsed(0);
      elapsedRef.current = 0;
      setIsRecording(true);
    } catch (err) {
      console.error("Failed to start session:", err);
    }
  };
  const stopRecording = async () => {
    setIsRecording(false);
    const sessionId = sessionIdRef.current;
    if (!sessionId) return;
    setEnding(true);
    try {
      const { summary } = await client.endSession({ sessionId });
      setDriveSummary(summary);
    } catch (err) {
      console.error("Failed to end session:", err);
    } finally {
      setEnding(false);
      sessionIdRef.current = null;
      driveSessionStore.setState(() => ({ sessionId: null, startedAt: null }));
    }
  };
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex h-full w-full flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 overflow-hidden bg-zinc-950", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "video",
        {
          ref: videoRef,
          autoPlay: true,
          playsInline: true,
          muted: true,
          className: "h-full w-full object-cover"
        }
      ),
      status === "requesting" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-black/80", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-2 border-zinc-600 border-t-white" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-zinc-400", children: "Accessing camera..." })
      ] }) }),
      status === "error" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-black/80", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3 px-8 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "h-6 w-6 text-red-400", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "10" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M15 9L9 15M9 9L15 15", strokeLinecap: "round" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-zinc-300", children: "Camera unavailable" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-zinc-500", children: error }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => startCamera(),
            className: "mt-2 rounded-lg bg-zinc-800 px-4 py-2 text-xs font-medium text-zinc-200",
            children: "Retry"
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent px-4 pb-8 pt-[max(1rem,env(safe-area-inset-top))]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-2 w-2 rounded-full ${isRecording ? "animate-pulse bg-red-500" : "bg-zinc-500"}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium uppercase tracking-[0.16em] text-zinc-300", children: isRecording ? "Recording" : "Road Cam" })
        ] }),
        isRecording && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm font-semibold text-white", children: formatTime(elapsed) })
      ] })
    ] }),
    isRecording && /* @__PURE__ */ jsxRuntimeExports.jsx(EventLog, { events }),
    driveSummary && !isRecording && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-x-4 top-20 z-20 rounded-2xl border border-zinc-700 bg-zinc-900/95 p-4 backdrop-blur-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-500", children: "Drive Summary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-relaxed text-zinc-200", children: driveSummary }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setDriveSummary(null),
          className: "mt-3 w-full rounded-lg bg-zinc-800 py-2 text-xs font-medium text-zinc-300",
          children: "Dismiss"
        }
      )
    ] }),
    ending && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 z-20 flex items-center justify-center bg-black/80", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-2 border-zinc-600 border-t-white" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-zinc-400", children: "Generating drive summary..." })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center bg-black px-4 py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: toggleRecording,
        disabled: status !== "active" || ending,
        className: "group relative flex h-[72px] w-[72px] items-center justify-center rounded-full border-[3px] border-zinc-600 transition-all disabled:opacity-40",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `block transition-all ${isRecording ? "h-6 w-6 rounded-md bg-red-500" : "h-14 w-14 rounded-full bg-red-500 group-hover:scale-95"}`
          }
        )
      }
    ) })
  ] });
}
function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
function RecordPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "fixed inset-0 z-50 flex flex-col bg-black text-white", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-3 top-4 z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-zinc-300 backdrop-blur-sm no-underline", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "h-5 w-5", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M15 19l-7-7 7-7" }) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BackCamView, {})
  ] });
}
export {
  RecordPage as component
};
