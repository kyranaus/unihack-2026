import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { B as BrandLogo } from "./BrandLogo-DyYbX5YL.mjs";
import { a as authClient } from "./auth-client-Bj0AyqQg.mjs";
import { o as Smartphone, V as Video } from "../_libs/lucide-react.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
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
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
function scoreGradientColors(score) {
  if (score >= 70) return ["#4ade80", "#16a34a"];
  if (score >= 40) return ["#facc15", "#eab308"];
  return ["#f87171", "#dc2626"];
}
function DriverScoreCircle({ score, size = 76 }) {
  const clamped = Math.min(100, Math.max(0, score));
  const strokeWidth = Math.max(6, size * 0.07);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = clamped / 100 * circumference;
  const [colorStart, colorEnd] = scoreGradientColors(clamped);
  const fontSize = Math.round(size * 0.22);
  const subSize = Math.round(size * 0.1);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center justify-center", style: { width: size, height: size }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: size, height: size, className: "-rotate-90", "aria-hidden": "true", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "circle",
        {
          cx: size / 2,
          cy: size / 2,
          r: radius,
          stroke: "var(--border)",
          strokeWidth,
          fill: "none"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "circle",
        {
          cx: size / 2,
          cy: size / 2,
          r: radius,
          stroke: "url(#scoreGradient)",
          strokeWidth,
          strokeLinecap: "round",
          fill: "none",
          strokeDasharray: circumference,
          strokeDashoffset: circumference - progress
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "scoreGradient", x1: "0", y1: "0", x2: "1", y2: "1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: colorStart }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: colorEnd })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center leading-none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize }, className: "font-bold tabular-nums text-foreground", children: clamped }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: subSize }, className: "text-muted-foreground", children: "/100" })
    ] })
  ] });
}
const DRIVER_SCORE = 85;
const APP_URL = "https://kyranaus-unihack-2026.kyranmenezesaus.workers.dev/";
const QR_SRC = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&color=000000&bgcolor=ffffff&data=${encodeURIComponent(APP_URL)}`;
const brushContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.055,
      delayChildren: 2
    }
  }
};
const brushChar = {
  hidden: {
    opacity: 0,
    scaleY: 0.08,
    y: -14,
    rotate: -8,
    filter: "blur(6px)"
  },
  show: {
    opacity: 1,
    scaleY: 1,
    y: 0,
    rotate: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
      mass: 0.55
    }
  }
};
function BrushName({
  name
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(motion.span, { variants: brushContainer, initial: "hidden", animate: "show", className: "inline-flex font-brand text-2xl font-black text-foreground", "aria-label": name, children: name.split("").map((char, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(motion.span, { variants: brushChar, style: {
    transformOrigin: "top center",
    display: "inline-block"
  }, children: char }, i)) });
}
function App() {
  const navigate = useNavigate();
  const {
    data: session,
    isPending
  } = authClient.useSession();
  if (isPending) return null;
  if (!session?.user) {
    navigate({
      to: "/login"
    });
    return null;
  }
  const username = session.user.name || "Driver";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:flex min-h-screen flex-col items-center justify-center gap-10 px-8 pt-14", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(BrandLogo, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: QR_SRC, alt: "QR code to open BeeSafe on mobile", width: 180, height: 180 }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { size: 14, className: "text-primary shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Best experienced on mobile — scan to open on your phone" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:hidden relative mx-auto min-h-screen max-w-md px-4 pb-28", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-4", style: {
        paddingTop: "12vh"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(BrandLogo, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-1 mt-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(motion.p, { initial: {
            opacity: 0
          }, animate: {
            opacity: 1
          }, transition: {
            delay: 2,
            duration: 0.6,
            ease: "easeOut"
          }, className: "text-[10px] uppercase tracking-[0.22em] text-muted-foreground", children: "Welcome back" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BrushName, { name: username }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
          opacity: 0,
          y: 12
        }, animate: {
          opacity: 1,
          y: 0
        }, transition: {
          delay: 3.2,
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1]
        }, className: "mt-4 flex flex-col items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DriverScoreCircle, { score: DRIVER_SCORE, size: 160 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mt-2", children: "Driver score" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
        opacity: 0,
        y: 16
      }, animate: {
        opacity: 1,
        y: 0
      }, transition: {
        delay: 3.6,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }, className: "absolute bottom-32 left-0 right-0 flex justify-center px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => navigate({
        to: "/driver-monitor"
      }), className: "flex items-center gap-2 rounded-full bg-primary px-8 py-3 font-brand text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 active:scale-95 transition-transform", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { size: 16, strokeWidth: 2.5 }),
        "Start Recording"
      ] }) })
    ] })
  ] });
}
export {
  App as component
};
