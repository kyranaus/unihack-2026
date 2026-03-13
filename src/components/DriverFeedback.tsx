// src/components/DriverFeedback.tsx
import { X } from "lucide-react";
import type { DriveReport } from "#/types/drive";

const MOCK_REPORT: DriveReport = {
  durationMinutes: 42,
  focusStreakMinutes: 14,
  events: {
    eyesClosed:         { count: 3,  totalSecs: 8,  longestSecs: 4  },
    eyesOffRoad:        { count: 5,  totalSecs: 12 },
    phoneUse:           { count: 1,  totalSecs: 20 },
    yawning:            { count: 2 },
    tailgating:         { count: 2,  totalSecs: 30 },
    speeding:           { count: 1,  peakKmhOver: 15, totalSecs: 45 },
    harshBraking:       { count: 2,  maxG: 0.4 },
    harshAcceleration:  { count: 0,  maxG: 0   },
    harshTakeoff:       { count: 1,  maxG: 0.3 },
    smoothBraking:      { count: 8  },
    smoothAcceleration: { count: 5  },
    smoothTakeoff:      { count: 6  },
  },
};

function calcScore(report: DriveReport): number {
  const { events, focusStreakMinutes } = report;
  let score = 100;

  // Negatives
  const closedOver = Math.max(0, events.eyesClosed.totalSecs - 2);
  score -= closedOver * 2;

  const offRoadOver = Math.max(0, events.eyesOffRoad.totalSecs - 3);
  score -= offRoadOver * 1;

  score -= events.phoneUse.count * 15;
  score -= events.yawning.count * 3;
  score -= events.tailgating.totalSecs * 1;
  score -= Math.min(20, events.speeding.peakKmhOver * events.speeding.totalSecs * 0.05);
  score -= events.harshBraking.count * 5;
  score -= events.harshAcceleration.count * 3;
  score -= events.harshTakeoff.count * 4;

  // Positives
  score += Math.min(10, events.smoothBraking.count * 2);
  score += Math.min(5,  events.smoothAcceleration.count * 1);
  score += Math.min(10, events.smoothTakeoff.count * 2);

  if (focusStreakMinutes > 20) score += 10;
  else if (focusStreakMinutes > 10) score += 5;

  if (events.phoneUse.count === 0) score += 5;

  const totalHarsh =
    events.harshBraking.count +
    events.harshAcceleration.count +
    events.harshTakeoff.count;
  if (totalHarsh === 0) score += 5;

  return Math.max(0, Math.min(100, Math.round(score)));
}

function grade(score: number): { label: string; emoji: string } {
  if (score >= 90) return { label: "Excellent", emoji: "🏆" };
  if (score >= 75) return { label: "Good",      emoji: "✅" };
  if (score >= 60) return { label: "Fair",      emoji: "⚠️" };
  return                  { label: "Needs Work", emoji: "❌" };
}

type Props = {
  report?: DriveReport;
  onClose: () => void;
  isOpen: boolean;
};

