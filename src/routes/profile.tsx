// src/routes/profile.tsx
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Moon, Sun, TrendingUp, Shield, Zap, Star, Award } from "lucide-react";

export const Route = createFileRoute("/profile")({ component: ProfilePage });

const USERNAME = "Stevenphanny";
const DRIVER_SCORE = 85;
const SCORE_TREND = +3;

const STATS = [
  { label: "Drives", value: "24" },
  { label: "Hours", value: "18.4" },
  { label: "Km", value: "312" },
];

const ACHIEVEMENTS = [
  { icon: Shield, label: "Safe Driver" },
  { icon: Zap, label: "5-Day Streak" },
  { icon: Star, label: "Night Owl" },
  { icon: Award, label: "First Drive" },
];

const RECENT_DRIVES = [
  { label: "Today", time: "8:42 AM · 14 min", score: 91, color: "#22c55e" },
  { label: "Yesterday", time: "6:15 PM · 32 min", score: 78, color: "#f59e0b" },
  { label: "Mon 10 Mar", time: "9:00 AM · 21 min", score: 88, color: "#22c55e" },
];

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
  const [light, setLight] = useState(() =>
    document.documentElement.classList.contains("light")
  );

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

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-4 pt-10 pb-32 gap-4">

        <header className="mb-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            BeeSafe
          </p>
          <h1 className="mt-1 text-2xl font-semibold">Profile</h1>
        </header>

        {/* ── User card ── */}
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

        {/* ── Driver score card ── */}
        <div className="rounded-2xl bg-card border border-border px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">
            Driver score
          </p>
          <div className="flex items-center gap-5">
            <div className="relative flex items-center justify-center">
              <ScoreArc score={DRIVER_SCORE} />
              <span className="absolute text-2xl font-black">{DRIVER_SCORE}</span>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-foreground">Good driver</p>
              <div className="flex items-center gap-1 text-xs text-green-400 font-semibold">
                <TrendingUp size={13} />
                +{SCORE_TREND} pts this week
              </div>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Stay alert and reduce harsh braking to hit 90+
              </p>
            </div>
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-3 gap-3">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center justify-center rounded-2xl bg-card border border-border py-4 gap-1">
              <span className="text-xl font-black text-primary">{s.value}</span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>

        {/* ── Achievements ── */}
        <div className="rounded-2xl bg-card border border-border px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">
            Achievements
          </p>
          <div className="flex flex-wrap gap-2">
            {ACHIEVEMENTS.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5">
                <Icon size={12} className="text-primary" />
                <span className="text-xs font-semibold">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Recent drives ── */}
        <div className="rounded-2xl bg-card border border-border px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">
            Recent drives
          </p>
          <div className="flex flex-col divide-y divide-border">
            {RECENT_DRIVES.map((d) => (
              <div key={d.label} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm font-semibold">{d.label}</p>
                  <p className="text-xs text-muted-foreground">{d.time}</p>
                </div>
                <span className="text-base font-black" style={{ color: d.color }}>
                  {d.score}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Theme toggle ── */}
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

        <p className="text-center text-[10px] text-muted-foreground/50 mt-2">
          BeeSafe v0.1.0 · Built at UniHack 2026
        </p>

      </div>
    </main>
  );
}
