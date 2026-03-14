// src/components/DriverFeedback.tsx
import { useState } from "react";
import { X, Camera, Eye, AlertTriangle, Car, ChevronDown, ChevronUp } from "lucide-react";

export type SessionEvent = {
  id: string;
  type: string;
  camera: string;
  elapsedSec: number;
  summary: string;
  severity: string;
  metadata: unknown;
};

export type SessionData = {
  id: string;
  score: number | null;
  summary: string | null;
  cameras: string[];
  startedAt: string;
  endedAt: string | null;
  events: SessionEvent[];
};

type Props = {
  sessionData?: SessionData | null;
  onClose: () => void;
  isOpen: boolean;
};

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const SEVERITY_DOT: Record<string, string> = {
  info: "text-zinc-400",
  warning: "text-amber-400",
  critical: "text-red-400",
};

const TYPE_ICON: Record<string, typeof Eye> = {
  driver_state: Eye,
  road_analysis: Car,
  crash: AlertTriangle,
};

function grade(score: number): { label: string } {
  if (score >= 90) return { label: "Excellent" };
  if (score >= 75) return { label: "Good" };
  if (score >= 60) return { label: "Fair" };
  return { label: "Needs Work" };
}

function parseSummaryPoints(summary: string): { text: string; isGood: boolean }[] {
  return summary
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("+") || l.startsWith("-"))
    .slice(0, 6)
    .map((l) => ({
      text: l.slice(1).trim(),
      isGood: l.startsWith("+"),
    }));
}

