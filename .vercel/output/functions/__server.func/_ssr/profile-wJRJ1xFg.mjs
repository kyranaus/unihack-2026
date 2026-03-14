import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { a as authClient } from "./auth-client-Bj0AyqQg.mjs";
import { h as TrendingUp, a as Shield, Z as Zap, i as Star, A as Award, j as Sun, M as Moon, L as LogOut } from "../_libs/lucide-react.mjs";
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
import "./router-DL5qrXNE.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/zod.mjs";
import "node:buffer";
import "../_libs/orpc__openapi.mjs";
import "../_libs/orpc__server.mjs";
import "../_libs/orpc__shared.mjs";
import "../_libs/orpc__standard-server-fetch.mjs";
import "../_libs/orpc__standard-server.mjs";
import "../_libs/orpc__client.mjs";
import "../_libs/orpc__contract.mjs";
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
import "../_libs/nanostores.mjs";
const DRIVER_SCORE = 85;
const SCORE_TREND = 3;
const STATS = [{
  label: "Drives",
  value: "24"
}, {
  label: "Hours",
  value: "18.4"
}, {
  label: "Km",
  value: "312"
}];
const ACHIEVEMENTS = [{
  icon: Shield,
  label: "Safe Driver"
}, {
  icon: Zap,
  label: "5-Day Streak"
}, {
  icon: Star,
  label: "Night Owl"
}, {
  icon: Award,
  label: "First Drive"
}];
const RECENT_DRIVES = [{
  label: "Today",
  time: "8:42 AM · 14 min",
  score: 91,
  color: "#22c55e"
}, {
  label: "Yesterday",
  time: "6:15 PM · 32 min",
  score: 78,
  color: "#f59e0b"
}, {
  label: "Mon 10 Mar",
  time: "9:00 AM · 21 min",
  score: 88,
  color: "#22c55e"
}];
function ScoreArc({
  score
}) {
  const r = 40;
  const circ = 2 * Math.PI * r;
  const dash = score / 100 * circ;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 100 100", className: "w-28 h-28 -rotate-90", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "50", cy: "50", r, fill: "none", stroke: "currentColor", strokeWidth: "8", className: "text-muted/40" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "50", cy: "50", r, fill: "none", stroke: "var(--primary)", strokeWidth: "8", strokeDasharray: `${dash} ${circ}`, strokeLinecap: "round" })
  ] });
}
function ProfilePage() {
  const navigate = useNavigate();
  const {
    data: session,
    isPending
  } = authClient.useSession();
  const [light, setLight] = reactExports.useState(() => document.documentElement.classList.contains("light"));
  reactExports.useEffect(() => {
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
    navigate({
      to: "/login"
    });
    return null;
  }
  const USERNAME = session.user.name || "Driver";
  const handleSignOut = async () => {
    await authClient.signOut();
    navigate({
      to: "/login"
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "min-h-screen bg-background text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto w-full max-w-md md:max-w-5xl px-4 md:px-8 pt-10 md:pt-20 pb-32 md:pb-12 flex flex-col gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "mb-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground", children: "BeeSafe" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 text-2xl font-semibold", children: "Profile" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:grid md:grid-cols-2 md:gap-6 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 rounded-2xl bg-card border border-border px-5 py-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground", children: USERNAME.charAt(0).toUpperCase() }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-bold truncate", children: USERNAME }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Learner driver · Joined Jan 2026" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary", children: "L" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-card border border-border px-5 py-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3", children: "Driver score" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center justify-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ScoreArc, { score: DRIVER_SCORE }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute text-2xl font-black", children: DRIVER_SCORE })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Good driver" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-xs text-green-400 font-semibold", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 13 }),
                "+",
                SCORE_TREND,
                " pts this week"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 leading-relaxed", children: "Stay alert and reduce harsh braking to hit 90+" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-3", children: STATS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center rounded-2xl bg-card border border-border py-4 gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl font-black text-primary", children: s.value }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold uppercase tracking-widest text-muted-foreground", children: s.label })
        ] }, s.label)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-card border border-border px-5 py-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3", children: "Achievements" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: ACHIEVEMENTS.map(({
            icon: Icon,
            label
          }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 12, className: "text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold", children: label })
          ] }, label)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-card border border-border px-5 py-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3", children: "Recent drives" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col divide-y divide-border", children: RECENT_DRIVES.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-3 first:pt-0 last:pb-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", children: d.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: d.time })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base font-black", style: {
              color: d.color
            }, children: d.score })
          ] }, d.label)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-2xl bg-card border border-border px-5 py-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            light ? /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { size: 20, className: "text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { size: 20, className: "text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", children: light ? "Light mode" : "Dark mode" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: light ? "White · Yellow accent" : "Black · Yellow accent" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setLight((v) => !v), className: "relative h-7 w-12 overflow-hidden rounded-full transition-colors duration-300", style: {
            backgroundColor: light ? "var(--primary)" : "#3f3f46"
          }, "aria-label": "Toggle theme", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-0 top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform duration-300", style: {
            transform: light ? "translateX(22px)" : "translateX(2px)"
          } }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleSignOut, className: "flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/30 bg-card px-5 py-4 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10 active:scale-[0.98]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { size: 16 }),
      "Sign out"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-[10px] text-muted-foreground/50 mt-2", children: "BeeSafe v0.1.0 · Built at UniHack 2026" })
  ] }) });
}
export {
  ProfilePage as component
};
