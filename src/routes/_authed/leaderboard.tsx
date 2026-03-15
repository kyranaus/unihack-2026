// src/routes/_authed/leaderboard.tsx
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { client } from "#/server/orpc/client";
import { Trophy, Medal } from "lucide-react";

export const Route = createFileRoute("/_authed/leaderboard")({ component: LeaderboardPage });

function scoreColor(score: number): string {
  return score >= 85 ? "#22c55e" : score >= 70 ? "#f59e0b" : "#ef4444";
}

const RANK_STYLES = [
  { label: "1st", color: "#facc15", bg: "rgba(250,204,21,0.1)", border: "rgba(250,204,21,0.3)" },
  { label: "2nd", color: "#94a3b8", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.3)" },
  { label: "3rd", color: "#cd7c2f", bg: "rgba(205,124,47,0.1)", border: "rgba(205,124,47,0.3)" },
];

function LeaderboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: () => client.getLeaderboard({}),
    refetchOnWindowFocus: true,
  });

  const entries = data?.entries ?? [];
  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  return (
    <main className="min-h-0 bg-background text-foreground">
      <div className="mx-auto w-full max-w-3xl px-8 pt-4 pb-32 md:pb-12 flex flex-col gap-4">

        <header className="mb-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">BeeSafe</p>
          <h1 className="mt-1 text-2xl font-semibold flex items-center gap-2">
            <Trophy size={22} style={{ color: "var(--dashcam-yellow)" }} />
            Leaderboard
          </h1>
          <p className="text-xs text-muted-foreground mt-1">Average score across all drives longer than 30 seconds</p>
        </header>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-primary" />
          </div>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <Trophy size={40} className="text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">No drives yet</p>
            <p className="text-xs text-muted-foreground/60">Complete a drive longer than 30 seconds to appear here</p>
          </div>
        ) : (
          <>
            {/* Top 3 podium */}
            {top3.length > 0 && (
              <div className="flex flex-col gap-3">
                {top3.map((entry, i) => {
                  const style = RANK_STYLES[i];
                  return (
                    <div
                      key={entry.userId}
                      className="flex items-center gap-4 rounded-2xl border px-5 py-4"
                      style={{ backgroundColor: style.bg, borderColor: style.border }}
                    >
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-black"
                        style={{ color: style.color, backgroundColor: `${style.border}` }}
                      >
                        {i === 0 ? <Trophy size={18} /> : <Medal size={18} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">{entry.name}</p>
                        <p className="text-xs text-muted-foreground">{entry.totalDrives} drive{entry.totalDrives !== 1 ? "s" : ""} · {style.label}</p>
                      </div>
                      <span className="text-2xl font-black" style={{ color: scoreColor(entry.avgScore) }}>
                        {entry.avgScore}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 4th place onwards */}
            {rest.length > 0 && (
              <div className="rounded-2xl bg-card border border-border overflow-hidden">
                <p className="px-5 pt-4 pb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Rankings
                </p>
                <div className="flex flex-col divide-y divide-border">
                  {rest.map((entry, i) => (
                    <div key={entry.userId} className="flex items-center gap-4 px-5 py-3">
                      <span className="w-6 text-center text-xs font-bold text-muted-foreground">{i + 4}</span>
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                        {entry.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{entry.name}</p>
                        <p className="text-xs text-muted-foreground">{entry.totalDrives} drive{entry.totalDrives !== 1 ? "s" : ""}</p>
                      </div>
                      <span className="text-base font-black" style={{ color: scoreColor(entry.avgScore) }}>
                        {entry.avgScore}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
