import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { a as authClient } from "./auth-client-Bj0AyqQg.mjs";
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
import "../_libs/lucide-react.mjs";
import "../_libs/openai.mjs";
import "../_libs/nanostores.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
function OnboardingPage() {
  const navigate = useNavigate();
  const {
    data: session,
    isPending
  } = authClient.useSession();
  const [username, setUsername] = reactExports.useState("");
  const [saving, setSaving] = reactExports.useState(false);
  if (isPending) return null;
  if (!session?.user) {
    navigate({
      to: "/login"
    });
    return null;
  }
  const handleContinue = async () => {
    const trimmed = username.trim();
    if (!trimmed) return;
    setSaving(true);
    try {
      await authClient.updateUser({
        name: trimmed
      });
      navigate({
        to: "/"
      });
    } catch {
      setSaving(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex min-h-screen flex-col items-center justify-center bg-background px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
    opacity: 0,
    y: 20
  }, animate: {
    opacity: 1,
    y: 0
  }, transition: {
    duration: 0.5,
    ease: [0.22, 1, 0.36, 1]
  }, className: "flex w-full max-w-sm flex-col items-center gap-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-brand text-3xl font-black text-foreground", children: "Choose a username" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "This is how you'll appear in BeeSafe" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex w-full flex-col gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: username, onChange: (e) => setUsername(e.target.value), onKeyDown: (e) => e.key === "Enter" && handleContinue(), placeholder: "Enter your username", maxLength: 24, autoFocus: true, className: "w-full rounded-xl border border-border bg-card px-4 py-3.5 text-center font-semibold text-foreground placeholder:text-muted-foreground/50 outline-none ring-primary focus:ring-2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleContinue, disabled: !username.trim() || saving, className: "w-full rounded-full bg-primary px-6 py-3.5 font-brand text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-all active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none", children: saving ? "Saving..." : "Continue" })
    ] })
  ] }) });
}
export {
  OnboardingPage as component
};