export function DriverFeedback({ report = MOCK_REPORT, onClose, isOpen }: Props) {
  if (!isOpen) return null;

  const score = calcScore(report);
  const { label, emoji } = grade(score);
  const { events, durationMinutes, focusStreakMinutes } = report;

  const ringColor =
    score >= 80 ? "#22c55e" : score >= 60 ? "#eab308" : "#ef4444";

  const circumference = 2 * Math.PI * 40;
  const dash = (score / 100) * circumference;

  // Negatives — only shown if count > 0
  const negatives: { text: string }[] = [];
  if (events.eyesClosed.count > 0)
    negatives.push({
      text: `Eyes closed ${events.eyesClosed.count}× (${events.eyesClosed.totalSecs}s total, longest ${events.eyesClosed.longestSecs}s)`,
    });
  if (events.eyesOffRoad.count > 0)
    negatives.push({
      text: `Eyes off road ${events.eyesOffRoad.count}× (${events.eyesOffRoad.totalSecs}s total)`,
    });
  if (events.phoneUse.count > 0)
    negatives.push({
      text: `Phone use ${events.phoneUse.count}× (${events.phoneUse.totalSecs}s)`,
    });
  if (events.yawning.count > 0)
    negatives.push({ text: `Yawning detected ${events.yawning.count}×` });
  if (events.tailgating.count > 0)
    negatives.push({
      text: `Tailgating ${events.tailgating.count}× (${events.tailgating.totalSecs}s total)`,
    });
  if (events.speeding.count > 0)
    negatives.push({
      text: `Speeding ${events.speeding.count}× — peak +${events.speeding.peakKmhOver} km/h over limit`,
    });
  if (events.harshBraking.count > 0)
    negatives.push({
      text: `Harsh braking ${events.harshBraking.count}× (max ${events.harshBraking.maxG}g)`,
    });
  if (events.harshAcceleration.count > 0)
    negatives.push({
      text: `Harsh acceleration ${events.harshAcceleration.count}× (max ${events.harshAcceleration.maxG}g)`,
    });
  if (events.harshTakeoff.count > 0)
    negatives.push({
      text: `Harsh takeoff ${events.harshTakeoff.count}× (max ${events.harshTakeoff.maxG}g)`,
    });

  // Positives — only shown if earned
  const positives: { text: string }[] = [];
  if (events.smoothBraking.count > 0)
    positives.push({ text: `Smooth braking ${events.smoothBraking.count}×` });
  if (events.smoothAcceleration.count > 0)
    positives.push({ text: `Smooth acceleration ${events.smoothAcceleration.count}×` });
  if (events.smoothTakeoff.count > 0)
    positives.push({ text: `Smooth takeoff ${events.smoothTakeoff.count}×` });
  if (focusStreakMinutes > 10)
    positives.push({ text: `Focus streak: ${focusStreakMinutes} min uninterrupted` });
  if (events.phoneUse.count === 0)
    positives.push({ text: "No phone use during drive" });
  const totalHarsh =
    events.harshBraking.count + events.harshAcceleration.count + events.harshTakeoff.count;
  if (totalHarsh === 0)
    positives.push({ text: "Zero harsh driving events" });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="flex h-[72vh] w-full max-w-sm flex-col overflow-hidden rounded-3xl bg-zinc-900 text-white">
        {/* Scrollable body */}
        <div className="min-h-0 flex-1 overflow-y-auto px-6 pt-8 pb-4">
          {/* Score circle */}
          <div className="flex flex-col items-center">
            <div className="relative flex h-28 w-28 items-center justify-center">
              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#27272a" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="40"
                  fill="none"
                  stroke={ringColor}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${dash} ${circumference}`}
                  style={{ transition: "stroke-dasharray 0.6s ease" }}
                />
              </svg>
              <span className="text-3xl font-bold">{score}</span>
            </div>
            <p className="mt-3 text-xl font-semibold">
              {emoji} {label}
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              {durationMinutes} min drive
            </p>
          </div>

          {/* Positives */}
          {positives.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">
                Well done
              </p>
              <ul className="space-y-2">
                {positives.map((p) => (
                  <li key={p.text} className="flex gap-2 text-sm text-zinc-300">
                    <span className="mt-0.5 text-green-400">•</span>
                    {p.text}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Negatives — top 3 */}
          {negatives.length > 0 && (
            <div className="mt-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">
                Areas to improve
              </p>
              <ul className="space-y-2">
                {negatives.slice(0, 3).map((n) => (
                  <li key={n.text} className="flex gap-2 text-sm text-zinc-300">
                    <span className="mt-0.5 text-red-400">•</span>
                    {n.text}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Close button */}
        <div className="shrink-0 px-6 pb-6 pt-2">
          <button
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-800 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700"
          >
            <X size={16} />
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
