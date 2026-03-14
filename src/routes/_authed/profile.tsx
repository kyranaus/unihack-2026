// src/routes/_authed/profile.tsx
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Moon, Sun, TrendingUp, TrendingDown, LogOut } from "lucide-react";
import { authClient } from "#/lib/auth-client";
import { client } from "#/server/orpc/client";
import { useQuery } from "@tanstack/react-query";
import { DriverFeedback } from "#/components/DriverFeedback";
import type { SessionData } from "#/components/DriverFeedback";

export const Route = createFileRoute("/_authed/profile")({ component: ProfilePage });

function relDate(ts: Date | string): string {
  const date = typeof ts === "string" ? new Date(ts) : ts;
  const diff = Math.floor((Date.now() - date.getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return date.toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short" });
}

function fmtTime(ts: Date | string): string {
  const date = typeof ts === "string" ? new Date(ts) : ts;
  return date.toLocaleTimeString("en-AU", { hour: "numeric", minute: "2-digit", hour12: true });
}

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function scoreColor(score: number): string {
  return score >= 85 ? "#22c55e" : score >= 70 ? "#f59e0b" : "#ef4444";
}

function ScoreArc({ score }: { score: number }) {
  const r = 40;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <svg viewBox="0 0 100 100" className="w-28 h-28 -rotate-90">
      <circle cx="50" cy="50" r={r} fill="none" stroke="currentColor" strokeWidth="8"
        className="text-muted/40" />
      <circle cx="50" cy="50" r={r} fill="none" stroke="var(--primary)" strokeWidth="8"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
    </svg>
  );
}

function ProfilePage() {
  const navigate = useNavigate();
  const { user } = Route.useRouteContext();
  const [light, setLight] = useState(() =>
    document.documentElement.classList.contains("light")
  );
  const [showReport, setShowReport] = useState(false);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);

  const { data: profileStats, isLoading: loadingStats } = useQuery({
    queryKey: ["profileStats"],
    queryFn: () => client.getProfileStats({}),
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    const html = document.documentElement;
    if (light) {
      html.classList.add("light");
      html.classList.remove("dark");
    } else {
      html.classList.remove("light");
      html.classList.add("dark");
    }
  }, [light]);

  if (isPending) return null;

  if (!session?.user) {
    navigate({ to: "/login" });
    return null;
  }

  const USERNAME = session.user.name || "Driver";
  const DRIVER_SCORE = profileStats?.avgScore ?? 0;
  const SCORE_TREND = profileStats?.scoreTrend ?? 0;
  
  const STATS = [
    { label: "Drives", value: String(profileStats?.totalDrives ?? 0) },
    { label: "Hours", value: String(profileStats?.totalHours ?? 0) },
    { label: "Km", value: "—" },
  ];

  const handleSignOut = async () => {
    await authClient.signOut();
    navigate({ to: "/login" });
  };

  const handleDriveClick = async (sessionId: string) => {
    setLoadingReport(true);
    try {
      const data = await client.getSession({ sessionId });
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
      setShowReport(true);
    } catch (err) {
      console.error("Failed to fetch session:", err);
      setSessionData(null);
    } finally {
      setLoadingReport(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-md md:max-w-5xl px-4 md:px-8 pt-10 md:pt-20 pb-32 md:pb-12 flex flex-col gap-4">

        <header className="mb-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            BeeSafe
          </p>
          <h1 className="mt-1 text-2xl font-semibold">Profile</h1>
        </header>

        {/* ── Desktop: 2-col grid / Mobile: single col ── */}
        <div className="flex flex-col md:grid md:grid-cols-2 md:gap-6 gap-4">

          {/* ── Left column ── */}
          <div className="flex flex-col gap-4">

            {/* User card */}
            <div className="flex items-center gap-4 rounded-2xl bg-card border border-border px-5 py-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                {USERNAME.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold truncate">{USERNAME}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Learner driver · Joined Jan 2026</p>
              </div>
              <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                L
              </span>
            </div>

            {/* Driver score card */}
            <div className="rounded-2xl bg-card border border-border px-5 py-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">
                Driver score
              </p>
              {loadingStats ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-primary" />
                </div>
              ) : (
                <div className="flex items-center gap-5">
                  <div className="relative flex items-center justify-center">
                    <ScoreArc score={DRIVER_SCORE} />
                    <span className="absolute text-2xl font-black">{DRIVER_SCORE}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold text-foreground">
                      {DRIVER_SCORE >= 90 ? "Excellent driver" : DRIVER_SCORE >= 75 ? "Good driver" : DRIVER_SCORE >= 60 ? "Fair driver" : "Needs improvement"}
                    </p>
                    {SCORE_TREND !== 0 && (
                      <div className={`flex items-center gap-1 text-xs font-semibold ${SCORE_TREND > 0 ? "text-green-400" : "text-red-400"}`}>
                        {SCORE_TREND > 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                        {SCORE_TREND > 0 ? "+" : ""}{SCORE_TREND} pts recent trend
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {DRIVER_SCORE >= 90 ? "Keep up the great work!" : "Stay alert and drive safely to improve"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              {STATS.map((s) => (
                <div key={s.label} className="flex flex-col items-center justify-center rounded-2xl bg-card border border-border py-4 gap-1">
                  <span className="text-xl font-black text-primary">{s.value}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{s.label}</span>
                </div>
              ))}
            </div>

          </div>

          {/* ── Right column ── */}
          <div className="flex flex-col gap-4">

            {/* Recent drives */}
            <div className="rounded-2xl bg-card border border-border overflow-hidden">
              <p className="px-5 pt-4 pb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Recent drives
              </p>
              {loadingStats ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-primary" />
                </div>
              ) : !profileStats?.recentDrives.length ? (
                <div className="py-8 text-center">
                  <p className="text-sm text-muted-foreground">No drives yet</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">Start recording to see your history</p>
                </div>
              ) : (
                <div className="max-h-[320px] overflow-y-auto">
                  <div className="flex flex-col divide-y divide-border">
                    {profileStats.recentDrives.map((d) => {
                      const color = scoreColor(d.score);
                      return (
                        <button
                          key={d.id}
                          onClick={() => handleDriveClick(d.id)}
                          disabled={loadingReport}
                          className="flex items-center justify-between px-5 py-3 text-left transition hover:bg-secondary/50 disabled:opacity-50 w-full cursor-pointer"
                        >
                          <div>
                            <p className="text-sm font-semibold">{relDate(d.startedAt)}</p>
                            <p className="text-xs text-muted-foreground">{fmtTime(d.startedAt)} · {fmt(d.duration)}</p>
                          </div>
                          <span className="text-base font-black" style={{ color }}>
                            {d.score}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Theme toggle */}
            <div className="flex items-center justify-between rounded-2xl bg-card border border-border px-5 py-4">
              <div className="flex items-center gap-3">
                {light ? (
                  <Sun size={20} className="text-primary" />
                ) : (
                  <Moon size={20} className="text-primary" />
                )}
                <div>
                  <p className="text-sm font-semibold">
                    {light ? "Light mode" : "Dark mode"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {light ? "White · Yellow accent" : "Black · Yellow accent"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setLight((v) => !v)}
                className="relative h-7 w-12 overflow-hidden rounded-full transition-colors duration-300"
                style={{ backgroundColor: light ? "var(--primary)" : "#3f3f46" }}
                aria-label="Toggle theme"
              >
                <span
                  className="absolute left-0 top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform duration-300"
                  style={{ transform: light ? "translateX(22px)" : "translateX(2px)" }}
                />
              </button>
            </div>

          </div>
        </div>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/30 bg-card px-5 py-4 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10 active:scale-[0.98]"
        >
          <LogOut size={16} />
          Sign out
        </button>

        <p className="text-center text-[10px] text-muted-foreground/50 mt-2">
          BeeSafe v0.1.0 · Built at UniHack 2026
        </p>

      </div>

      <DriverFeedback
        isOpen={showReport}
        sessionData={sessionData}
        onClose={() => { setShowReport(false); setSessionData(null); }}
      />
    </main>
  );
}