export function DriverFeedback({ sessionData, onClose, isOpen }: Props) {
  if (!isOpen) return null;

  if (!sessionData || sessionData.events.length === 0) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="w-full max-w-sm rounded-3xl bg-zinc-900 text-white px-6 py-8 text-center">
          <p className="text-sm text-zinc-400">No event data for this drive.</p>
          <p className="text-xs text-zinc-600 mt-1">Record with AI enabled to see a report.</p>
          <button
            onClick={onClose}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-800 py-3 text-sm font-semibold text-white"
          >
            <X size={16} /> Close
          </button>
        </div>
      </div>
    );
  }

  const score = sessionData.score ?? 0;
  const { label } = grade(score);
  const ringColor = score >= 80 ? "#22c55e" : score >= 60 ? "#eab308" : "#ef4444";
  const circumference = 2 * Math.PI * 40;
  const dash = (score / 100) * circumference;

  const durationSec = sessionData.endedAt
    ? Math.round((new Date(sessionData.endedAt).getTime() - new Date(sessionData.startedAt).getTime()) / 1000)
    : 0;

  const warnings = sessionData.events.filter((e) => e.severity === "warning");
  const criticals = sessionData.events.filter((e) => e.severity === "critical");
  const frontEvents = sessionData.events.filter((e) => e.camera === "front");
  const backEvents = sessionData.events.filter((e) => e.camera === "back");

  const summaryPoints = sessionData.summary ? parseSummaryPoints(sessionData.summary) : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="flex h-[78vh] w-full max-w-sm flex-col overflow-hidden rounded-3xl bg-zinc-900 text-white">
        <div className="min-h-0 flex-1 overflow-y-auto px-6 pt-8 pb-4">
          {/* Score circle */}
          <div className="flex flex-col items-center">
            <div className="relative flex h-28 w-28 items-center justify-center">
              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#27272a" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="40" fill="none" stroke={ringColor} strokeWidth="8"
                  strokeLinecap="round" strokeDasharray={`${dash} ${circumference}`}
                  style={{ transition: "stroke-dasharray 0.6s ease" }}
                />
              </svg>
              <span className="text-3xl font-bold">{score}</span>
            </div>
            <p className="mt-3 text-xl font-semibold">{label}</p>
            <p className="mt-1 text-sm text-zinc-400">{fmt(durationSec)} drive</p>
          </div>

          {/* Cameras active */}
          <div className="mt-5 flex items-center justify-center gap-3">
            {sessionData.cameras.map((cam) => (
              <div key={cam} className="flex items-center gap-1.5 rounded-full bg-zinc-800 px-3 py-1.5">
                <Camera size={12} className="text-zinc-400" />
                <span className="text-xs font-semibold capitalize text-zinc-300">{cam} cam</span>
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div className="mt-5 grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center rounded-xl bg-zinc-800 py-3">
              <span className="text-lg font-black text-zinc-200">{sessionData.events.length}</span>
              <span className="text-[10px] uppercase tracking-widest text-zinc-500">Events</span>
            </div>
            <div className="flex flex-col items-center rounded-xl bg-zinc-800 py-3">
              <span className="text-lg font-black text-amber-400">{warnings.length}</span>
              <span className="text-[10px] uppercase tracking-widest text-zinc-500">Warnings</span>
            </div>
            <div className="flex flex-col items-center rounded-xl bg-zinc-800 py-3">
              <span className="text-lg font-black text-red-400">{criticals.length}</span>
              <span className="text-[10px] uppercase tracking-widest text-zinc-500">Critical</span>
            </div>
          </div>

          {/* AI Summary — 2-4 bullet points */}
          {summaryPoints.length > 0 && (
            <div className="mt-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">AI Summary</p>
              <ul className="space-y-1.5">
                {summaryPoints.map(({ text, isGood }, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm leading-snug">
                    <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${isGood ? "bg-green-400" : "bg-red-400"}`} />
                    <span className={isGood ? "text-green-300" : "text-red-300"}>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Front camera logs */}
          {frontEvents.length > 0 && (
            <CollapsibleLogs title="Front Camera" events={frontEvents} />
          )}

          {/* Back camera logs */}
          {backEvents.length > 0 && (
            <CollapsibleLogs title="Back Camera" events={backEvents} />
          )}
        </div>

        <div className="shrink-0 px-6 pb-6 pt-2">
          <button
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-800 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700"
          >
            <X size={16} /> Close
          </button>
        </div>
      </div>
    </div>
  );
}

function CollapsibleLogs({ title, events }: { title: string; events: SessionEvent[] }) {
  const [expanded, setExpanded] = useState(false);
  const major = events.filter((e) => e.severity === "critical" || e.severity === "warning");
  const shown = expanded ? events : major.slice(0, 3);

  return (
    <div className="mt-5">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="mb-2 flex w-full items-center justify-between"
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
          {title} ({events.length})
        </p>
        {expanded ? <ChevronUp size={14} className="text-zinc-500" /> : <ChevronDown size={14} className="text-zinc-500" />}
      </button>
      {shown.length === 0 ? (
        <p className="text-xs text-zinc-600">No major events.</p>
      ) : (
        <div className="space-y-1.5">
          {shown.map((e) => {
            const Icon = TYPE_ICON[e.type] ?? AlertTriangle;
            return (
              <div key={e.id} className="flex items-start gap-2 rounded-xl bg-zinc-800/60 px-3 py-2">
                <Icon size={13} className={`mt-0.5 shrink-0 ${SEVERITY_DOT[e.severity] ?? "text-zinc-400"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs leading-relaxed text-zinc-300">{e.summary}</p>
                  <p className="mt-0.5 text-[10px] text-zinc-600">{fmt(e.elapsedSec)} · {e.type.replace("_", " ")}</p>
                </div>
              </div>
            );
          })}
          {!expanded && major.length > 3 && (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="w-full text-center text-[10px] text-zinc-500 py-1 hover:text-zinc-300"
            >
              +{major.length - 3} more major events — tap to expand
            </button>
          )}
          {!expanded && major.length === 0 && (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="w-full text-center text-[10px] text-zinc-500 py-1 hover:text-zinc-300"
            >
              No major events — tap to see all {events.length}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
