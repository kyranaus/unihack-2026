import { c as createRouter, a as createRootRouteWithContext, u as useRouterState, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent, d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { Q as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { o as object, n as number, s as string, f as record, _ as _enum, h as array, b as boolean, u as unknown, j as optional, k as boolean$1, l as looseObject, a as string$1, m as any, p as email, q as json, z } from "../_libs/zod.mjs";
import { File } from "node:buffer";
import { O as OpenAPIHandler, a as OpenAPIReferencePlugin } from "../_libs/orpc__openapi.mjs";
import { Z as ZodToJsonSchemaConverter } from "../_libs/orpc__zod.mjs";
import { S as SmartCoercionPlugin } from "../_libs/orpc__json-schema.mjs";
import { R as RPCHandler, o as os } from "../_libs/orpc__server.mjs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import * as runtime from "@prisma/client/runtime/client";
import { P as PrismaPgAdapterFactory } from "../_libs/prisma__adapter-pg.mjs";
import { d as createAuthMiddleware, f as BASE_ERROR_CODES, B as BetterAuthError, r as runWithAdapter, e as env, h as isProduction, j as createAuthEndpoint, n as normalizePathname, A as APIError, k as deprecate, S as SocialProviderListEnum, m as hasRequestState, o as runWithRequestState, l as logger, p as runWithEndpointContext, s as shouldPublishLog, q as safeJSONParse, t as createLogger, u as getAuthTables, v as socialProviders, i as isTest, w as getBetterAuthVersion, x as initGetModelName, y as initGetFieldName, z as isValidIP, C as normalizeIP, D as isDevelopment, F as createRateLimitKey, G as getCurrentAdapter, H as getCurrentAuthContext, I as generateId, J as runWithTransaction, K as filterOutputFields, L as queueAfterTransactionHook, M as import__better_auth_core_db, N as defineRequestState } from "../_libs/better-auth__core.mjs";
import { c as createRandomStringGenerator, h as hex$1, d as createHash, b as base64Url, e as binary, f as createHMAC } from "../_libs/better-auth__utils.mjs";
import { h as hexToBytes$1, m as managedNonce, u as utf8ToBytes, b as bytesToHex, x as xchacha20poly1305 } from "../_libs/noble__ciphers.mjs";
import { h as hexToBytes, s as scryptAsync, a as hkdf, b as sha256$1 } from "../_libs/noble__hashes.mjs";
import { b as createRouter$1, t as toResponse, A as APIError$1, k as kAPIErrorHeaderSymbol } from "../_libs/better-call.mjs";
import { c as createDefu, d as defu } from "../_libs/defu.mjs";
import { j as jwtVerify, J as JWTExpired, a as decodeProtectedHeader, b as jwtDecrypt, e as calculateJwkThumbprint, f as encode, E as EncryptJWT, S as SignJWT } from "../_libs/jose.mjs";
import { c as createKyselyAdapter, g as getKyselyDatabaseType } from "../_libs/better-auth__kysely-adapter.mjs";
import { c as createTelemetry } from "../_libs/better-auth__telemetry.mjs";
import { p as prismaAdapter } from "../_libs/better-auth__prisma-adapter.mjs";
import { H as House, V as Video, S as SquarePlay, U as User, B as Briefcase, C as Calendar, a as Shield, b as Settings } from "../_libs/lucide-react.mjs";
import { w as onError } from "../_libs/orpc__shared.mjs";
import { O as OpenAI } from "../_libs/openai.mjs";
import { s as sql } from "../_libs/kysely.mjs";
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
import "../_libs/orpc__contract.mjs";
import "../_libs/orpc__client.mjs";
import "../_libs/orpc__standard-server.mjs";
import "../_libs/rou3.mjs";
import "../_libs/orpc__openapi-client.mjs";
import "../_libs/json-schema-typed.mjs";
import "../_libs/radash.mjs";
import "../_libs/orpc__standard-server-fetch.mjs";
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
import "../_libs/better-fetch__fetch.mjs";
import "node:fs";
import "node:fs/promises";
import "node:os";
const defaultItems = [
  { label: "home", icon: House },
  { label: "strategy", icon: Briefcase },
  { label: "period", icon: Calendar },
  { label: "security", icon: Shield },
  { label: "settings", icon: Settings }
];
const defaultAccentColor = "var(--component-active-color-default)";
const InteractiveMenu = ({ items, accentColor, activeIndex: controlledIndex, onItemClick }) => {
  const finalItems = reactExports.useMemo(() => {
    const isValid = items && Array.isArray(items) && items.length >= 2 && items.length <= 5;
    if (!isValid) {
      console.warn("InteractiveMenu: 'items' prop is invalid or missing. Using default items.", items);
      return defaultItems;
    }
    return items;
  }, [items]);
  const isControlled = controlledIndex !== void 0;
  const [internalIndex, setInternalIndex] = reactExports.useState(0);
  const activeIndex = isControlled ? controlledIndex : internalIndex;
  reactExports.useEffect(() => {
    if (!isControlled && internalIndex >= finalItems.length) {
      setInternalIndex(0);
    }
  }, [finalItems, internalIndex, isControlled]);
  const textRefs = reactExports.useRef([]);
  const itemRefs = reactExports.useRef([]);
  reactExports.useEffect(() => {
    const setLineWidth = () => {
      const activeItemElement = itemRefs.current[activeIndex];
      const activeTextElement = textRefs.current[activeIndex];
      if (activeItemElement && activeTextElement) {
        const textWidth = activeTextElement.offsetWidth;
        activeItemElement.style.setProperty("--lineWidth", `${textWidth}px`);
      }
    };
    setLineWidth();
    window.addEventListener("resize", setLineWidth);
    return () => {
      window.removeEventListener("resize", setLineWidth);
    };
  }, [activeIndex, finalItems]);
  const handleItemClick = (index) => {
    if (!isControlled) setInternalIndex(index);
    onItemClick?.(index);
  };
  const navStyle = reactExports.useMemo(() => {
    const activeColor = accentColor || defaultAccentColor;
    return { "--component-active-color": activeColor };
  }, [accentColor]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "nav",
    {
      className: "menu",
      role: "navigation",
      style: navStyle,
      children: finalItems.map((item, index) => {
        const isActive = index === activeIndex;
        const isTextActive = isActive;
        const IconComponent = item.icon;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: `menu__item ${isActive ? "active" : ""}`,
            onClick: () => handleItemClick(index),
            ref: (el) => {
              itemRefs.current[index] = el;
            },
            style: { "--lineWidth": "0px" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "menu__icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(IconComponent, { className: "icon" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "strong",
                {
                  className: `menu__text ${isTextActive ? "active" : ""}`,
                  ref: (el) => {
                    textRefs.current[index] = el;
                  },
                  children: item.label
                }
              )
            ]
          },
          item.label
        );
      })
    }
  );
};
const navItems = [
  { label: "home", icon: House },
  { label: "record", icon: Video },
  { label: "replays", icon: SquarePlay },
  { label: "profile", icon: User }
];
const desktopItems = [
  { label: "Home", icon: House, route: "/" },
  { label: "Record", icon: Video, route: "/driver-monitor" },
  { label: "Replays", icon: SquarePlay, route: "/replay" },
  { label: "Profile", icon: User, route: "/profile" }
];
const routes = ["/", "/driver-monitor", "/replay", "/profile"];
function Navbar() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const activeIndex = Math.max(0, routes.indexOf(pathname));
  const handleItemClick = (index) => {
    navigate({ to: routes[index] });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "hidden md:flex fixed top-0 left-0 right-0 z-50 items-center justify-between px-8 py-3 border-b border-border bg-background/80 backdrop-blur-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-lg font-black tracking-tight", style: { color: "var(--dashcam-yellow)" }, children: [
        "Bee",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: "Safe" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex items-center gap-1", children: desktopItems.map(({ label, icon: Icon, route }) => {
        const active = pathname === route;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => navigate({ to: route }),
            className: "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
            style: active ? { color: "var(--dashcam-yellow)", backgroundColor: "rgba(234,179,8,0.1)" } : { color: "var(--muted-foreground)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 15 }),
              label
            ]
          },
          route
        );
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed bottom-0 left-0 right-0 h-32 pointer-events-none z-40 bg-gradient-to-t from-background to-transparent" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "fixed bottom-0 left-0 right-0 flex justify-center px-4 pointer-events-none z-50",
          style: { paddingBottom: "max(1rem, env(safe-area-inset-bottom))" },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-auto w-full max-w-sm rounded-full shadow-[0_0_20px_rgba(0,0,0,0.3)] ring-1 ring-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            InteractiveMenu,
            {
              items: navItems,
              activeIndex,
              onItemClick: handleItemClick,
              accentColor: "#eab308"
            }
          ) })
        }
      )
    ] })
  ] });
}
let context;
function getContext() {
  if (context) {
    return context;
  }
  const queryClient = new QueryClient();
  context = {
    queryClient
  };
  return context;
}
function TanStackQueryProvider({
  children
}) {
  const { queryClient } = getContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children });
}
const appCss = "/assets/styles-D7WhHgFR.css";
const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`;
const HIDE_NAVBAR_ROUTES = ["/login", "/onboarding"];
const Route$d = createRootRouteWithContext()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8"
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, viewport-fit=cover"
      },
      {
        title: "BeeSafe"
      }
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss
      }
    ]
  }),
  shellComponent: RootDocument,
  component: RootLayout
});
function RootDocument({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", suppressHydrationWarning: true, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("head", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("script", { dangerouslySetInnerHTML: { __html: THEME_INIT_SCRIPT } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { className: "font-sans antialiased [overflow-wrap:anywhere] selection:bg-[rgba(79,184,178,0.24)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TanStackQueryProvider, { children }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const showNavbar = !HIDE_NAVBAR_ROUTES.includes(pathname);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    showNavbar && /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, {})
  ] });
}
const $$splitComponentImporter$8 = () => import("./replay-B1reMHBM.mjs");
const Route$c = createFileRoute("/replay")({
  component: lazyRouteComponent($$splitComponentImporter$8, "component"),
  validateSearch: object({
    t: number().optional()
  })
});
const $$splitComponentImporter$7 = () => import("./record-CL0L8ja9.mjs");
const Route$b = createFileRoute("/record")({
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./profile-wJRJ1xFg.mjs");
const Route$a = createFileRoute("/profile")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./onboarding-CFCgCFyI.mjs");
const Route$9 = createFileRoute("/onboarding")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./login-CXTemBUP.mjs");
const Route$8 = createFileRoute("/login")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./emergency-ZLCrPT9P.mjs");
const Route$7 = createFileRoute("/emergency")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./driver-monitor-C_5XABw8.mjs");
const Route$6 = createFileRoute("/driver-monitor")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./about-CXr0J6fq.mjs");
const Route$5 = createFileRoute("/about")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./index-Cj1lPR78.mjs");
const Route$4 = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const REGION = process.env.AWS_REGION ?? "ap-southeast-2";
const SERVICE = "polly";
async function hmacSHA256(key, data) {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(data));
}
async function sha256(data) {
  const buf = typeof data === "string" ? new TextEncoder().encode(data) : data;
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return hex(hash);
}
function hex(buf) {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function signingKey(secretKey, date) {
  let key = await hmacSHA256(new TextEncoder().encode(`AWS4${secretKey}`), date);
  for (const part of [REGION, SERVICE, "aws4_request"]) {
    key = await hmacSHA256(key, part);
  }
  return key;
}
async function signRequest(method, url, body, accessKeyId, secretAccessKey) {
  const now2 = /* @__PURE__ */ new Date();
  const date = now2.toISOString().replace(/[-:]/g, "").slice(0, 8);
  const amzDate = `${date}T${now2.toISOString().replace(/[-:]/g, "").slice(9, 15)}Z`;
  const headers = {
    "content-type": "application/json",
    host: url.host,
    "x-amz-date": amzDate
  };
  const signedHeaderKeys = Object.keys(headers).sort();
  const signedHeaders = signedHeaderKeys.join(";");
  const canonicalHeaders = signedHeaderKeys.map((k) => `${k}:${headers[k]}
`).join("");
  const payloadHash = await sha256(body);
  const canonicalRequest = [
    method,
    url.pathname,
    "",
    canonicalHeaders,
    signedHeaders,
    payloadHash
  ].join("\n");
  const scope = `${date}/${REGION}/${SERVICE}/aws4_request`;
  const stringToSign = ["AWS4-HMAC-SHA256", amzDate, scope, await sha256(canonicalRequest)].join("\n");
  const key = await signingKey(secretAccessKey, date);
  const signature = hex(await hmacSHA256(key, stringToSign));
  headers["authorization"] = `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
  return headers;
}
async function handle$2({ request }) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  if (!accessKeyId || !secretAccessKey) {
    return new Response(JSON.stringify({ error: "AWS credentials not configured" }), {
      status: 503,
      headers: { "Content-Type": "application/json" }
    });
  }
  const reqBody = await request.json();
  const text = reqBody.text?.trim();
  if (!text || text.length > 3e3) {
    return new Response("Invalid or too-long text", { status: 400 });
  }
  try {
    const pollyUrl = new URL(`https://${SERVICE}.${REGION}.amazonaws.com/v1/speech`);
    const body = JSON.stringify({
      Text: text,
      OutputFormat: "mp3",
      VoiceId: "Joanna",
      Engine: "neural"
    });
    const headers = await signRequest("POST", pollyUrl, body, accessKeyId, secretAccessKey);
    const res = await fetch(pollyUrl.toString(), { method: "POST", headers, body });
    if (!res.ok) {
      const errText = await res.text();
      console.error("Polly API error:", res.status, errText);
      return new Response(JSON.stringify({ error: "TTS failed" }), {
        status: 502,
        headers: { "Content-Type": "application/json" }
      });
    }
    const audioBytes = new Uint8Array(await res.arrayBuffer());
    return new Response(audioBytes, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": String(audioBytes.length)
      }
    });
  } catch (err) {
    console.error("TTS error:", err instanceof Error ? err.message : err);
    return new Response(JSON.stringify({ error: "TTS failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
const Route$3 = createFileRoute("/api/tts")({
  server: {
    handlers: {
      POST: handle$2
    }
  }
});
if (typeof globalThis.File === "undefined") {
  globalThis.File = File;
}
const TodoSchema = object({
  id: number().int().min(1),
  name: string()
});
const todos = [
  { id: 1, name: "Get groceries" },
  { id: 2, name: "Buy a new phone" },
  { id: 3, name: "Finish the project" }
];
const listTodos = os.input(object({})).handler(() => {
  return todos;
});
const addTodo = os.input(object({ name: string() })).handler(({ input }) => {
  const newTodo = { id: todos.length + 1, name: input.name };
  todos.push(newTodo);
  return newTodo;
});
const config$1 = {
  "previewFeatures": [],
  "clientVersion": "7.5.0",
  "engineVersion": "280c870be64f457428992c43c1f6d557fab6e29e",
  "activeProvider": "postgresql",
  "inlineSchema": 'generator client {\n  provider = "prisma-client"\n  output   = "../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel Todo {\n  id        Int      @id @default(autoincrement())\n  title     String\n  createdAt DateTime @default(now())\n}\n\nmodel user {\n  id            String    @id @default(cuid())\n  name          String\n  email         String    @unique\n  emailVerified Boolean   @default(false)\n  image         String?\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n  sessions      session[]\n  accounts      account[]\n}\n\nmodel session {\n  id        String   @id @default(cuid())\n  expiresAt DateTime\n  token     String   @unique\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      user     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel account {\n  id                    String    @id @default(cuid())\n  accountId             String\n  providerId            String\n  userId                String\n  user                  user      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n}\n\nmodel verification {\n  id         String   @id @default(cuid())\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n}\n\nmodel DriveSession {\n  id        String       @id @default(cuid())\n  startedAt DateTime     @default(now())\n  endedAt   DateTime?\n  summary   String?\n  score     Int?\n  cameras   String[]\n  events    DriveEvent[]\n  createdAt DateTime     @default(now())\n}\n\nmodel DriveEvent {\n  id         String       @id @default(cuid())\n  sessionId  String\n  session    DriveSession @relation(fields: [sessionId], references: [id])\n  type       String\n  camera     String       @default("front")\n  elapsedSec Int\n  summary    String\n  severity   String\n  metadata   Json         @default("{}")\n  createdAt  DateTime     @default(now())\n\n  @@index([sessionId])\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config$1.runtimeDataModel = JSON.parse('{"models":{"Todo":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"title","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"user":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"session","relationName":"sessionTouser"},{"name":"accounts","kind":"object","type":"account","relationName":"accountTouser"}],"dbName":null},"session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"user","relationName":"sessionTouser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"user","relationName":"accountTouser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"DriveSession":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"startedAt","kind":"scalar","type":"DateTime"},{"name":"endedAt","kind":"scalar","type":"DateTime"},{"name":"summary","kind":"scalar","type":"String"},{"name":"score","kind":"scalar","type":"Int"},{"name":"cameras","kind":"scalar","type":"String"},{"name":"events","kind":"object","type":"DriveEvent","relationName":"DriveEventToDriveSession"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"DriveEvent":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"sessionId","kind":"scalar","type":"String"},{"name":"session","kind":"object","type":"DriveSession","relationName":"DriveEventToDriveSession"},{"name":"type","kind":"scalar","type":"String"},{"name":"camera","kind":"scalar","type":"String"},{"name":"elapsedSec","kind":"scalar","type":"Int"},{"name":"summary","kind":"scalar","type":"String"},{"name":"severity","kind":"scalar","type":"String"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null}},"enums":{},"types":{}}');
config$1.parameterizationSchema = {
  strings: JSON.parse('["where","Todo.findUnique","Todo.findUniqueOrThrow","orderBy","cursor","Todo.findFirst","Todo.findFirstOrThrow","Todo.findMany","data","Todo.createOne","Todo.createMany","Todo.createManyAndReturn","Todo.updateOne","Todo.updateMany","Todo.updateManyAndReturn","create","update","Todo.upsertOne","Todo.deleteOne","Todo.deleteMany","having","_count","_avg","_sum","_min","_max","Todo.groupBy","Todo.aggregate","user","sessions","accounts","user.findUnique","user.findUniqueOrThrow","user.findFirst","user.findFirstOrThrow","user.findMany","user.createOne","user.createMany","user.createManyAndReturn","user.updateOne","user.updateMany","user.updateManyAndReturn","user.upsertOne","user.deleteOne","user.deleteMany","user.groupBy","user.aggregate","session.findUnique","session.findUniqueOrThrow","session.findFirst","session.findFirstOrThrow","session.findMany","session.createOne","session.createMany","session.createManyAndReturn","session.updateOne","session.updateMany","session.updateManyAndReturn","session.upsertOne","session.deleteOne","session.deleteMany","session.groupBy","session.aggregate","account.findUnique","account.findUniqueOrThrow","account.findFirst","account.findFirstOrThrow","account.findMany","account.createOne","account.createMany","account.createManyAndReturn","account.updateOne","account.updateMany","account.updateManyAndReturn","account.upsertOne","account.deleteOne","account.deleteMany","account.groupBy","account.aggregate","verification.findUnique","verification.findUniqueOrThrow","verification.findFirst","verification.findFirstOrThrow","verification.findMany","verification.createOne","verification.createMany","verification.createManyAndReturn","verification.updateOne","verification.updateMany","verification.updateManyAndReturn","verification.upsertOne","verification.deleteOne","verification.deleteMany","verification.groupBy","verification.aggregate","session","events","DriveSession.findUnique","DriveSession.findUniqueOrThrow","DriveSession.findFirst","DriveSession.findFirstOrThrow","DriveSession.findMany","DriveSession.createOne","DriveSession.createMany","DriveSession.createManyAndReturn","DriveSession.updateOne","DriveSession.updateMany","DriveSession.updateManyAndReturn","DriveSession.upsertOne","DriveSession.deleteOne","DriveSession.deleteMany","DriveSession.groupBy","DriveSession.aggregate","DriveEvent.findUnique","DriveEvent.findUniqueOrThrow","DriveEvent.findFirst","DriveEvent.findFirstOrThrow","DriveEvent.findMany","DriveEvent.createOne","DriveEvent.createMany","DriveEvent.createManyAndReturn","DriveEvent.updateOne","DriveEvent.updateMany","DriveEvent.updateManyAndReturn","DriveEvent.upsertOne","DriveEvent.deleteOne","DriveEvent.deleteMany","DriveEvent.groupBy","DriveEvent.aggregate","AND","OR","NOT","id","sessionId","type","camera","elapsedSec","summary","severity","metadata","createdAt","equals","in","notIn","lt","lte","gt","gte","not","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","contains","startsWith","endsWith","startedAt","endedAt","score","cameras","has","hasEvery","hasSome","every","some","none","identifier","value","expiresAt","updatedAt","accountId","providerId","userId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","name","email","emailVerified","image","title","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","push","increment","decrement","multiply","divide"]'),
  graph: "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_AEAIQIAAAAnACAIAAAzACACAAAAJwAgCAAAMwAgAwAAABoAIA8AACwAIBAAADEAIAEAAAAaACABAAAAJwAgBBUAAJ0CACAYAACfAgAgGQAAngIAILwBAAD1AQAgCoEBAADeAQAwggEAADoAEIMBAADeAQAwhAEBALcBACGMAUAAugEAIasBQAC6AQAhuQEBALcBACG6AQEAtwEAIbsBIADfAQAhvAEBAMUBACEDAAAAJwAgAwAAOQAwFAAAOgAgAwAAACcAIAMAACgAMAQAABoAIAEAAAAeACABAAAAHgAgAwAAABwAIAMAAB0AMAQAAB4AIAMAAAAcACADAAAdADAEAAAeACADAAAAHAAgAwAAHQAwBAAAHgAgCRwAAJwCACCEAQEAAAABjAFAAAAAAaoBQAAAAAGrAUAAAAABrgEBAAAAAbYBAQAAAAG3AQEAAAABuAEBAAAAAQEIAABCACAIhAEBAAAAAYwBQAAAAAGqAUAAAAABqwFAAAAAAa4BAQAAAAG2AQEAAAABtwEBAAAAAbgBAQAAAAEBCAAARAAwAQgAAEQAMAkcAACbAgAghAEBAPABACGMAUAA8gEAIaoBQADyAQAhqwFAAPIBACGuAQEA8AEAIbYBAQDwAQAhtwEBAPwBACG4AQEA_AEAIQIAAAAeACAIAABHACAIhAEBAPABACGMAUAA8gEAIaoBQADyAQAhqwFAAPIBACGuAQEA8AEAIbYBAQDwAQAhtwEBAPwBACG4AQEA_AEAIQIAAAAcACAIAABJACACAAAAHAAgCAAASQAgAwAAAB4AIA8AAEIAIBAAAEcAIAEAAAAeACABAAAAHAAgBRUAAJgCACAYAACaAgAgGQAAmQIAILcBAAD1AQAguAEAAPUBACALgQEAAN0BADCCAQAAUAAQgwEAAN0BADCEAQEAtwEAIYwBQAC6AQAhqgFAALoBACGrAUAAugEAIa4BAQC3AQAhtgEBALcBACG3AQEAxQEAIbgBAQDFAQAhAwAAABwAIAMAAE8AMBQAAFAAIAMAAAAcACADAAAdADAEAAAeACABAAAAIgAgAQAAACIAIAMAAAAgACADAAAhADAEAAAiACADAAAAIAAgAwAAIQAwBAAAIgAgAwAAACAAIAMAACEAMAQAACIAIA4cAACXAgAghAEBAAAAAYwBQAAAAAGrAUAAAAABrAEBAAAAAa0BAQAAAAGuAQEAAAABrwEBAAAAAbABAQAAAAGxAQEAAAABsgFAAAAAAbMBQAAAAAG0AQEAAAABtQEBAAAAAQEIAABYACANhAEBAAAAAYwBQAAAAAGrAUAAAAABrAEBAAAAAa0BAQAAAAGuAQEAAAABrwEBAAAAAbABAQAAAAGxAQEAAAABsgFAAAAAAbMBQAAAAAG0AQEAAAABtQEBAAAAAQEIAABaADABCAAAWgAwDhwAAJYCACCEAQEA8AEAIYwBQADyAQAhqwFAAPIBACGsAQEA8AEAIa0BAQDwAQAhrgEBAPABACGvAQEA_AEAIbABAQD8AQAhsQEBAPwBACGyAUAA-wEAIbMBQAD7AQAhtAEBAPwBACG1AQEA_AEAIQIAAAAiACAIAABdACANhAEBAPABACGMAUAA8gEAIasBQADyAQAhrAEBAPABACGtAQEA8AEAIa4BAQDwAQAhrwEBAPwBACGwAQEA_AEAIbEBAQD8AQAhsgFAAPsBACGzAUAA-wEAIbQBAQD8AQAhtQEBAPwBACECAAAAIAAgCAAAXwAgAgAAACAAIAgAAF8AIAMAAAAiACAPAABYACAQAABdACABAAAAIgAgAQAAACAAIAoVAACTAgAgGAAAlQIAIBkAAJQCACCvAQAA9QEAILABAAD1AQAgsQEAAPUBACCyAQAA9QEAILMBAAD1AQAgtAEAAPUBACC1AQAA9QEAIBCBAQAA3AEAMIIBAABmABCDAQAA3AEAMIQBAQC3AQAhjAFAALoBACGrAUAAugEAIawBAQC3AQAhrQEBALcBACGuAQEAtwEAIa8BAQDFAQAhsAEBAMUBACGxAQEAxQEAIbIBQADEAQAhswFAAMQBACG0AQEAxQEAIbUBAQDFAQAhAwAAACAAIAMAAGUAMBQAAGYAIAMAAAAgACADAAAhADAEAAAiACAJgQEAANsBADCCAQAAbAAQgwEAANsBADCEAQEAAAABjAFAANEBACGoAQEA0AEAIakBAQDQAQAhqgFAANEBACGrAUAA0QEAIQEAAABpACABAAAAaQAgCYEBAADbAQAwggEAAGwAEIMBAADbAQAwhAEBANABACGMAUAA0QEAIagBAQDQAQAhqQEBANABACGqAUAA0QEAIasBQADRAQAhAAMAAABsACADAABtADAEAABpACADAAAAbAAgAwAAbQAwBAAAaQAgAwAAAGwAIAMAAG0AMAQAAGkAIAaEAQEAAAABjAFAAAAAAagBAQAAAAGpAQEAAAABqgFAAAAAAasBQAAAAAEBCAAAcQAgBoQBAQAAAAGMAUAAAAABqAEBAAAAAakBAQAAAAGqAUAAAAABqwFAAAAAAQEIAABzADABCAAAcwAwBoQBAQDwAQAhjAFAAPIBACGoAQEA8AEAIakBAQDwAQAhqgFAAPIBACGrAUAA8gEAIQIAAABpACAIAAB2ACAGhAEBAPABACGMAUAA8gEAIagBAQDwAQAhqQEBAPABACGqAUAA8gEAIasBQADyAQAhAgAAAGwAIAgAAHgAIAIAAABsACAIAAB4ACADAAAAaQAgDwAAcQAgEAAAdgAgAQAAAGkAIAEAAABsACADFQAAkAIAIBgAAJICACAZAACRAgAgCYEBAADaAQAwggEAAH8AEIMBAADaAQAwhAEBALcBACGMAUAAugEAIagBAQC3AQAhqQEBALcBACGqAUAAugEAIasBQAC6AQAhAwAAAGwAIAMAAH4AMBQAAH8AIAMAAABsACADAABtADAEAABpACALYAAA1QEAIIEBAADPAQAwggEAAIoBABCDAQAAzwEAMIQBAQAAAAGJAQEA0wEAIYwBQADRAQAhngFAANEBACGfAUAA0gEAIaABAgDUAQAhoQEAAMcBACABAAAAggEAIA1fAADZAQAggQEAANYBADCCAQAAhAEAEIMBAADWAQAwhAEBANABACGFAQEA0AEAIYYBAQDQAQAhhwEBANABACGIAQIA1wEAIYkBAQDQAQAhigEBANABACGLAQAA2AEAIIwBQADRAQAhAV8AAI8CACANXwAA2QEAIIEBAADWAQAwggEAAIQBABCDAQAA1gEAMIQBAQAAAAGFAQEA0AEAIYYBAQDQAQAhhwEBANABACGIAQIA1wEAIYkBAQDQAQAhigEBANABACGLAQAA2AEAIIwBQADRAQAhAwAAAIQBACADAACFAQAwBAAAhgEAIAEAAACEAQAgAQAAAIIBACALYAAA1QEAIIEBAADPAQAwggEAAIoBABCDAQAAzwEAMIQBAQDQAQAhiQEBANMBACGMAUAA0QEAIZ4BQADRAQAhnwFAANIBACGgAQIA1AEAIaEBAADHAQAgBGAAAI4CACCJAQAA9QEAIJ8BAAD1AQAgoAEAAPUBACADAAAAigEAIAMAAIsBADAEAACCAQAgAwAAAIoBACADAACLAQAwBAAAggEAIAMAAACKAQAgAwAAiwEAMAQAAIIBACAIYAAAjQIAIIQBAQAAAAGJAQEAAAABjAFAAAAAAZ4BQAAAAAGfAUAAAAABoAECAAAAAaEBAACMAgAgAQgAAI8BACAHhAEBAAAAAYkBAQAAAAGMAUAAAAABngFAAAAAAZ8BQAAAAAGgAQIAAAABoQEAAIwCACABCAAAkQEAMAEIAACRAQAwCGAAAP8BACCEAQEA8AEAIYkBAQD8AQAhjAFAAPIBACGeAUAA8gEAIZ8BQAD7AQAhoAECAP0BACGhAQAA_gEAIAIAAACCAQAgCAAAlAEAIAeEAQEA8AEAIYkBAQD8AQAhjAFAAPIBACGeAUAA8gEAIZ8BQAD7AQAhoAECAP0BACGhAQAA_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_AQAAigEAIAmBAQAA2gEAMIIBAAB_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_AEAIbIBQAD7AQAhswFAAPsBACG0AQEA_AEAIbUBAQD8AQAhDIQBAQDwAQAhjAFAAPIBACGrAUAA8gEAIawBAQDwAQAhrQEBAPABACGvAQEA_AEAIbABAQD8AQAhsQEBAPwBACGyAUAA-wEAIbMBQAD7AQAhtAEBAPwBACG1AQEA_AEAIQyEAQEAAAABjAFAAAAAAasBQAAAAAGsAQEAAAABrQEBAAAAAa8BAQAAAAGwAQEAAAABsQEBAAAAAbIBQAAAAAGzAUAAAAABtAEBAAAAAbUBAQAAAAEHhAEBAAAAAYwBQAAAAAGqAUAAAAABqwFAAAAAAbYBAQAAAAG3AQEAAAABuAEBAAAAAQIAAAAeACAPAAC6AgAgAwAAAB4AIA8AALoCACAQAAC5AgAgAQgAAMUCADAMHAAA5wEAIIEBAADoAQAwggEAABwAEIMBAADoAQAwhAEBAAAAAYwBQADRAQAhqgFAANEBACGrAUAA0QEAIa4BAQDQAQAhtgEBAAAAAbcBAQDTAQAhuAEBANMBACECAAAAHgAgCAAAuQIAIAIAAAC3AgAgCAAAuAIAIAuBAQAAtgIAMIIBAAC3AgAQgwEAALYCADCEAQEA0AEAIYwBQADRAQAhqgFAANEBACGrAUAA0QEAIa4BAQDQAQAhtgEBANABACG3AQEA0wEAIbgBAQDTAQAhC4EBAAC2AgAwggEAALcCABCDAQAAtgIAMIQBAQDQAQAhjAFAANEBACGqAUAA0QEAIasBQADRAQAhrgEBANABACG2AQEA0AEAIbcBAQDTAQAhuAEBANMBACEHhAEBAPABACGMAUAA8gEAIaoBQADyAQAhqwFAAPIBACG2AQEA8AEAIbcBAQD8AQAhuAEBAPwBACEHhAEBAPABACGMAUAA8gEAIaoBQADyAQAhqwFAAPIBACG2AQEA8AEAIbcBAQD8AQAhuAEBAPwBACEHhAEBAAAAAYwBQAAAAAGqAUAAAAABqwFAAAAAAbYBAQAAAAG3AQEAAAABuAEBAAAAAQQPAACvAgAwwAEAALACADDCAQAAsgIAIMYBAACzAgAwBA8AAKMCADDAAQAApAIAMMIBAACmAgAgxgEAAKcCADAAAAMdAAC9AgAgHgAAvgIAILwBAAD1AQAgAAAAAAAHhAEBAAAAAYwBQAAAAAGqAUAAAAABqwFAAAAAAbYBAQAAAAG3AQEAAAABuAEBAAAAAQyEAQEAAAABjAFAAAAAAasBQAAAAAGsAQEAAAABrQEBAAAAAa8BAQAAAAGwAQEAAAABsQEBAAAAAbIBQAAAAAGzAUAAAAABtAEBAAAAAbUBAQAAAAEIHgAAvAIAIIQBAQAAAAGMAUAAAAABqwFAAAAAAbkBAQAAAAG6AQEAAAABuwEgAAAAAbwBAQAAAAECAAAAGgAgDwAAxwIAIAMAAAAnACAPAADHAgAgEAAAywIAIAoAAAAnACAIAADLAgAgHgAAogIAIIQBAQDwAQAhjAFAAPIBACGrAUAA8gEAIbkBAQDwAQAhugEBAPABACG7ASAAoAIAIbwBAQD8AQAhCB4AAKICACCEAQEA8AEAIYwBQADyAQAhqwFAAPIBACG5AQEA8AEAIboBAQDwAQAhuwEgAKACACG8AQEA_AEAIQgdAAC7AgAghAEBAAAAAYwBQAAAAAGrAUAAAAABuQEBAAAAAboBAQAAAAG7ASAAAAABvAEBAAAAAQIAAAAaACAPAADMAgAgAwAAACcAIA8AAMwCACAQAADQAgAgCgAAACcAIAgAANACACAdAAChAgAghAEBAPABACGMAUAA8gEAIasBQADyAQAhuQEBAPABACG6AQEA8AEAIbsBIACgAgAhvAEBAPwBACEIHQAAoQIAIIQBAQDwAQAhjAFAAPIBACGrAUAA8gEAIbkBAQDwAQAhugEBAPABACG7ASAAoAIAIbwBAQD8AQAhCIQBAQAAAAGGAQEAAAABhwEBAAAAAYgBAgAAAAGJAQEAAAABigEBAAAAAYsBgAAAAAGMAUAAAAABB4QBAQAAAAGJAQEAAAABjAFAAAAAAZ4BQAAAAAGfAUAAAAABoAECAAAAAaEBAACMAgAgAgAAAIIBACAPAADSAgAgAwAAAIoBACAPAADSAgAgEAAA1gIAIAkAAACKAQAgCAAA1gIAIIQBAQDwAQAhiQEBAPwBACGMAUAA8gEAIZ4BQADyAQAhnwFAAPsBACGgAQIA_QEAIaEBAAD-AQAgB4QBAQDwAQAhiQEBAPwBACGMAUAA8gEAIZ4BQADyAQAhnwFAAPsBACGgAQIA_QEAIaEBAAD-AQAgAAAAAAUVAAYWAAcXAAgYAAkZAAoAAAAAAAUVAAYWAAcXAAgYAAkZAAoDFQAPHR8NHiMOARwADAEcAAwCHSQAHiUAAAADFQATGAAUGQAVAAAAAxUAExgAFBkAFQEcAAwBHAAMAxUAGhgAGxkAHAAAAAMVABoYABsZABwBHAAMARwADAMVACEYACIZACMAAAADFQAhGAAiGQAjAAAAAxUAKRgAKhkAKwAAAAMVACkYACoZACsCFQAvYIcBLgFfAC0BYIgBAAAABRUAMxYANBcANRgANhkANwAAAAAABRUAMxYANBcANRgANhkANwFfAC0BXwAtBRUAPBYAPRcAPhgAPxkAQAAAAAAABRUAPBYAPRcAPhgAPxkAQAECAQIDAQUGAQYHAQcIAQkKAQoMAgsNAwwPAQ0RAg4SBBETARIUARMVAhoYBRsZCx8bDCAmDCEpDCIqDCMrDCQtDCUvAiYwECcyDCg0Aik1ESo2DCs3DCw4Ai07Ei48Fi89DTA-DTE_DTJADTNBDTRDDTVFAjZGFzdIDThKAjlLGDpMDTtNDTxOAj1RGT5SHT9TDkBUDkFVDkJWDkNXDkRZDkVbAkZcHkdeDkhgAklhH0piDktjDkxkAk1nIE5oJE9qJVBrJVFuJVJvJVNwJVRyJVV0AlZ1Jld3JVh5All6J1p7JVt8JVx9Al2AAShegQEsYYMBLWKJAS1jjAEtZI0BLWWOAS1mkAEtZ5IBAmiTATBplQEtapcBAmuYATFsmQEtbZoBLW6bAQJvngEycJ8BOHGgAS5yoQEuc6IBLnSjAS51pAEudqYBLneoAQJ4qQE5easBLnqtAQJ7rgE6fK8BLn2wAS5-sQECf7QBO4ABtQFB"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("node:buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config$1.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config$1);
}
runtime.Extensions.getExtensionContext;
({
  DbNull: runtime.NullTypes.DbNull,
  JsonNull: runtime.NullTypes.JsonNull,
  AnyNull: runtime.NullTypes.AnyNull
});
runtime.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
runtime.Extensions.defineExtension;
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
const PrismaClient = getPrismaClientClass();
const adapter = new PrismaPgAdapterFactory({
  connectionString: process.env.DATABASE_URL
});
const prisma = globalThis.__prisma || new PrismaClient({ adapter });
const SYSTEM_PROMPT = `You are a dashcam safety AI analysing camera frames from a vehicle.
The camera may face the driver OR the road. Describe what you see in ONE specific sentence.

For driver-facing frames, be specific about what the driver is doing:
- Looking at phone, eating, drinking, talking to passenger, eyes closed, yawning, head drooping, hands off wheel, reaching for something, etc.

For road-facing frames, describe road events:
- Vehicle braking ahead, pedestrian crossing, traffic light, lane change, tailgating, construction zone, etc.

Classify severity:
- "info" = alert driver, clear road, normal conditions
- "warning" = phone use, mild distraction, vehicle braking ahead, pedestrian near road
- "critical" = eyes closed >2s, head drooping, collision risk, obstacle in road

If nothing notable: "Driver alert, normal conditions"

Respond in JSON only: { "summary": "...", "severity": "info" | "warning" | "critical" }`;
let client = null;
function getClient() {
  if (!client) {
    client = new OpenAI({
      baseURL: process.env.VLLM_API,
      apiKey: process.env.VLLM_API_KEY
    });
  }
  return client;
}
async function analyseFrames(base64Frames) {
  const imageContent = base64Frames.map(
    (frame) => ({
      type: "image_url",
      image_url: { url: `data:image/jpeg;base64,${frame}` }
    })
  );
  const response = await getClient().chat.completions.create({
    model: "Qwen/Qwen2.5-VL-7B-Instruct-AWQ",
    max_tokens: 150,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: [
          ...imageContent,
          { type: "text", text: "Analyse these sequential dashcam frames." }
        ]
      }
    ]
  });
  const text = response.choices[0]?.message?.content ?? "";
  try {
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return {
      summary: parsed.summary ?? "Unable to analyse frames",
      severity: ["info", "warning", "critical"].includes(parsed.severity) ? parsed.severity : "info"
    };
  } catch {
    return { summary: text.slice(0, 200), severity: "info" };
  }
}
async function summariseDrive(events) {
  const eventList = events.map((e) => `[${Math.floor(e.elapsedSec / 60)}:${String(e.elapsedSec % 60).padStart(2, "0")}] (${e.type}/${e.severity}) ${e.summary}`).join("\n");
  const response = await getClient().chat.completions.create({
    model: "Qwen/Qwen2.5-VL-7B-Instruct-AWQ",
    max_tokens: 500,
    messages: [
      {
        role: "system",
        content: "You summarise a driving session from event logs. Write 2-3 sentences covering: overall safety, notable incidents, and a recommendation. Be concise and constructive."
      },
      {
        role: "user",
        content: `Here are the events from this drive:

${eventList}

Summarise this drive.`
      }
    ]
  });
  return response.choices[0]?.message?.content ?? "Unable to generate summary.";
}
const cameraEnum = _enum(["front", "back"]);
const startSession = os.input(object({})).handler(async () => {
  console.log("[BeeSafe] Starting new drive session...");
  const session = await prisma.driveSession.create({ data: {} });
  console.log("[BeeSafe] Session created:", session.id);
  return { sessionId: session.id };
});
const analyseRoadFrames = os.input(
  object({
    sessionId: string(),
    elapsedSec: number().int(),
    frames: array(string()).min(1).max(5),
    camera: cameraEnum
  })
).handler(async ({ input }) => {
  try {
    const result = await analyseFrames(input.frames);
    if (result.severity !== "info") {
      console.log(`[BeeSafe] AI (${input.camera} ${input.elapsedSec}s):`, result.severity, "-", result.summary);
    }
    const event = await prisma.driveEvent.create({
      data: {
        sessionId: input.sessionId,
        type: "road_analysis",
        camera: input.camera,
        elapsedSec: input.elapsedSec,
        summary: result.summary,
        severity: result.severity,
        metadata: { frameCount: input.frames.length }
      }
    });
    return { id: event.id, summary: result.summary, severity: result.severity };
  } catch (err) {
    console.error("[BeeSafe] analyseRoadFrames ERROR:", err);
    throw err;
  }
});
const logDriverEvent = os.input(
  object({
    sessionId: string(),
    elapsedSec: number().int(),
    type: _enum(["driver_state", "crash", "harsh_braking"]),
    summary: string(),
    severity: _enum(["info", "warning", "critical"]),
    camera: cameraEnum,
    metadata: record(string(), unknown()).optional()
  })
).handler(async ({ input }) => {
  try {
    if (input.severity !== "info") {
      console.log(`[BeeSafe] ${input.type} (${input.camera}): ${input.summary}`);
    }
    const event = await prisma.driveEvent.create({
      data: {
        sessionId: input.sessionId,
        type: input.type,
        camera: input.camera,
        elapsedSec: input.elapsedSec,
        summary: input.summary,
        severity: input.severity,
        metadata: input.metadata ?? {}
      }
    });
    return { id: event.id };
  } catch (err) {
    console.error("[BeeSafe] logDriverEvent ERROR:", err);
    throw err;
  }
});
function computeScore(events) {
  let score = 100;
  for (const e of events) {
    if (e.type === "driver_state") {
      const meta = e.metadata;
      const state = meta?.state;
      if (state === "DROWSY") score -= 5;
      else if (state === "DISTRACTED") score -= 5;
      else if (state === "ASLEEP") score -= 15;
    } else if (e.type === "road_analysis") {
      if (e.severity === "warning") score -= 2;
      else if (e.severity === "critical") score -= 8;
    } else if (e.type === "crash") {
      score -= 20;
    }
  }
  return Math.max(0, Math.min(100, score));
}
const endSession = os.input(object({ sessionId: string() })).handler(async ({ input }) => {
  const events = await prisma.driveEvent.findMany({
    where: { sessionId: input.sessionId },
    orderBy: { elapsedSec: "asc" }
  });
  let summary = null;
  if (events.length > 0) {
    summary = await summariseDrive(
      events.map((e) => ({
        elapsedSec: e.elapsedSec,
        summary: e.summary,
        severity: e.severity,
        type: e.type
      }))
    );
  }
  const score = computeScore(events);
  const cameras = [...new Set(events.map((e) => e.camera))];
  console.log(`[BeeSafe] Session ended: ${events.length} events, score=${score}, cameras=${cameras.join(",")}`);
  if (summary) console.log(`[BeeSafe] AI Summary: ${summary.slice(0, 100)}...`);
  await prisma.driveSession.update({
    where: { id: input.sessionId },
    data: { endedAt: /* @__PURE__ */ new Date(), summary, score, cameras }
  });
  return { summary, score, cameras };
});
const getSession$1 = os.input(object({ sessionId: string() })).handler(async ({ input }) => {
  const session = await prisma.driveSession.findUniqueOrThrow({
    where: { id: input.sessionId },
    include: { events: { orderBy: { elapsedSec: "asc" } } }
  });
  return session;
});
const router$2 = {
  listTodos,
  addTodo,
  startSession,
  analyseRoadFrames,
  logDriverEvent,
  endSession,
  getSession: getSession$1
};
const handler$1 = new OpenAPIHandler(router$2, {
  interceptors: [
    onError((error2) => {
      console.error(error2);
    })
  ],
  plugins: [
    new SmartCoercionPlugin({
      schemaConverters: [new ZodToJsonSchemaConverter()]
    }),
    new OpenAPIReferencePlugin({
      schemaConverters: [new ZodToJsonSchemaConverter()],
      specGenerateOptions: {
        info: {
          title: "TanStack ORPC Playground",
          version: "1.0.0"
        },
        commonSchemas: {
          Todo: { schema: TodoSchema },
          UndefinedError: { error: "UndefinedError" }
        },
        security: [{ bearerAuth: [] }],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer"
            }
          }
        }
      },
      docsConfig: {
        authentication: {
          securitySchemes: {
            bearerAuth: {
              token: "default-token"
            }
          }
        }
      }
    })
  ]
});
async function handle$1({ request }) {
  const { response } = await handler$1.handle(request, {
    prefix: "/api",
    context: {}
  });
  return response ?? new Response("Not Found", { status: 404 });
}
const Route$2 = createFileRoute("/api/$")({
  server: {
    handlers: {
      HEAD: handle$1,
      GET: handle$1,
      POST: handle$1,
      PUT: handle$1,
      PATCH: handle$1,
      DELETE: handle$1
    }
  }
});
const handler = new RPCHandler(router$2);
async function handle({ request }) {
  const { response } = await handler.handle(request, {
    prefix: "/api/rpc",
    context: {}
  });
  return response ?? new Response("Not Found", { status: 404 });
}
const Route$1 = createFileRoute("/api/rpc/$")({
  server: {
    handlers: {
      HEAD: handle,
      GET: handle,
      POST: handle,
      PUT: handle,
      PATCH: handle,
      DELETE: handle
    }
  }
});
function escapeRegExpChar(char) {
  if (char === "-" || char === "^" || char === "$" || char === "+" || char === "." || char === "(" || char === ")" || char === "|" || char === "[" || char === "]" || char === "{" || char === "}" || char === "*" || char === "?" || char === "\\") return `\\${char}`;
  else return char;
}
function escapeRegExpString(str) {
  let result = "";
  for (let i = 0; i < str.length; i++) result += escapeRegExpChar(str[i]);
  return result;
}
function transform(pattern, separator = true) {
  if (Array.isArray(pattern)) return `(?:${pattern.map((p) => `^${transform(p, separator)}$`).join("|")})`;
  let separatorSplitter = "";
  let separatorMatcher = "";
  let wildcard = ".";
  if (separator === true) {
    separatorSplitter = "/";
    separatorMatcher = "[/\\\\]";
    wildcard = "[^/\\\\]";
  } else if (separator) {
    separatorSplitter = separator;
    separatorMatcher = escapeRegExpString(separatorSplitter);
    if (separatorMatcher.length > 1) {
      separatorMatcher = `(?:${separatorMatcher})`;
      wildcard = `((?!${separatorMatcher}).)`;
    } else wildcard = `[^${separatorMatcher}]`;
  }
  const requiredSeparator = separator ? `${separatorMatcher}+?` : "";
  const optionalSeparator = separator ? `${separatorMatcher}*?` : "";
  const segments = separator ? pattern.split(separatorSplitter) : [pattern];
  let result = "";
  for (let s = 0; s < segments.length; s++) {
    const segment = segments[s];
    const nextSegment = segments[s + 1];
    let currentSeparator = "";
    if (!segment && s > 0) continue;
    if (separator) if (s === segments.length - 1) currentSeparator = optionalSeparator;
    else if (nextSegment !== "**") currentSeparator = requiredSeparator;
    else currentSeparator = "";
    if (separator && segment === "**") {
      if (currentSeparator) {
        result += s === 0 ? "" : currentSeparator;
        result += `(?:${wildcard}*?${currentSeparator})*?`;
      }
      continue;
    }
    for (let c = 0; c < segment.length; c++) {
      const char = segment[c];
      if (char === "\\") {
        if (c < segment.length - 1) {
          result += escapeRegExpChar(segment[c + 1]);
          c++;
        }
      } else if (char === "?") result += wildcard;
      else if (char === "*") result += `${wildcard}*?`;
      else result += escapeRegExpChar(char);
    }
    result += currentSeparator;
  }
  return result;
}
function isMatch(regexp, sample) {
  if (typeof sample !== "string") throw new TypeError(`Sample must be a string, but ${typeof sample} given`);
  return regexp.test(sample);
}
function wildcardMatch(pattern, options) {
  if (typeof pattern !== "string" && !Array.isArray(pattern)) throw new TypeError(`The first argument must be a single pattern string or an array of patterns, but ${typeof pattern} given`);
  if (typeof options === "string" || typeof options === "boolean") options = { separator: options };
  if (arguments.length === 2 && !(typeof options === "undefined" || typeof options === "object" && options !== null && !Array.isArray(options))) throw new TypeError(`The second argument must be an options object or a string/boolean separator, but ${typeof options} given`);
  options = options || {};
  if (options.separator === "\\") throw new Error("\\ is not a valid separator because it is used for escaping. Try setting the separator to `true` instead");
  const regexpPattern = transform(pattern, options.separator);
  const regexp = new RegExp(`^${regexpPattern}$`, options.flags);
  const fn = isMatch.bind(null, regexp);
  fn.options = options;
  fn.pattern = pattern;
  fn.regexp = regexp;
  return fn;
}
function checkHasPath(url) {
  try {
    return (new URL(url).pathname.replace(/\/+$/, "") || "/") !== "/";
  } catch {
    throw new BetterAuthError(`Invalid base URL: ${url}. Please provide a valid base URL.`);
  }
}
function assertHasProtocol(url) {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") throw new BetterAuthError(`Invalid base URL: ${url}. URL must include 'http://' or 'https://'`);
  } catch (error2) {
    if (error2 instanceof BetterAuthError) throw error2;
    throw new BetterAuthError(`Invalid base URL: ${url}. Please provide a valid base URL.`, { cause: error2 });
  }
}
function withPath(url, path2 = "/api/auth") {
  assertHasProtocol(url);
  if (checkHasPath(url)) return url;
  const trimmedUrl = url.replace(/\/+$/, "");
  if (!path2 || path2 === "/") return trimmedUrl;
  path2 = path2.startsWith("/") ? path2 : `/${path2}`;
  return `${trimmedUrl}${path2}`;
}
function validateProxyHeader(header, type) {
  if (!header || header.trim() === "") return false;
  if (type === "proto") return header === "http" || header === "https";
  if (type === "host") {
    if ([
      /\.\./,
      /\0/,
      /[\s]/,
      /^[.]/,
      /[<>'"]/,
      /javascript:/i,
      /file:/i,
      /data:/i
    ].some((pattern) => pattern.test(header))) return false;
    return /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*(:[0-9]{1,5})?$/.test(header) || /^(\d{1,3}\.){3}\d{1,3}(:[0-9]{1,5})?$/.test(header) || /^\[[0-9a-fA-F:]+\](:[0-9]{1,5})?$/.test(header) || /^localhost(:[0-9]{1,5})?$/i.test(header);
  }
  return false;
}
function getBaseURL(url, path2, request, loadEnv, trustedProxyHeaders) {
  if (url) return withPath(url, path2);
  {
    const fromEnv = env.BETTER_AUTH_URL || env.NEXT_PUBLIC_BETTER_AUTH_URL || env.PUBLIC_BETTER_AUTH_URL || env.NUXT_PUBLIC_BETTER_AUTH_URL || env.NUXT_PUBLIC_AUTH_URL || (env.BASE_URL !== "/" ? env.BASE_URL : void 0);
    if (fromEnv) return withPath(fromEnv, path2);
  }
  const fromRequest = request?.headers.get("x-forwarded-host");
  const fromRequestProto = request?.headers.get("x-forwarded-proto");
  if (fromRequest && fromRequestProto && trustedProxyHeaders) {
    if (validateProxyHeader(fromRequestProto, "proto") && validateProxyHeader(fromRequest, "host")) try {
      return withPath(`${fromRequestProto}://${fromRequest}`, path2);
    } catch (_error) {
    }
  }
  if (request) {
    const url2 = getOrigin(request.url);
    if (!url2) throw new BetterAuthError("Could not get origin from request. Please provide a valid base URL.");
    return withPath(url2, path2);
  }
  if (typeof window !== "undefined" && window.location) return withPath(window.location.origin, path2);
}
function getOrigin(url) {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.origin === "null" ? null : parsedUrl.origin;
  } catch {
    return null;
  }
}
function getProtocol(url) {
  try {
    return new URL(url).protocol;
  } catch {
    return null;
  }
}
function getHost(url) {
  try {
    return new URL(url).host;
  } catch {
    return null;
  }
}
function isDynamicBaseURLConfig(config2) {
  return typeof config2 === "object" && config2 !== null && "allowedHosts" in config2 && Array.isArray(config2.allowedHosts);
}
function getHostFromRequest(request) {
  const forwardedHost = request.headers.get("x-forwarded-host");
  if (forwardedHost && validateProxyHeader(forwardedHost, "host")) return forwardedHost;
  const host = request.headers.get("host");
  if (host && validateProxyHeader(host, "host")) return host;
  try {
    return new URL(request.url).host;
  } catch {
    return null;
  }
}
function getProtocolFromRequest(request, configProtocol) {
  if (configProtocol === "http" || configProtocol === "https") return configProtocol;
  const forwardedProto = request.headers.get("x-forwarded-proto");
  if (forwardedProto && validateProxyHeader(forwardedProto, "proto")) return forwardedProto;
  try {
    const url = new URL(request.url);
    if (url.protocol === "http:" || url.protocol === "https:") return url.protocol.slice(0, -1);
  } catch {
  }
  return "https";
}
const matchesHostPattern = (host, pattern) => {
  if (!host || !pattern) return false;
  const normalizedHost = host.replace(/^https?:\/\//, "").split("/")[0].toLowerCase();
  const normalizedPattern = pattern.replace(/^https?:\/\//, "").split("/")[0].toLowerCase();
  if (normalizedPattern.includes("*") || normalizedPattern.includes("?")) return wildcardMatch(normalizedPattern)(normalizedHost);
  return normalizedHost.toLowerCase() === normalizedPattern.toLowerCase();
};
function resolveDynamicBaseURL(config2, request, basePath) {
  const host = getHostFromRequest(request);
  if (!host) {
    if (config2.fallback) return withPath(config2.fallback, basePath);
    throw new BetterAuthError("Could not determine host from request headers. Please provide a fallback URL in your baseURL config.");
  }
  if (config2.allowedHosts.some((pattern) => matchesHostPattern(host, pattern))) return withPath(`${getProtocolFromRequest(request, config2.protocol)}://${host}`, basePath);
  if (config2.fallback) return withPath(config2.fallback, basePath);
  throw new BetterAuthError(`Host "${host}" is not in the allowed hosts list. Allowed hosts: ${config2.allowedHosts.join(", ")}. Add this host to your allowedHosts config or provide a fallback URL.`);
}
function resolveBaseURL(config2, basePath, request, loadEnv, trustedProxyHeaders) {
  if (isDynamicBaseURLConfig(config2)) {
    if (request) return resolveDynamicBaseURL(config2, request, basePath);
    if (config2.fallback) return withPath(config2.fallback, basePath);
    return getBaseURL(void 0, basePath, request, loadEnv, trustedProxyHeaders);
  }
  if (typeof config2 === "string") return getBaseURL(config2, basePath, request, loadEnv, trustedProxyHeaders);
  return getBaseURL(void 0, basePath, request, loadEnv, trustedProxyHeaders);
}
const generateRandomString = createRandomStringGenerator("a-z", "0-9", "A-Z", "-_");
function constantTimeEqual(a, b) {
  if (typeof a === "string") a = new TextEncoder().encode(a);
  if (typeof b === "string") b = new TextEncoder().encode(b);
  const aBuffer = new Uint8Array(a);
  const bBuffer = new Uint8Array(b);
  let c = aBuffer.length ^ bBuffer.length;
  const length = Math.max(aBuffer.length, bBuffer.length);
  for (let i = 0; i < length; i++) c |= (i < aBuffer.length ? aBuffer[i] : 0) ^ (i < bBuffer.length ? bBuffer[i] : 0);
  return c === 0;
}
async function signJWT(payload, secret, expiresIn = 3600) {
  return await new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime(Math.floor(Date.now() / 1e3) + expiresIn).sign(new TextEncoder().encode(secret));
}
async function verifyJWT(token, secret) {
  try {
    return (await jwtVerify(token, new TextEncoder().encode(secret))).payload;
  } catch {
    return null;
  }
}
const info = new Uint8Array([
  66,
  101,
  116,
  116,
  101,
  114,
  65,
  117,
  116,
  104,
  46,
  106,
  115,
  32,
  71,
  101,
  110,
  101,
  114,
  97,
  116,
  101,
  100,
  32,
  69,
  110,
  99,
  114,
  121,
  112,
  116,
  105,
  111,
  110,
  32,
  75,
  101,
  121
]);
const now = () => Date.now() / 1e3 | 0;
const alg = "dir";
const enc = "A256CBC-HS512";
function deriveEncryptionSecret(secret, salt) {
  return hkdf(sha256$1, new TextEncoder().encode(secret), new TextEncoder().encode(salt), info, 64);
}
function getCurrentSecret(secret) {
  if (typeof secret === "string") return secret;
  const value = secret.keys.get(secret.currentVersion);
  if (!value) throw new Error(`Secret version ${secret.currentVersion} not found in keys`);
  return value;
}
function getAllSecrets(secret) {
  if (typeof secret === "string") return [{
    version: 0,
    value: secret
  }];
  const result = [];
  for (const [version, value] of secret.keys) result.push({
    version,
    value
  });
  if (secret.legacySecret && !result.some((s) => s.value === secret.legacySecret)) result.push({
    version: -1,
    value: secret.legacySecret
  });
  return result;
}
async function symmetricEncodeJWT(payload, secret, salt, expiresIn = 3600) {
  const encryptionSecret = deriveEncryptionSecret(getCurrentSecret(secret), salt);
  const thumbprint = await calculateJwkThumbprint({
    kty: "oct",
    k: encode(encryptionSecret)
  }, "sha256");
  return await new EncryptJWT(payload).setProtectedHeader({
    alg,
    enc,
    kid: thumbprint
  }).setIssuedAt().setExpirationTime(now() + expiresIn).setJti(crypto.randomUUID()).encrypt(encryptionSecret);
}
const jwtDecryptOpts = {
  clockTolerance: 15,
  keyManagementAlgorithms: [alg],
  contentEncryptionAlgorithms: [enc, "A256GCM"]
};
async function symmetricDecodeJWT(token, secret, salt) {
  if (!token) return null;
  let hasKid = false;
  try {
    hasKid = decodeProtectedHeader(token).kid !== void 0;
  } catch {
    return null;
  }
  try {
    const secrets = getAllSecrets(secret);
    const { payload } = await jwtDecrypt(token, async (protectedHeader) => {
      const kid = protectedHeader.kid;
      if (kid !== void 0) {
        for (const s of secrets) {
          const encryptionSecret = deriveEncryptionSecret(s.value, salt);
          if (kid === await calculateJwkThumbprint({
            kty: "oct",
            k: encode(encryptionSecret)
          }, "sha256")) return encryptionSecret;
        }
        throw new Error("no matching decryption secret");
      }
      if (secrets.length === 1) return deriveEncryptionSecret(secrets[0].value, salt);
      return deriveEncryptionSecret(secrets[0].value, salt);
    }, jwtDecryptOpts);
    return payload;
  } catch {
    if (hasKid) return null;
    const secrets = getAllSecrets(secret);
    if (secrets.length <= 1) return null;
    for (let i = 1; i < secrets.length; i++) try {
      const s = secrets[i];
      const { payload } = await jwtDecrypt(token, deriveEncryptionSecret(s.value, salt), jwtDecryptOpts);
      return payload;
    } catch {
      continue;
    }
    return null;
  }
}
const config = {
  N: 16384,
  r: 16,
  p: 1,
  dkLen: 64
};
async function generateKey(password, salt) {
  return await scryptAsync(password.normalize("NFKC"), salt, {
    N: config.N,
    p: config.p,
    r: config.r,
    dkLen: config.dkLen,
    maxmem: 128 * config.N * config.r * 2
  });
}
const hashPassword = async (password) => {
  const salt = hex$1.encode(crypto.getRandomValues(new Uint8Array(16)));
  const key = await generateKey(password, salt);
  return `${salt}:${hex$1.encode(key)}`;
};
const verifyPassword$1 = async ({ hash, password }) => {
  const [salt, key] = hash.split(":");
  if (!salt || !key) throw new BetterAuthError("Invalid password hash");
  return constantTimeEqual(await generateKey(password, salt), hexToBytes(key));
};
const ENVELOPE_PREFIX = "$ba$";
function parseEnvelope(data) {
  if (!data.startsWith(ENVELOPE_PREFIX)) return null;
  const firstSep = 4;
  const secondSep = data.indexOf("$", firstSep);
  if (secondSep === -1) return null;
  const version = parseInt(data.slice(firstSep, secondSep), 10);
  if (!Number.isInteger(version) || version < 0) return null;
  return {
    version,
    ciphertext: data.slice(secondSep + 1)
  };
}
function formatEnvelope(version, ciphertext) {
  return `${ENVELOPE_PREFIX}${version}$${ciphertext}`;
}
async function rawEncrypt(secret, data) {
  const keyAsBytes = await createHash("SHA-256").digest(secret);
  const dataAsBytes = utf8ToBytes(data);
  return bytesToHex(managedNonce(xchacha20poly1305)(new Uint8Array(keyAsBytes)).encrypt(dataAsBytes));
}
async function rawDecrypt(secret, hex2) {
  const keyAsBytes = await createHash("SHA-256").digest(secret);
  const dataAsBytes = hexToBytes$1(hex2);
  const chacha = managedNonce(xchacha20poly1305)(new Uint8Array(keyAsBytes));
  return new TextDecoder().decode(chacha.decrypt(dataAsBytes));
}
const symmetricEncrypt = async ({ key, data }) => {
  if (typeof key === "string") return rawEncrypt(key, data);
  const secret = key.keys.get(key.currentVersion);
  if (!secret) throw new Error(`Secret version ${key.currentVersion} not found in keys`);
  const ciphertext = await rawEncrypt(secret, data);
  return formatEnvelope(key.currentVersion, ciphertext);
};
const symmetricDecrypt = async ({ key, data }) => {
  if (typeof key === "string") return rawDecrypt(key, data);
  const envelope = parseEnvelope(data);
  if (envelope) {
    const secret = key.keys.get(envelope.version);
    if (!secret) throw new Error(`Secret version ${envelope.version} not found in keys (key may have been retired)`);
    return rawDecrypt(secret, envelope.ciphertext);
  }
  if (key.legacySecret) return rawDecrypt(key.legacySecret, data);
  throw new Error("Cannot decrypt legacy bare-hex payload: no legacy secret available. Set BETTER_AUTH_SECRET for backwards compatibility.");
};
const getDate = (span, unit = "ms") => {
  return new Date(Date.now() + (unit === "sec" ? span * 1e3 : span));
};
const cache = /* @__PURE__ */ new WeakMap();
function getFields(options, modelName, mode) {
  const cacheKey = `${modelName}:${mode}`;
  if (!cache.has(options)) cache.set(options, /* @__PURE__ */ new Map());
  const tableCache = cache.get(options);
  if (tableCache.has(cacheKey)) return tableCache.get(cacheKey);
  const coreSchema = mode === "output" ? getAuthTables(options)[modelName]?.fields ?? {} : {};
  const additionalFields = modelName === "user" || modelName === "session" || modelName === "account" ? options[modelName]?.additionalFields : void 0;
  let schema2 = {
    ...coreSchema,
    ...additionalFields ?? {}
  };
  for (const plugin of options.plugins || []) if (plugin.schema && plugin.schema[modelName]) schema2 = {
    ...schema2,
    ...plugin.schema[modelName].fields
  };
  tableCache.set(cacheKey, schema2);
  return schema2;
}
function parseUserOutput(options, user) {
  return filterOutputFields(user, getFields(options, "user", "output"));
}
function parseSessionOutput(options, session) {
  return filterOutputFields(session, getFields(options, "session", "output"));
}
function parseAccountOutput(options, account) {
  const { accessToken: _accessToken, refreshToken: _refreshToken, idToken: _idToken, accessTokenExpiresAt: _accessTokenExpiresAt, refreshTokenExpiresAt: _refreshTokenExpiresAt, password: _password, ...rest } = filterOutputFields(account, getFields(options, "account", "output"));
  return rest;
}
function parseInputData(data, schema2) {
  const action = schema2.action || "create";
  const fields = schema2.fields;
  const parsedData = /* @__PURE__ */ Object.create(null);
  for (const key in fields) {
    if (key in data) {
      if (fields[key].input === false) {
        if (fields[key].defaultValue !== void 0) {
          if (action !== "update") {
            parsedData[key] = fields[key].defaultValue;
            continue;
          }
        }
        if (data[key]) throw APIError.from("BAD_REQUEST", {
          ...BASE_ERROR_CODES.FIELD_NOT_ALLOWED,
          message: `${key} is not allowed to be set`
        });
        continue;
      }
      if (fields[key].validator?.input && data[key] !== void 0) {
        const result = fields[key].validator.input["~standard"].validate(data[key]);
        if (result instanceof Promise) throw APIError.from("INTERNAL_SERVER_ERROR", BASE_ERROR_CODES.ASYNC_VALIDATION_NOT_SUPPORTED);
        if ("issues" in result && result.issues) throw APIError.from("BAD_REQUEST", {
          ...BASE_ERROR_CODES.VALIDATION_ERROR,
          message: result.issues[0]?.message || "Validation Error"
        });
        parsedData[key] = result.value;
        continue;
      }
      if (fields[key].transform?.input && data[key] !== void 0) {
        parsedData[key] = fields[key].transform?.input(data[key]);
        continue;
      }
      parsedData[key] = data[key];
      continue;
    }
    if (fields[key].defaultValue !== void 0 && action === "create") {
      if (typeof fields[key].defaultValue === "function") {
        parsedData[key] = fields[key].defaultValue();
        continue;
      }
      parsedData[key] = fields[key].defaultValue;
      continue;
    }
    if (fields[key].required && action === "create") throw APIError.from("BAD_REQUEST", {
      ...BASE_ERROR_CODES.MISSING_FIELD,
      message: `${key} is required`
    });
  }
  return parsedData;
}
function parseUserInput(options, user = {}, action) {
  return parseInputData(user, {
    fields: getFields(options, "user", "input"),
    action
  });
}
function parseAdditionalUserInput(options, user) {
  const schema2 = getFields(options, "user", "input");
  return parseInputData(user || {}, { fields: schema2 });
}
function parseAccountInput(options, account) {
  return parseInputData(account, { fields: getFields(options, "account", "input") });
}
function parseSessionInput(options, session, action) {
  return parseInputData(session, {
    fields: getFields(options, "session", "input"),
    action
  });
}
function getSessionDefaultFields(options) {
  const fields = getFields(options, "session", "input");
  const defaults = {};
  for (const key in fields) if (fields[key].defaultValue !== void 0) defaults[key] = typeof fields[key].defaultValue === "function" ? fields[key].defaultValue() : fields[key].defaultValue;
  return defaults;
}
function mergeSchema(schema2, newSchema) {
  if (!newSchema) return schema2;
  for (const table in newSchema) {
    const newModelName = newSchema[table]?.modelName;
    if (newModelName) schema2[table].modelName = newModelName;
    for (const field in schema2[table].fields) {
      const newField = newSchema[table]?.fields?.[field];
      if (!newField) continue;
      schema2[table].fields[field].fieldName = newField;
    }
  }
  return schema2;
}
function isPromise(obj) {
  return !!obj && (typeof obj === "object" || typeof obj === "function") && typeof obj.then === "function";
}
const ALLOWED_COOKIE_SIZE = 4096;
const ESTIMATED_EMPTY_COOKIE_SIZE = 200;
const CHUNK_SIZE = ALLOWED_COOKIE_SIZE - ESTIMATED_EMPTY_COOKIE_SIZE;
function parseCookiesFromContext(ctx) {
  const cookieHeader = ctx.headers?.get("cookie");
  if (!cookieHeader) return {};
  const cookies = {};
  const pairs = cookieHeader.split("; ");
  for (const pair of pairs) {
    const [name, ...valueParts] = pair.split("=");
    if (name && valueParts.length > 0) cookies[name] = valueParts.join("=");
  }
  return cookies;
}
function getChunkIndex(cookieName) {
  const parts = cookieName.split(".");
  const lastPart = parts[parts.length - 1];
  const index = parseInt(lastPart || "0", 10);
  return isNaN(index) ? 0 : index;
}
function readExistingChunks(cookieName, ctx) {
  const chunks = {};
  const cookies = parseCookiesFromContext(ctx);
  for (const [name, value] of Object.entries(cookies)) if (name.startsWith(cookieName)) chunks[name] = value;
  return chunks;
}
function joinChunks(chunks) {
  return Object.keys(chunks).sort((a, b) => {
    return getChunkIndex(a) - getChunkIndex(b);
  }).map((key) => chunks[key]).join("");
}
function chunkCookie(storeName, cookie, chunks, logger2) {
  const chunkCount = Math.ceil(cookie.value.length / CHUNK_SIZE);
  if (chunkCount === 1) {
    chunks[cookie.name] = cookie.value;
    return [cookie];
  }
  const cookies = [];
  for (let i = 0; i < chunkCount; i++) {
    const name = `${cookie.name}.${i}`;
    const start = i * CHUNK_SIZE;
    const value = cookie.value.substring(start, start + CHUNK_SIZE);
    cookies.push({
      ...cookie,
      name,
      value
    });
    chunks[name] = value;
  }
  logger2.debug(`CHUNKING_${storeName.toUpperCase()}_COOKIE`, {
    message: `${storeName} cookie exceeds allowed ${ALLOWED_COOKIE_SIZE} bytes.`,
    emptyCookieSize: ESTIMATED_EMPTY_COOKIE_SIZE,
    valueSize: cookie.value.length,
    chunkCount,
    chunks: cookies.map((c) => c.value.length + ESTIMATED_EMPTY_COOKIE_SIZE)
  });
  return cookies;
}
function getCleanCookies(chunks, cookieOptions) {
  const cleanedChunks = {};
  for (const name in chunks) cleanedChunks[name] = {
    name,
    value: "",
    attributes: {
      ...cookieOptions,
      maxAge: 0
    }
  };
  return cleanedChunks;
}
const storeFactory = (storeName) => (cookieName, cookieOptions, ctx) => {
  const chunks = readExistingChunks(cookieName, ctx);
  const logger2 = ctx.context.logger;
  return {
    getValue() {
      return joinChunks(chunks);
    },
    hasChunks() {
      return Object.keys(chunks).length > 0;
    },
    chunk(value, options) {
      const cleanedChunks = getCleanCookies(chunks, cookieOptions);
      for (const name in chunks) delete chunks[name];
      const cookies = cleanedChunks;
      const chunked = chunkCookie(storeName, {
        name: cookieName,
        value,
        attributes: {
          ...cookieOptions,
          ...options
        }
      }, chunks, logger2);
      for (const chunk of chunked) cookies[chunk.name] = chunk;
      return Object.values(cookies);
    },
    clean() {
      const cleanedChunks = getCleanCookies(chunks, cookieOptions);
      for (const name in chunks) delete chunks[name];
      return Object.values(cleanedChunks);
    },
    setCookies(cookies) {
      for (const cookie of cookies) ctx.setCookie(cookie.name, cookie.value, cookie.attributes);
    }
  };
};
const createSessionStore = storeFactory("Session");
const createAccountStore = storeFactory("Account");
function getChunkedCookie(ctx, cookieName) {
  const value = ctx.getCookie(cookieName);
  if (value) return value;
  const chunks = [];
  const cookieHeader = ctx.headers?.get("cookie");
  if (!cookieHeader) return null;
  const cookies = {};
  const pairs = cookieHeader.split("; ");
  for (const pair of pairs) {
    const [name, ...valueParts] = pair.split("=");
    if (name && valueParts.length > 0) cookies[name] = valueParts.join("=");
  }
  for (const [name, val] of Object.entries(cookies)) if (name.startsWith(cookieName + ".")) {
    const indexStr = name.split(".").at(-1);
    const index = parseInt(indexStr || "0", 10);
    if (!isNaN(index)) chunks.push({
      index,
      value: val
    });
  }
  if (chunks.length > 0) {
    chunks.sort((a, b) => a.index - b.index);
    return chunks.map((c) => c.value).join("");
  }
  return null;
}
async function setAccountCookie(c, accountData) {
  const accountDataCookie = c.context.authCookies.accountData;
  const options = {
    maxAge: 300,
    ...accountDataCookie.attributes
  };
  const data = await symmetricEncodeJWT(accountData, c.context.secretConfig, "better-auth-account", options.maxAge);
  if (data.length > ALLOWED_COOKIE_SIZE) {
    const accountStore = createAccountStore(accountDataCookie.name, options, c);
    const cookies = accountStore.chunk(data, options);
    accountStore.setCookies(cookies);
  } else {
    const accountStore = createAccountStore(accountDataCookie.name, options, c);
    if (accountStore.hasChunks()) {
      const cleanCookies = accountStore.clean();
      accountStore.setCookies(cleanCookies);
    }
    c.setCookie(accountDataCookie.name, data, options);
  }
}
async function getAccountCookie(c) {
  const accountCookie = getChunkedCookie(c, c.context.authCookies.accountData.name);
  if (accountCookie) {
    const accountData = safeJSONParse(await symmetricDecodeJWT(accountCookie, c.context.secretConfig, "better-auth-account"));
    if (accountData) return accountData;
  }
  return null;
}
const getSessionQuerySchema = optional(object({
  disableCookieCache: boolean$1().meta({ description: "Disable cookie cache and fetch session from database" }).optional(),
  disableRefresh: boolean$1().meta({ description: "Disable session refresh. Useful for checking session status, without updating the session" }).optional()
}));
const SEC = 1e3;
const MIN = SEC * 60;
const HOUR = MIN * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;
const MONTH = DAY * 30;
const YEAR = DAY * 365.25;
const REGEX = /^(\+|\-)? ?(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|months?|mo|years?|yrs?|y)(?: (ago|from now))?$/i;
function parse(value) {
  const match = REGEX.exec(value);
  if (!match || match[4] && match[1]) throw new TypeError(`Invalid time string format: "${value}". Use formats like "7d", "30m", "1 hour", etc.`);
  const n = parseFloat(match[2]);
  const unit = match[3].toLowerCase();
  let result;
  switch (unit) {
    case "years":
    case "year":
    case "yrs":
    case "yr":
    case "y":
      result = n * YEAR;
      break;
    case "months":
    case "month":
    case "mo":
      result = n * MONTH;
      break;
    case "weeks":
    case "week":
    case "w":
      result = n * WEEK;
      break;
    case "days":
    case "day":
    case "d":
      result = n * DAY;
      break;
    case "hours":
    case "hour":
    case "hrs":
    case "hr":
    case "h":
      result = n * HOUR;
      break;
    case "minutes":
    case "minute":
    case "mins":
    case "min":
    case "m":
      result = n * MIN;
      break;
    case "seconds":
    case "second":
    case "secs":
    case "sec":
    case "s":
      result = n * SEC;
      break;
    default:
      throw new TypeError(`Unknown time unit: "${unit}"`);
  }
  if (match[1] === "-" || match[4] === "ago") return -result;
  return result;
}
function sec(value) {
  return Math.round(parse(value) / 1e3);
}
function tryDecode(str) {
  try {
    return decodeURIComponent(str);
  } catch {
    return str;
  }
}
const SECURE_COOKIE_PREFIX = "__Secure-";
function splitSetCookieHeader(setCookie) {
  if (!setCookie) return [];
  const result = [];
  let start = 0;
  let i = 0;
  while (i < setCookie.length) {
    if (setCookie[i] === ",") {
      let j = i + 1;
      while (j < setCookie.length && setCookie[j] === " ") j++;
      while (j < setCookie.length && setCookie[j] !== "=" && setCookie[j] !== ";" && setCookie[j] !== ",") j++;
      if (j < setCookie.length && setCookie[j] === "=") {
        const part = setCookie.slice(start, i).trim();
        if (part) result.push(part);
        start = i + 1;
        while (start < setCookie.length && setCookie[start] === " ") start++;
        i = start;
        continue;
      }
    }
    i++;
  }
  const last = setCookie.slice(start).trim();
  if (last) result.push(last);
  return result;
}
function parseSetCookieHeader(setCookie) {
  const cookies = /* @__PURE__ */ new Map();
  splitSetCookieHeader(setCookie).forEach((cookieString) => {
    const [nameValue, ...attributes] = cookieString.split(";").map((part) => part.trim());
    const [name, ...valueParts] = (nameValue || "").split("=");
    const value = valueParts.join("=");
    if (!name || value === void 0) return;
    const attrObj = { value: value.includes("%") ? tryDecode(value) : value };
    attributes.forEach((attribute) => {
      const [attrName, ...attrValueParts] = attribute.split("=");
      const attrValue = attrValueParts.join("=");
      const normalizedAttrName = attrName.trim().toLowerCase();
      switch (normalizedAttrName) {
        case "max-age":
          attrObj["max-age"] = attrValue ? parseInt(attrValue.trim(), 10) : void 0;
          break;
        case "expires":
          attrObj.expires = attrValue ? new Date(attrValue.trim()) : void 0;
          break;
        case "domain":
          attrObj.domain = attrValue ? attrValue.trim() : void 0;
          break;
        case "path":
          attrObj.path = attrValue ? attrValue.trim() : void 0;
          break;
        case "secure":
          attrObj.secure = true;
          break;
        case "httponly":
          attrObj.httponly = true;
          break;
        case "samesite":
          attrObj.samesite = attrValue ? attrValue.trim().toLowerCase() : void 0;
          break;
        default:
          attrObj[normalizedAttrName] = attrValue ? attrValue.trim() : true;
          break;
      }
    });
    cookies.set(name, attrObj);
  });
  return cookies;
}
function createCookieGetter(options) {
  const baseURLString = typeof options.baseURL === "string" ? options.baseURL : void 0;
  const dynamicProtocol = typeof options.baseURL === "object" && options.baseURL !== null ? options.baseURL.protocol : void 0;
  const secureCookiePrefix = (options.advanced?.useSecureCookies !== void 0 ? options.advanced?.useSecureCookies : dynamicProtocol === "https" ? true : dynamicProtocol === "http" ? false : baseURLString ? baseURLString.startsWith("https://") : isProduction) ? SECURE_COOKIE_PREFIX : "";
  const crossSubdomainEnabled = !!options.advanced?.crossSubDomainCookies?.enabled;
  const domain = crossSubdomainEnabled ? options.advanced?.crossSubDomainCookies?.domain || (baseURLString ? new URL(baseURLString).hostname : void 0) : void 0;
  if (crossSubdomainEnabled && !domain && !isDynamicBaseURLConfig(options.baseURL)) throw new BetterAuthError("baseURL is required when crossSubdomainCookies are enabled.");
  function createCookie(cookieName, overrideAttributes = {}) {
    const prefix = options.advanced?.cookiePrefix || "better-auth";
    const name = options.advanced?.cookies?.[cookieName]?.name || `${prefix}.${cookieName}`;
    const attributes = options.advanced?.cookies?.[cookieName]?.attributes ?? {};
    return {
      name: `${secureCookiePrefix}${name}`,
      attributes: {
        secure: !!secureCookiePrefix,
        sameSite: "lax",
        path: "/",
        httpOnly: true,
        ...crossSubdomainEnabled ? { domain } : {},
        ...options.advanced?.defaultCookieAttributes,
        ...overrideAttributes,
        ...attributes
      }
    };
  }
  return createCookie;
}
function getCookies(options) {
  const createCookie = createCookieGetter(options);
  const sessionToken = createCookie("session_token", { maxAge: options.session?.expiresIn || sec("7d") });
  const sessionData = createCookie("session_data", { maxAge: options.session?.cookieCache?.maxAge || 300 });
  const accountData = createCookie("account_data", { maxAge: options.session?.cookieCache?.maxAge || 300 });
  const dontRememberToken = createCookie("dont_remember");
  return {
    sessionToken: {
      name: sessionToken.name,
      attributes: sessionToken.attributes
    },
    sessionData: {
      name: sessionData.name,
      attributes: sessionData.attributes
    },
    dontRememberToken: {
      name: dontRememberToken.name,
      attributes: dontRememberToken.attributes
    },
    accountData: {
      name: accountData.name,
      attributes: accountData.attributes
    }
  };
}
async function setCookieCache(ctx, session, dontRememberMe) {
  if (!ctx.context.options.session?.cookieCache?.enabled) return;
  const filteredSession = filterOutputFields(session.session, ctx.context.options.session?.additionalFields);
  const filteredUser = parseUserOutput(ctx.context.options, session.user);
  const versionConfig = ctx.context.options.session?.cookieCache?.version;
  let version = "1";
  if (versionConfig) {
    if (typeof versionConfig === "string") version = versionConfig;
    else if (typeof versionConfig === "function") {
      const result = versionConfig(session.session, session.user);
      version = isPromise(result) ? await result : result;
    }
  }
  const sessionData = {
    session: filteredSession,
    user: filteredUser,
    updatedAt: Date.now(),
    version
  };
  const options = {
    ...ctx.context.authCookies.sessionData.attributes,
    maxAge: dontRememberMe ? void 0 : ctx.context.authCookies.sessionData.attributes.maxAge
  };
  const expiresAtDate = getDate(options.maxAge || 60, "sec").getTime();
  const strategy = ctx.context.options.session?.cookieCache?.strategy || "compact";
  let data;
  if (strategy === "jwe") data = await symmetricEncodeJWT(sessionData, ctx.context.secretConfig, "better-auth-session", options.maxAge || 300);
  else if (strategy === "jwt") data = await signJWT(sessionData, ctx.context.secret, options.maxAge || 300);
  else data = base64Url.encode(JSON.stringify({
    session: sessionData,
    expiresAt: expiresAtDate,
    signature: await createHMAC("SHA-256", "base64urlnopad").sign(ctx.context.secret, JSON.stringify({
      ...sessionData,
      expiresAt: expiresAtDate
    }))
  }), { padding: false });
  if (data.length > 4093) {
    const sessionStore = createSessionStore(ctx.context.authCookies.sessionData.name, options, ctx);
    const cookies = sessionStore.chunk(data, options);
    sessionStore.setCookies(cookies);
  } else {
    const sessionStore = createSessionStore(ctx.context.authCookies.sessionData.name, options, ctx);
    if (sessionStore.hasChunks()) {
      const cleanCookies = sessionStore.clean();
      sessionStore.setCookies(cleanCookies);
    }
    ctx.setCookie(ctx.context.authCookies.sessionData.name, data, options);
  }
  if (ctx.context.options.account?.storeAccountCookie) {
    const accountData = await getAccountCookie(ctx);
    if (accountData) await setAccountCookie(ctx, accountData);
  }
}
async function setSessionCookie(ctx, session, dontRememberMe, overrides) {
  const dontRememberMeCookie = await ctx.getSignedCookie(ctx.context.authCookies.dontRememberToken.name, ctx.context.secret);
  dontRememberMe = dontRememberMe !== void 0 ? dontRememberMe : !!dontRememberMeCookie;
  const options = ctx.context.authCookies.sessionToken.attributes;
  const maxAge = dontRememberMe ? void 0 : ctx.context.sessionConfig.expiresIn;
  await ctx.setSignedCookie(ctx.context.authCookies.sessionToken.name, session.session.token, ctx.context.secret, {
    ...options,
    maxAge,
    ...overrides
  });
  if (dontRememberMe) await ctx.setSignedCookie(ctx.context.authCookies.dontRememberToken.name, "true", ctx.context.secret, ctx.context.authCookies.dontRememberToken.attributes);
  await setCookieCache(ctx, session, dontRememberMe);
  ctx.context.setNewSession(session);
}
function expireCookie(ctx, cookie) {
  ctx.setCookie(cookie.name, "", {
    ...cookie.attributes,
    maxAge: 0
  });
}
function deleteSessionCookie(ctx, skipDontRememberMe) {
  expireCookie(ctx, ctx.context.authCookies.sessionToken);
  expireCookie(ctx, ctx.context.authCookies.sessionData);
  if (ctx.context.options.account?.storeAccountCookie) {
    expireCookie(ctx, ctx.context.authCookies.accountData);
    const accountStore = createAccountStore(ctx.context.authCookies.accountData.name, ctx.context.authCookies.accountData.attributes, ctx);
    const cleanCookies2 = accountStore.clean();
    accountStore.setCookies(cleanCookies2);
  }
  if (ctx.context.oauthConfig.storeStateStrategy === "cookie") expireCookie(ctx, ctx.context.createAuthCookie("oauth_state"));
  const sessionStore = createSessionStore(ctx.context.authCookies.sessionData.name, ctx.context.authCookies.sessionData.attributes, ctx);
  const cleanCookies = sessionStore.clean();
  sessionStore.setCookies(cleanCookies);
  expireCookie(ctx, ctx.context.authCookies.dontRememberToken);
}
const stateDataSchema = looseObject({
  callbackURL: string(),
  codeVerifier: string(),
  errorURL: string().optional(),
  newUserURL: string().optional(),
  expiresAt: number(),
  link: object({
    email: string(),
    userId: string$1()
  }).optional(),
  requestSignUp: boolean().optional()
});
var StateError = class extends BetterAuthError {
  code;
  details;
  constructor(message, options) {
    super(message, options);
    this.code = options.code;
    this.details = options.details;
  }
};
async function generateGenericState(c, stateData, settings) {
  const state = generateRandomString(32);
  if (c.context.oauthConfig.storeStateStrategy === "cookie") {
    const encryptedData = await symmetricEncrypt({
      key: c.context.secretConfig,
      data: JSON.stringify(stateData)
    });
    const stateCookie2 = c.context.createAuthCookie("oauth_state", { maxAge: 600 });
    c.setCookie(stateCookie2.name, encryptedData, stateCookie2.attributes);
    return {
      state,
      codeVerifier: stateData.codeVerifier
    };
  }
  const stateCookie = c.context.createAuthCookie("state", { maxAge: 300 });
  await c.setSignedCookie(stateCookie.name, state, c.context.secret, stateCookie.attributes);
  const expiresAt = /* @__PURE__ */ new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 10);
  const verification = await c.context.internalAdapter.createVerificationValue({
    value: JSON.stringify(stateData),
    identifier: state,
    expiresAt
  });
  if (!verification) throw new StateError("Unable to create verification. Make sure the database adapter is properly working and there is a verification table in the database", { code: "state_generation_error" });
  return {
    state: verification.identifier,
    codeVerifier: stateData.codeVerifier
  };
}
async function parseGenericState(c, state, settings) {
  const storeStateStrategy = c.context.oauthConfig.storeStateStrategy;
  let parsedData;
  if (storeStateStrategy === "cookie") {
    const stateCookie = c.context.createAuthCookie("oauth_state");
    const encryptedData = c.getCookie(stateCookie.name);
    if (!encryptedData) throw new StateError("State mismatch: auth state cookie not found", {
      code: "state_mismatch",
      details: { state }
    });
    try {
      const decryptedData = await symmetricDecrypt({
        key: c.context.secretConfig,
        data: encryptedData
      });
      parsedData = stateDataSchema.parse(JSON.parse(decryptedData));
    } catch (error2) {
      throw new StateError("State invalid: Failed to decrypt or parse auth state", {
        code: "state_invalid",
        details: { state },
        cause: error2
      });
    }
    expireCookie(c, stateCookie);
  } else {
    const data = await c.context.internalAdapter.findVerificationValue(state);
    if (!data) throw new StateError("State mismatch: verification not found", {
      code: "state_mismatch",
      details: { state }
    });
    parsedData = stateDataSchema.parse(JSON.parse(data.value));
    const stateCookie = c.context.createAuthCookie("state");
    const stateCookieValue = await c.getSignedCookie(stateCookie.name, c.context.secret);
    if (!c.context.oauthConfig.skipStateCookieCheck && (!stateCookieValue || stateCookieValue !== state)) throw new StateError("State mismatch: State not persisted correctly", {
      code: "state_security_mismatch",
      details: { state }
    });
    expireCookie(c, stateCookie);
    await c.context.internalAdapter.deleteVerificationByIdentifier(state);
  }
  if (parsedData.expiresAt < Date.now()) throw new StateError("Invalid state: request expired", {
    code: "state_mismatch",
    details: { expiresAt: parsedData.expiresAt }
  });
  return parsedData;
}
const { set: setOAuthState } = defineRequestState(() => null);
async function generateState(c, link, additionalData) {
  const callbackURL = c.body?.callbackURL || c.context.options.baseURL;
  if (!callbackURL) throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.CALLBACK_URL_REQUIRED);
  const codeVerifier = generateRandomString(128);
  const stateData = {
    ...additionalData ? additionalData : {},
    callbackURL,
    codeVerifier,
    errorURL: c.body?.errorCallbackURL,
    newUserURL: c.body?.newUserCallbackURL,
    link,
    expiresAt: Date.now() + 600 * 1e3,
    requestSignUp: c.body?.requestSignUp
  };
  await setOAuthState(stateData);
  try {
    return generateGenericState(c, stateData);
  } catch (error2) {
    c.context.logger.error("Failed to create verification", error2);
    throw new APIError("INTERNAL_SERVER_ERROR", {
      message: "Unable to create verification",
      cause: error2
    });
  }
}
async function parseState(c) {
  const state = c.query.state || c.body.state;
  const errorURL = c.context.options.onAPIError?.errorURL || `${c.context.baseURL}/error`;
  let parsedData;
  try {
    parsedData = await parseGenericState(c, state);
  } catch (error2) {
    c.context.logger.error("Failed to parse state", error2);
    if (error2 instanceof StateError && error2.code === "state_security_mismatch") throw c.redirect(`${errorURL}?error=state_mismatch`);
    throw c.redirect(`${errorURL}?error=please_restart_the_process`);
  }
  if (!parsedData.errorURL) parsedData.errorURL = errorURL;
  if (parsedData) await setOAuthState(parsedData);
  return parsedData;
}
const HIDE_METADATA = { scope: "server" };
function isAPIError(error2) {
  return error2 instanceof APIError$1 || error2 instanceof APIError || error2?.name === "APIError";
}
const matchesOriginPattern = (url, pattern, settings) => {
  if (url.startsWith("/")) {
    if (settings?.allowRelativePaths) return url.startsWith("/") && /^\/(?!\/|\\|%2f|%5c)[\w\-.\+/@]*(?:\?[\w\-.\+/=&%@]*)?$/.test(url);
    return false;
  }
  if (pattern.includes("*") || pattern.includes("?")) {
    if (pattern.includes("://")) return wildcardMatch(pattern)(getOrigin(url) || url);
    const host = getHost(url);
    if (!host) return false;
    return wildcardMatch(pattern)(host);
  }
  const protocol = getProtocol(url);
  return protocol === "http:" || protocol === "https:" || !protocol ? pattern === getOrigin(url) : url.startsWith(pattern);
};
function shouldSkipCSRFForBackwardCompat(ctx) {
  return ctx.context.skipOriginCheck === true && ctx.context.options.advanced?.disableCSRFCheck === void 0;
}
const logBackwardCompatWarning = deprecate(function logBackwardCompatWarning2() {
}, "disableOriginCheck: true currently also disables CSRF checks. In a future version, disableOriginCheck will ONLY disable URL validation. To keep CSRF disabled, add disableCSRFCheck: true to your config.");
const originCheckMiddleware = createAuthMiddleware(async (ctx) => {
  if (ctx.request?.method === "GET" || ctx.request?.method === "OPTIONS" || ctx.request?.method === "HEAD" || !ctx.request) return;
  await validateOrigin(ctx);
  if (ctx.context.skipOriginCheck) return;
  const { body, query } = ctx;
  const callbackURL = body?.callbackURL || query?.callbackURL;
  const redirectURL = body?.redirectTo;
  const errorCallbackURL = body?.errorCallbackURL;
  const newUserCallbackURL = body?.newUserCallbackURL;
  const validateURL = (url, label) => {
    if (!url) return;
    if (!ctx.context.isTrustedOrigin(url, { allowRelativePaths: label !== "origin" })) {
      ctx.context.logger.error(`Invalid ${label}: ${url}`);
      ctx.context.logger.info(`If it's a valid URL, please add ${url} to trustedOrigins in your auth config
`, `Current list of trustedOrigins: ${ctx.context.trustedOrigins}`);
      if (label === "origin") throw APIError.from("FORBIDDEN", BASE_ERROR_CODES.INVALID_ORIGIN);
      if (label === "callbackURL") throw APIError.from("FORBIDDEN", BASE_ERROR_CODES.INVALID_CALLBACK_URL);
      if (label === "redirectURL") throw APIError.from("FORBIDDEN", BASE_ERROR_CODES.INVALID_REDIRECT_URL);
      if (label === "errorCallbackURL") throw APIError.from("FORBIDDEN", BASE_ERROR_CODES.INVALID_ERROR_CALLBACK_URL);
      if (label === "newUserCallbackURL") throw APIError.from("FORBIDDEN", BASE_ERROR_CODES.INVALID_NEW_USER_CALLBACK_URL);
      throw APIError.fromStatus("FORBIDDEN", { message: `Invalid ${label}` });
    }
  };
  callbackURL && validateURL(callbackURL, "callbackURL");
  redirectURL && validateURL(redirectURL, "redirectURL");
  errorCallbackURL && validateURL(errorCallbackURL, "errorCallbackURL");
  newUserCallbackURL && validateURL(newUserCallbackURL, "newUserCallbackURL");
});
const originCheck = (getValue) => createAuthMiddleware(async (ctx) => {
  if (!ctx.request) return;
  if (ctx.context.skipOriginCheck) return;
  const callbackURL = getValue(ctx);
  const validateURL = (url, label) => {
    if (!url) return;
    if (!ctx.context.isTrustedOrigin(url, { allowRelativePaths: label !== "origin" })) {
      ctx.context.logger.error(`Invalid ${label}: ${url}`);
      ctx.context.logger.info(`If it's a valid URL, please add ${url} to trustedOrigins in your auth config
`, `Current list of trustedOrigins: ${ctx.context.trustedOrigins}`);
      throw APIError.from("FORBIDDEN", BASE_ERROR_CODES.INVALID_CALLBACK_URL);
    }
  };
  const callbacks = Array.isArray(callbackURL) ? callbackURL : [callbackURL];
  for (const url of callbacks) validateURL(url, "callbackURL");
});
async function validateOrigin(ctx, forceValidate = false) {
  const headers = ctx.request?.headers;
  if (!headers || !ctx.request) return;
  const originHeader = headers.get("origin") || headers.get("referer") || "";
  const useCookies = headers.has("cookie");
  if (ctx.context.skipCSRFCheck) return;
  if (shouldSkipCSRFForBackwardCompat(ctx)) {
    ctx.context.options.advanced?.disableOriginCheck === true && logBackwardCompatWarning();
    return;
  }
  const skipOriginCheck = ctx.context.skipOriginCheck;
  if (Array.isArray(skipOriginCheck)) try {
    const basePath = new URL(ctx.context.baseURL).pathname;
    const currentPath = normalizePathname(ctx.request.url, basePath);
    if (skipOriginCheck.some((skipPath) => currentPath.startsWith(skipPath))) return;
  } catch {
  }
  if (!(forceValidate || useCookies)) return;
  if (!originHeader || originHeader === "null") throw APIError.from("FORBIDDEN", BASE_ERROR_CODES.MISSING_OR_NULL_ORIGIN);
  const trustedOrigins = Array.isArray(ctx.context.options.trustedOrigins) ? ctx.context.trustedOrigins : [...ctx.context.trustedOrigins, ...(await ctx.context.options.trustedOrigins?.(ctx.request))?.filter((v) => Boolean(v)) || []];
  if (!trustedOrigins.some((origin) => matchesOriginPattern(originHeader, origin))) {
    ctx.context.logger.error(`Invalid origin: ${originHeader}`);
    ctx.context.logger.info(`If it's a valid URL, please add ${originHeader} to trustedOrigins in your auth config
`, `Current list of trustedOrigins: ${trustedOrigins}`);
    throw APIError.from("FORBIDDEN", BASE_ERROR_CODES.INVALID_ORIGIN);
  }
}
const formCsrfMiddleware = createAuthMiddleware(async (ctx) => {
  if (!ctx.request) return;
  await validateFormCsrf(ctx);
});
async function validateFormCsrf(ctx) {
  const req = ctx.request;
  if (!req) return;
  if (ctx.context.skipCSRFCheck) return;
  if (shouldSkipCSRFForBackwardCompat(ctx)) return;
  const headers = req.headers;
  if (headers.has("cookie")) return await validateOrigin(ctx);
  const site = headers.get("Sec-Fetch-Site");
  const mode = headers.get("Sec-Fetch-Mode");
  const dest = headers.get("Sec-Fetch-Dest");
  if (Boolean(site && site.trim() || mode && mode.trim() || dest && dest.trim())) {
    if (site === "cross-site" && mode === "navigate") {
      ctx.context.logger.error("Blocked cross-site navigation login attempt (CSRF protection)", {
        secFetchSite: site,
        secFetchMode: mode,
        secFetchDest: dest
      });
      throw APIError.from("FORBIDDEN", BASE_ERROR_CODES.CROSS_SITE_NAVIGATION_LOGIN_BLOCKED);
    }
    return await validateOrigin(ctx, true);
  }
}
const LOCALHOST_IP = "127.0.0.1";
function getIp(req, options) {
  if (options.advanced?.ipAddress?.disableIpTracking) return null;
  const headers = "headers" in req ? req.headers : req;
  const ipHeaders = options.advanced?.ipAddress?.ipAddressHeaders || ["x-forwarded-for"];
  for (const key of ipHeaders) {
    const value = "get" in headers ? headers.get(key) : headers[key];
    if (typeof value === "string") {
      const ip = value.split(",")[0].trim();
      if (isValidIP(ip)) return normalizeIP(ip, { ipv6Subnet: options.advanced?.ipAddress?.ipv6Subnet });
    }
  }
  if (isTest() || isDevelopment()) return LOCALHOST_IP;
  return null;
}
const memory = /* @__PURE__ */ new Map();
function shouldRateLimit(max, window2, rateLimitData) {
  const now2 = Date.now();
  const windowInMs = window2 * 1e3;
  return now2 - rateLimitData.lastRequest < windowInMs && rateLimitData.count >= max;
}
function rateLimitResponse(retryAfter) {
  return new Response(JSON.stringify({ message: "Too many requests. Please try again later." }), {
    status: 429,
    statusText: "Too Many Requests",
    headers: { "X-Retry-After": retryAfter.toString() }
  });
}
function getRetryAfter(lastRequest, window2) {
  const now2 = Date.now();
  const windowInMs = window2 * 1e3;
  return Math.ceil((lastRequest + windowInMs - now2) / 1e3);
}
function createDatabaseStorageWrapper(ctx) {
  const model = "rateLimit";
  const db = ctx.adapter;
  return {
    get: async (key) => {
      const data = (await db.findMany({
        model,
        where: [{
          field: "key",
          value: key
        }]
      }))[0];
      if (typeof data?.lastRequest === "bigint") data.lastRequest = Number(data.lastRequest);
      return data;
    },
    set: async (key, value, _update) => {
      try {
        if (_update) await db.updateMany({
          model,
          where: [{
            field: "key",
            value: key
          }],
          update: {
            count: value.count,
            lastRequest: value.lastRequest
          }
        });
        else await db.create({
          model,
          data: {
            key,
            count: value.count,
            lastRequest: value.lastRequest
          }
        });
      } catch (e) {
        ctx.logger.error("Error setting rate limit", e);
      }
    }
  };
}
function getRateLimitStorage(ctx, rateLimitSettings) {
  if (ctx.options.rateLimit?.customStorage) return ctx.options.rateLimit.customStorage;
  const storage = ctx.rateLimit.storage;
  if (storage === "secondary-storage") return {
    get: async (key) => {
      const data = await ctx.options.secondaryStorage?.get(key);
      return data ? safeJSONParse(data) : null;
    },
    set: async (key, value, _update) => {
      const ttl = rateLimitSettings?.window ?? ctx.options.rateLimit?.window ?? 10;
      await ctx.options.secondaryStorage?.set?.(key, JSON.stringify(value), ttl);
    }
  };
  else if (storage === "memory") return {
    async get(key) {
      const entry = memory.get(key);
      if (!entry) return null;
      if (Date.now() >= entry.expiresAt) {
        memory.delete(key);
        return null;
      }
      return entry.data;
    },
    async set(key, value, _update) {
      const ttl = rateLimitSettings?.window ?? ctx.options.rateLimit?.window ?? 10;
      const expiresAt = Date.now() + ttl * 1e3;
      memory.set(key, {
        data: value,
        expiresAt
      });
    }
  };
  return createDatabaseStorageWrapper(ctx);
}
let ipWarningLogged = false;
async function resolveRateLimitConfig(req, ctx) {
  const basePath = new URL(ctx.baseURL).pathname;
  const path2 = normalizePathname(req.url, basePath);
  let currentWindow = ctx.rateLimit.window;
  let currentMax = ctx.rateLimit.max;
  const ip = getIp(req, ctx.options);
  if (!ip) {
    if (!ipWarningLogged) {
      ctx.logger.warn("Rate limiting skipped: could not determine client IP address. If you're behind a reverse proxy, make sure to configure `trustedProxies` in your auth config.");
      ipWarningLogged = true;
    }
    return null;
  }
  const key = createRateLimitKey(ip, path2);
  const specialRule = getDefaultSpecialRules().find((rule) => rule.pathMatcher(path2));
  if (specialRule) {
    currentWindow = specialRule.window;
    currentMax = specialRule.max;
  }
  for (const plugin of ctx.options.plugins || []) if (plugin.rateLimit) {
    const matchedRule = plugin.rateLimit.find((rule) => rule.pathMatcher(path2));
    if (matchedRule) {
      currentWindow = matchedRule.window;
      currentMax = matchedRule.max;
      break;
    }
  }
  if (ctx.rateLimit.customRules) {
    const _path = Object.keys(ctx.rateLimit.customRules).find((p) => {
      if (p.includes("*")) return wildcardMatch(p)(path2);
      return p === path2;
    });
    if (_path) {
      const customRule = ctx.rateLimit.customRules[_path];
      const resolved = typeof customRule === "function" ? await customRule(req, {
        window: currentWindow,
        max: currentMax
      }) : customRule;
      if (resolved) {
        currentWindow = resolved.window;
        currentMax = resolved.max;
      }
      if (resolved === false) return null;
    }
  }
  return {
    key,
    currentWindow,
    currentMax
  };
}
async function onRequestRateLimit(req, ctx) {
  if (!ctx.rateLimit.enabled) return;
  const config2 = await resolveRateLimitConfig(req, ctx);
  if (!config2) return;
  const { key, currentWindow, currentMax } = config2;
  const data = await getRateLimitStorage(ctx, { window: currentWindow }).get(key);
  if (data && shouldRateLimit(currentMax, currentWindow, data)) return rateLimitResponse(getRetryAfter(data.lastRequest, currentWindow));
}
async function onResponseRateLimit(req, ctx) {
  if (!ctx.rateLimit.enabled) return;
  const config2 = await resolveRateLimitConfig(req, ctx);
  if (!config2) return;
  const { key, currentWindow } = config2;
  const storage = getRateLimitStorage(ctx, { window: currentWindow });
  const data = await storage.get(key);
  const now2 = Date.now();
  if (!data) await storage.set(key, {
    key,
    count: 1,
    lastRequest: now2
  });
  else if (now2 - data.lastRequest > currentWindow * 1e3) await storage.set(key, {
    ...data,
    count: 1,
    lastRequest: now2
  }, true);
  else await storage.set(key, {
    ...data,
    count: data.count + 1,
    lastRequest: now2
  }, true);
}
function getDefaultSpecialRules() {
  return [{
    pathMatcher(path2) {
      return path2.startsWith("/sign-in") || path2.startsWith("/sign-up") || path2.startsWith("/change-password") || path2.startsWith("/change-email");
    },
    window: 10,
    max: 3
  }, {
    pathMatcher(path2) {
      return path2 === "/request-password-reset" || path2 === "/send-verification-email" || path2.startsWith("/forget-password") || path2 === "/email-otp/send-verification-otp" || path2 === "/email-otp/request-password-reset";
    },
    window: 60,
    max: 3
  }];
}
const { get: getShouldSkipSessionRefresh } = defineRequestState(() => false);
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __exportAll = (all, no_symbols) => {
  let target = {};
  for (var name in all) {
    __defProp(target, name, {
      get: all[name],
      enumerable: true
    });
  }
  {
    __defProp(target, Symbol.toStringTag, { value: "Module" });
  }
  return target;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
      key = keys[i];
      if (!__hasOwnProp.call(to, key) && key !== except) {
        __defProp(to, key, {
          get: ((k) => from[k]).bind(null, key),
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
      }
    }
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget);
function getSchema(config2) {
  const tables = getAuthTables(config2);
  const schema2 = {};
  for (const key in tables) {
    const table = tables[key];
    const fields = table.fields;
    const actualFields = {};
    Object.entries(fields).forEach(([key2, field]) => {
      actualFields[field.fieldName || key2] = field;
      if (field.references) {
        const refTable = tables[field.references.model];
        if (refTable) actualFields[field.fieldName || key2].references = {
          ...field.references,
          model: refTable.modelName,
          field: field.references.field
        };
      }
    });
    if (schema2[table.modelName]) {
      schema2[table.modelName].fields = {
        ...schema2[table.modelName].fields,
        ...actualFields
      };
      continue;
    }
    schema2[table.modelName] = {
      fields: actualFields,
      order: table.order || Infinity
    };
  }
  return schema2;
}
function convertToDB(fields, values) {
  const result = values.id ? { id: values.id } : {};
  for (const key in fields) {
    const field = fields[key];
    const value = values[key];
    if (value === void 0) continue;
    result[field.fieldName || key] = value;
  }
  return result;
}
function convertFromDB(fields, values) {
  if (!values) return null;
  const result = { id: values.id };
  for (const [key, value] of Object.entries(fields)) result[key] = values[value.fieldName || key];
  return result;
}
function getWithHooks(adapter2, ctx) {
  const hooks = ctx.hooks;
  async function createWithHooks(data, model, customCreateFn) {
    const context2 = await getCurrentAuthContext().catch(() => null);
    let actualData = data;
    for (const hook of hooks || []) {
      const toRun = hook[model]?.create?.before;
      if (toRun) {
        const result = await toRun(actualData, context2);
        if (result === false) return null;
        if (typeof result === "object" && "data" in result) actualData = {
          ...actualData,
          ...result.data
        };
      }
    }
    let created = null;
    if (!customCreateFn || customCreateFn.executeMainFn) created = await (await getCurrentAdapter(adapter2)).create({
      model,
      data: actualData,
      forceAllowId: true
    });
    if (customCreateFn?.fn) created = await customCreateFn.fn(created ?? actualData);
    for (const hook of hooks || []) {
      const toRun = hook[model]?.create?.after;
      if (toRun) await queueAfterTransactionHook(async () => {
        await toRun(created, context2);
      });
    }
    return created;
  }
  async function updateWithHooks(data, where, model, customUpdateFn) {
    const context2 = await getCurrentAuthContext().catch(() => null);
    let actualData = data;
    for (const hook of hooks || []) {
      const toRun = hook[model]?.update?.before;
      if (toRun) {
        const result = await toRun(data, context2);
        if (result === false) return null;
        if (typeof result === "object" && "data" in result) actualData = {
          ...actualData,
          ...result.data
        };
      }
    }
    const customUpdated = customUpdateFn ? await customUpdateFn.fn(actualData) : null;
    const updated = !customUpdateFn || customUpdateFn.executeMainFn ? await (await getCurrentAdapter(adapter2)).update({
      model,
      update: actualData,
      where
    }) : customUpdated;
    for (const hook of hooks || []) {
      const toRun = hook[model]?.update?.after;
      if (toRun) await queueAfterTransactionHook(async () => {
        await toRun(updated, context2);
      });
    }
    return updated;
  }
  async function updateManyWithHooks(data, where, model, customUpdateFn) {
    const context2 = await getCurrentAuthContext().catch(() => null);
    let actualData = data;
    for (const hook of hooks || []) {
      const toRun = hook[model]?.update?.before;
      if (toRun) {
        const result = await toRun(data, context2);
        if (result === false) return null;
        if (typeof result === "object" && "data" in result) actualData = {
          ...actualData,
          ...result.data
        };
      }
    }
    const customUpdated = customUpdateFn ? await customUpdateFn.fn(actualData) : null;
    const updated = !customUpdateFn || customUpdateFn.executeMainFn ? await (await getCurrentAdapter(adapter2)).updateMany({
      model,
      update: actualData,
      where
    }) : customUpdated;
    for (const hook of hooks || []) {
      const toRun = hook[model]?.update?.after;
      if (toRun) await queueAfterTransactionHook(async () => {
        await toRun(updated, context2);
      });
    }
    return updated;
  }
  async function deleteWithHooks(where, model, customDeleteFn) {
    const context2 = await getCurrentAuthContext().catch(() => null);
    let entityToDelete = null;
    try {
      entityToDelete = (await (await getCurrentAdapter(adapter2)).findMany({
        model,
        where,
        limit: 1
      }))[0] || null;
    } catch {
    }
    if (entityToDelete) for (const hook of hooks || []) {
      const toRun = hook[model]?.delete?.before;
      if (toRun) {
        if (await toRun(entityToDelete, context2) === false) return null;
      }
    }
    const customDeleted = customDeleteFn ? await customDeleteFn.fn(where) : null;
    const deleted = (!customDeleteFn || customDeleteFn.executeMainFn) && entityToDelete ? await (await getCurrentAdapter(adapter2)).delete({
      model,
      where
    }) : customDeleted;
    if (entityToDelete) for (const hook of hooks || []) {
      const toRun = hook[model]?.delete?.after;
      if (toRun) await queueAfterTransactionHook(async () => {
        await toRun(entityToDelete, context2);
      });
    }
    return deleted;
  }
  async function deleteManyWithHooks(where, model, customDeleteFn) {
    const context2 = await getCurrentAuthContext().catch(() => null);
    let entitiesToDelete = [];
    try {
      entitiesToDelete = await (await getCurrentAdapter(adapter2)).findMany({
        model,
        where
      });
    } catch {
    }
    for (const entity of entitiesToDelete) for (const hook of hooks || []) {
      const toRun = hook[model]?.delete?.before;
      if (toRun) {
        if (await toRun(entity, context2) === false) return null;
      }
    }
    const customDeleted = customDeleteFn ? await customDeleteFn.fn(where) : null;
    const deleted = !customDeleteFn || customDeleteFn.executeMainFn ? await (await getCurrentAdapter(adapter2)).deleteMany({
      model,
      where
    }) : customDeleted;
    for (const entity of entitiesToDelete) for (const hook of hooks || []) {
      const toRun = hook[model]?.delete?.after;
      if (toRun) await queueAfterTransactionHook(async () => {
        await toRun(entity, context2);
      });
    }
    return deleted;
  }
  return {
    createWithHooks,
    updateWithHooks,
    updateManyWithHooks,
    deleteWithHooks,
    deleteManyWithHooks
  };
}
const defaultKeyHasher = async (identifier) => {
  const hash = await createHash("SHA-256").digest(new TextEncoder().encode(identifier));
  return base64Url.encode(new Uint8Array(hash), { padding: false });
};
async function processIdentifier(identifier, option) {
  if (!option || option === "plain") return identifier;
  if (option === "hashed") return defaultKeyHasher(identifier);
  if (typeof option === "object" && "hash" in option) return option.hash(identifier);
  return identifier;
}
function getStorageOption(identifier, config2) {
  if (!config2) return;
  if (typeof config2 === "object" && "default" in config2) {
    if (config2.overrides) {
      for (const [prefix, option] of Object.entries(config2.overrides)) if (identifier.startsWith(prefix)) return option;
    }
    return config2.default;
  }
  return config2;
}
function getTTLSeconds(expiresAt, now2 = Date.now()) {
  const expiresMs = typeof expiresAt === "number" ? expiresAt : expiresAt.getTime();
  return Math.max(Math.floor((expiresMs - now2) / 1e3), 0);
}
const createInternalAdapter = (adapter2, ctx) => {
  const logger2 = ctx.logger;
  const options = ctx.options;
  const secondaryStorage = options.secondaryStorage;
  const sessionExpiration = options.session?.expiresIn || 3600 * 24 * 7;
  const { createWithHooks, updateWithHooks, updateManyWithHooks, deleteWithHooks, deleteManyWithHooks } = getWithHooks(adapter2, ctx);
  async function refreshUserSessions(user) {
    if (!secondaryStorage) return;
    const listRaw = await secondaryStorage.get(`active-sessions-${user.id}`);
    if (!listRaw) return;
    const now2 = Date.now();
    const validSessions = (safeJSONParse(listRaw) || []).filter((s) => s.expiresAt > now2);
    await Promise.all(validSessions.map(async ({ token }) => {
      const cached = await secondaryStorage.get(token);
      if (!cached) return;
      const parsed = safeJSONParse(cached);
      if (!parsed) return;
      const sessionTTL = getTTLSeconds(parsed.session.expiresAt, now2);
      await secondaryStorage.set(token, JSON.stringify({
        session: parsed.session,
        user
      }), Math.floor(sessionTTL));
    }));
  }
  return {
    createOAuthUser: async (user, account) => {
      return runWithTransaction(adapter2, async () => {
        const createdUser = await createWithHooks({
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date(),
          ...user
        }, "user", void 0);
        return {
          user: createdUser,
          account: await createWithHooks({
            ...account,
            userId: createdUser.id,
            createdAt: /* @__PURE__ */ new Date(),
            updatedAt: /* @__PURE__ */ new Date()
          }, "account", void 0)
        };
      });
    },
    createUser: async (user) => {
      return await createWithHooks({
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date(),
        ...user,
        email: user.email?.toLowerCase()
      }, "user", void 0);
    },
    createAccount: async (account) => {
      return await createWithHooks({
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date(),
        ...account
      }, "account", void 0);
    },
    listSessions: async (userId, options2) => {
      if (secondaryStorage) {
        const currentList = await secondaryStorage.get(`active-sessions-${userId}`);
        if (!currentList) return [];
        const list = safeJSONParse(currentList) || [];
        const now2 = Date.now();
        const seenTokens = /* @__PURE__ */ new Set();
        const sessions = [];
        for (const { token, expiresAt } of list) {
          if (expiresAt <= now2 || seenTokens.has(token)) continue;
          seenTokens.add(token);
          const data = await secondaryStorage.get(token);
          if (!data) continue;
          try {
            const parsed = typeof data === "string" ? JSON.parse(data) : data;
            if (!parsed?.session) continue;
            sessions.push(parseSessionOutput(ctx.options, {
              ...parsed.session,
              expiresAt: new Date(parsed.session.expiresAt)
            }));
          } catch {
            continue;
          }
        }
        return sessions;
      }
      return await (await getCurrentAdapter(adapter2)).findMany({
        model: "session",
        where: [{
          field: "userId",
          value: userId
        }, ...options2?.onlyActiveSessions ? [{
          field: "expiresAt",
          value: /* @__PURE__ */ new Date(),
          operator: "gt"
        }] : []]
      });
    },
    listUsers: async (limit, offset, sortBy, where) => {
      return await (await getCurrentAdapter(adapter2)).findMany({
        model: "user",
        limit,
        offset,
        sortBy,
        where
      });
    },
    countTotalUsers: async (where) => {
      const total = await (await getCurrentAdapter(adapter2)).count({
        model: "user",
        where
      });
      if (typeof total === "string") return parseInt(total);
      return total;
    },
    deleteUser: async (userId) => {
      if (!secondaryStorage || options.session?.storeSessionInDatabase) await deleteManyWithHooks([{
        field: "userId",
        value: userId
      }], "session", void 0);
      await deleteManyWithHooks([{
        field: "userId",
        value: userId
      }], "account", void 0);
      await deleteWithHooks([{
        field: "id",
        value: userId
      }], "user", void 0);
    },
    createSession: async (userId, dontRememberMe, override, overrideAll) => {
      const headers = await (async () => {
        const ctx2 = await getCurrentAuthContext().catch(() => null);
        return ctx2?.headers || ctx2?.request?.headers;
      })();
      const storeInDb = options.session?.storeSessionInDatabase;
      const { id: _, ...rest } = override || {};
      const defaultAdditionalFields = getSessionDefaultFields(options);
      const data = {
        ipAddress: headers ? getIp(headers, options) || "" : "",
        userAgent: headers?.get("user-agent") || "",
        ...rest,
        expiresAt: dontRememberMe ? getDate(3600 * 24, "sec") : getDate(sessionExpiration, "sec"),
        userId,
        token: generateId(32),
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date(),
        ...defaultAdditionalFields,
        ...overrideAll ? rest : {}
      };
      return await createWithHooks(data, "session", secondaryStorage ? {
        fn: async (sessionData) => {
          const currentList = await secondaryStorage.get(`active-sessions-${userId}`);
          let list = [];
          const now2 = Date.now();
          if (currentList) {
            list = safeJSONParse(currentList) || [];
            list = list.filter((session) => session.expiresAt > now2 && session.token !== data.token);
          }
          const sorted = [...list, {
            token: data.token,
            expiresAt: data.expiresAt.getTime()
          }].sort((a, b) => a.expiresAt - b.expiresAt);
          const furthestSessionTTL = getTTLSeconds(sorted.at(-1)?.expiresAt ?? data.expiresAt.getTime(), now2);
          if (furthestSessionTTL > 0) await secondaryStorage.set(`active-sessions-${userId}`, JSON.stringify(sorted), furthestSessionTTL);
          const user = await (await getCurrentAdapter(adapter2)).findOne({
            model: "user",
            where: [{
              field: "id",
              value: userId
            }]
          });
          const sessionTTL = getTTLSeconds(data.expiresAt, now2);
          if (sessionTTL > 0) await secondaryStorage.set(data.token, JSON.stringify({
            session: sessionData,
            user
          }), sessionTTL);
          return sessionData;
        },
        executeMainFn: storeInDb
      } : void 0);
    },
    findSession: async (token) => {
      if (secondaryStorage) {
        const sessionStringified = await secondaryStorage.get(token);
        if (!sessionStringified && !options.session?.storeSessionInDatabase) return null;
        if (sessionStringified) {
          const s = safeJSONParse(sessionStringified);
          if (!s) return null;
          return {
            session: parseSessionOutput(ctx.options, {
              ...s.session,
              expiresAt: new Date(s.session.expiresAt),
              createdAt: new Date(s.session.createdAt),
              updatedAt: new Date(s.session.updatedAt)
            }),
            user: parseUserOutput(ctx.options, {
              ...s.user,
              createdAt: new Date(s.user.createdAt),
              updatedAt: new Date(s.user.updatedAt)
            })
          };
        }
      }
      const result = await (await getCurrentAdapter(adapter2)).findOne({
        model: "session",
        where: [{
          value: token,
          field: "token"
        }],
        join: { user: true }
      });
      if (!result) return null;
      const { user, ...session } = result;
      if (!user) return null;
      return {
        session: parseSessionOutput(ctx.options, session),
        user: parseUserOutput(ctx.options, user)
      };
    },
    findSessions: async (sessionTokens, options2) => {
      if (secondaryStorage) {
        const sessions2 = [];
        for (const sessionToken of sessionTokens) {
          const sessionStringified = await secondaryStorage.get(sessionToken);
          if (sessionStringified) try {
            const s = typeof sessionStringified === "string" ? JSON.parse(sessionStringified) : sessionStringified;
            if (!s) return [];
            const expiresAt = new Date(s.session.expiresAt);
            if (options2?.onlyActiveSessions && expiresAt <= /* @__PURE__ */ new Date()) continue;
            const session = {
              session: {
                ...s.session,
                expiresAt: new Date(s.session.expiresAt)
              },
              user: {
                ...s.user,
                createdAt: new Date(s.user.createdAt),
                updatedAt: new Date(s.user.updatedAt)
              }
            };
            sessions2.push(session);
          } catch {
            continue;
          }
        }
        return sessions2;
      }
      const sessions = await (await getCurrentAdapter(adapter2)).findMany({
        model: "session",
        where: [{
          field: "token",
          value: sessionTokens,
          operator: "in"
        }, ...options2?.onlyActiveSessions ? [{
          field: "expiresAt",
          value: /* @__PURE__ */ new Date(),
          operator: "gt"
        }] : []],
        join: { user: true }
      });
      if (!sessions.length) return [];
      if (sessions.some((session) => !session.user)) return [];
      return sessions.map((_session) => {
        const { user, ...session } = _session;
        return {
          session,
          user
        };
      });
    },
    updateSession: async (sessionToken, session) => {
      return await updateWithHooks(session, [{
        field: "token",
        value: sessionToken
      }], "session", secondaryStorage ? {
        async fn(data) {
          const currentSession = await secondaryStorage.get(sessionToken);
          if (!currentSession) return null;
          const parsedSession = safeJSONParse(currentSession);
          if (!parsedSession) return null;
          const mergedSession = {
            ...parsedSession.session,
            ...data,
            expiresAt: new Date(data.expiresAt ?? parsedSession.session.expiresAt),
            createdAt: new Date(parsedSession.session.createdAt),
            updatedAt: new Date(data.updatedAt ?? parsedSession.session.updatedAt)
          };
          const updatedSession = parseSessionOutput(ctx.options, mergedSession);
          const now2 = Date.now();
          const expiresMs = new Date(updatedSession.expiresAt).getTime();
          const sessionTTL = getTTLSeconds(expiresMs, now2);
          if (sessionTTL > 0) {
            await secondaryStorage.set(sessionToken, JSON.stringify({
              session: updatedSession,
              user: parsedSession.user
            }), sessionTTL);
            const listKey = `active-sessions-${updatedSession.userId}`;
            const listRaw = await secondaryStorage.get(listKey);
            const sorted = (listRaw ? safeJSONParse(listRaw) || [] : []).filter((s) => s.token !== sessionToken && s.expiresAt > now2).concat([{
              token: sessionToken,
              expiresAt: expiresMs
            }]).sort((a, b) => a.expiresAt - b.expiresAt);
            const furthestSessionExp = sorted.at(-1)?.expiresAt;
            if (furthestSessionExp && furthestSessionExp > now2) await secondaryStorage.set(listKey, JSON.stringify(sorted), getTTLSeconds(furthestSessionExp, now2));
            else await secondaryStorage.delete(listKey);
          }
          return updatedSession;
        },
        executeMainFn: options.session?.storeSessionInDatabase
      } : void 0);
    },
    deleteSession: async (token) => {
      if (secondaryStorage) {
        const data = await secondaryStorage.get(token);
        if (data) {
          const { session } = safeJSONParse(data) ?? {};
          if (!session) {
            logger2.error("Session not found in secondary storage");
            return;
          }
          const userId = session.userId;
          const currentList = await secondaryStorage.get(`active-sessions-${userId}`);
          if (currentList) {
            const list = safeJSONParse(currentList) || [];
            const now2 = Date.now();
            const filtered = list.filter((session2) => session2.expiresAt > now2 && session2.token !== token);
            const furthestSessionExp = filtered.sort((a, b) => a.expiresAt - b.expiresAt).at(-1)?.expiresAt;
            if (filtered.length > 0 && furthestSessionExp && furthestSessionExp > Date.now()) await secondaryStorage.set(`active-sessions-${userId}`, JSON.stringify(filtered), getTTLSeconds(furthestSessionExp, now2));
            else await secondaryStorage.delete(`active-sessions-${userId}`);
          } else logger2.error("Active sessions list not found in secondary storage");
        }
        await secondaryStorage.delete(token);
        if (!options.session?.storeSessionInDatabase || ctx.options.session?.preserveSessionInDatabase) return;
      }
      await deleteWithHooks([{
        field: "token",
        value: token
      }], "session", void 0);
    },
    deleteAccounts: async (userId) => {
      await deleteManyWithHooks([{
        field: "userId",
        value: userId
      }], "account", void 0);
    },
    deleteAccount: async (accountId) => {
      await deleteWithHooks([{
        field: "id",
        value: accountId
      }], "account", void 0);
    },
    deleteSessions: async (userIdOrSessionTokens) => {
      if (secondaryStorage) {
        if (typeof userIdOrSessionTokens === "string") {
          const activeSession = await secondaryStorage.get(`active-sessions-${userIdOrSessionTokens}`);
          const sessions = activeSession ? safeJSONParse(activeSession) : [];
          if (!sessions) return;
          for (const session of sessions) await secondaryStorage.delete(session.token);
          await secondaryStorage.delete(`active-sessions-${userIdOrSessionTokens}`);
        } else for (const sessionToken of userIdOrSessionTokens) if (await secondaryStorage.get(sessionToken)) await secondaryStorage.delete(sessionToken);
        if (!options.session?.storeSessionInDatabase || ctx.options.session?.preserveSessionInDatabase) return;
      }
      await deleteManyWithHooks([{
        field: Array.isArray(userIdOrSessionTokens) ? "token" : "userId",
        value: userIdOrSessionTokens,
        operator: Array.isArray(userIdOrSessionTokens) ? "in" : void 0
      }], "session", void 0);
    },
    findOAuthUser: async (email2, accountId, providerId) => {
      const account = await (await getCurrentAdapter(adapter2)).findOne({
        model: "account",
        where: [{
          value: accountId,
          field: "accountId"
        }, {
          value: providerId,
          field: "providerId"
        }],
        join: { user: true }
      });
      if (account) if (account.user) return {
        user: account.user,
        linkedAccount: account,
        accounts: [account]
      };
      else {
        const user = await (await getCurrentAdapter(adapter2)).findOne({
          model: "user",
          where: [{
            value: email2.toLowerCase(),
            field: "email"
          }]
        });
        if (user) return {
          user,
          linkedAccount: account,
          accounts: [account]
        };
        return null;
      }
      else {
        const user = await (await getCurrentAdapter(adapter2)).findOne({
          model: "user",
          where: [{
            value: email2.toLowerCase(),
            field: "email"
          }]
        });
        if (user) return {
          user,
          linkedAccount: null,
          accounts: await (await getCurrentAdapter(adapter2)).findMany({
            model: "account",
            where: [{
              value: user.id,
              field: "userId"
            }]
          }) || []
        };
        else return null;
      }
    },
    findUserByEmail: async (email2, options2) => {
      const result = await (await getCurrentAdapter(adapter2)).findOne({
        model: "user",
        where: [{
          value: email2.toLowerCase(),
          field: "email"
        }],
        join: { ...options2?.includeAccounts ? { account: true } : {} }
      });
      if (!result) return null;
      const { account: accounts, ...user } = result;
      return {
        user,
        accounts: accounts ?? []
      };
    },
    findUserById: async (userId) => {
      if (!userId) return null;
      return await (await getCurrentAdapter(adapter2)).findOne({
        model: "user",
        where: [{
          field: "id",
          value: userId
        }]
      });
    },
    linkAccount: async (account) => {
      return await createWithHooks({
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date(),
        ...account
      }, "account", void 0);
    },
    updateUser: async (userId, data) => {
      const user = await updateWithHooks(data, [{
        field: "id",
        value: userId
      }], "user", void 0);
      await refreshUserSessions(user);
      return user;
    },
    updateUserByEmail: async (email2, data) => {
      const user = await updateWithHooks(data, [{
        field: "email",
        value: email2.toLowerCase()
      }], "user", void 0);
      await refreshUserSessions(user);
      return user;
    },
    updatePassword: async (userId, password) => {
      await updateManyWithHooks({ password }, [{
        field: "userId",
        value: userId
      }, {
        field: "providerId",
        value: "credential"
      }], "account", void 0);
    },
    findAccounts: async (userId) => {
      return await (await getCurrentAdapter(adapter2)).findMany({
        model: "account",
        where: [{
          field: "userId",
          value: userId
        }]
      });
    },
    findAccount: async (accountId) => {
      return await (await getCurrentAdapter(adapter2)).findOne({
        model: "account",
        where: [{
          field: "accountId",
          value: accountId
        }]
      });
    },
    findAccountByProviderId: async (accountId, providerId) => {
      return await (await getCurrentAdapter(adapter2)).findOne({
        model: "account",
        where: [{
          field: "accountId",
          value: accountId
        }, {
          field: "providerId",
          value: providerId
        }]
      });
    },
    findAccountByUserId: async (userId) => {
      return await (await getCurrentAdapter(adapter2)).findMany({
        model: "account",
        where: [{
          field: "userId",
          value: userId
        }]
      });
    },
    updateAccount: async (id, data) => {
      return await updateWithHooks(data, [{
        field: "id",
        value: id
      }], "account", void 0);
    },
    createVerificationValue: async (data) => {
      const storageOption = getStorageOption(data.identifier, options.verification?.storeIdentifier);
      const storedIdentifier = await processIdentifier(data.identifier, storageOption);
      return await createWithHooks({
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date(),
        ...data,
        identifier: storedIdentifier
      }, "verification", secondaryStorage ? {
        async fn(verificationData) {
          const ttl = getTTLSeconds(verificationData.expiresAt);
          if (ttl > 0) await secondaryStorage.set(`verification:${storedIdentifier}`, JSON.stringify(verificationData), ttl);
          return verificationData;
        },
        executeMainFn: options.verification?.storeInDatabase
      } : void 0);
    },
    findVerificationValue: async (identifier) => {
      const storageOption = getStorageOption(identifier, options.verification?.storeIdentifier);
      const storedIdentifier = await processIdentifier(identifier, storageOption);
      if (secondaryStorage) {
        const cached = await secondaryStorage.get(`verification:${storedIdentifier}`);
        if (cached) {
          const parsed = safeJSONParse(cached);
          if (parsed) return parsed;
        }
        if (storageOption && storageOption !== "plain") {
          const plainCached = await secondaryStorage.get(`verification:${identifier}`);
          if (plainCached) {
            const parsed = safeJSONParse(plainCached);
            if (parsed) return parsed;
          }
        }
        if (!options.verification?.storeInDatabase) return null;
      }
      const currentAdapter = await getCurrentAdapter(adapter2);
      async function findByIdentifier(id) {
        return currentAdapter.findMany({
          model: "verification",
          where: [{
            field: "identifier",
            value: id
          }],
          sortBy: {
            field: "createdAt",
            direction: "desc"
          },
          limit: 1
        });
      }
      let verification = await findByIdentifier(storedIdentifier);
      if (!verification.length && storageOption && storageOption !== "plain") verification = await findByIdentifier(identifier);
      if (!options.verification?.disableCleanup) await deleteManyWithHooks([{
        field: "expiresAt",
        value: /* @__PURE__ */ new Date(),
        operator: "lt"
      }], "verification", void 0);
      return verification[0] || null;
    },
    deleteVerificationByIdentifier: async (identifier) => {
      const storedIdentifier = await processIdentifier(identifier, getStorageOption(identifier, options.verification?.storeIdentifier));
      if (secondaryStorage) await secondaryStorage.delete(`verification:${storedIdentifier}`);
      if (!secondaryStorage || options.verification?.storeInDatabase) await deleteWithHooks([{
        field: "identifier",
        value: storedIdentifier
      }], "verification", void 0);
    },
    updateVerificationByIdentifier: async (identifier, data) => {
      const storedIdentifier = await processIdentifier(identifier, getStorageOption(identifier, options.verification?.storeIdentifier));
      if (secondaryStorage) {
        const cached = await secondaryStorage.get(`verification:${storedIdentifier}`);
        if (cached) {
          const parsed = safeJSONParse(cached);
          if (parsed) {
            const updated = {
              ...parsed,
              ...data
            };
            const expiresAt = updated.expiresAt ?? parsed.expiresAt;
            const ttl = getTTLSeconds(expiresAt instanceof Date ? expiresAt : new Date(expiresAt));
            if (ttl > 0) await secondaryStorage.set(`verification:${storedIdentifier}`, JSON.stringify(updated), ttl);
            if (!options.verification?.storeInDatabase) return updated;
          }
        }
      }
      if (!secondaryStorage || options.verification?.storeInDatabase) return await updateWithHooks(data, [{
        field: "identifier",
        value: storedIdentifier
      }], "verification", void 0);
      return data;
    }
  };
};
function toZodSchema({ fields, isClientSide }) {
  const zodFields = Object.keys(fields).reduce((acc, key) => {
    const field = fields[key];
    if (!field) return acc;
    if (isClientSide && field.input === false) return acc;
    let schema2;
    if (field.type === "json") schema2 = json ? json() : any();
    else if (field.type === "string[]" || field.type === "number[]") schema2 = array(field.type === "string[]" ? string() : number());
    else if (Array.isArray(field.type)) schema2 = any();
    else schema2 = z[field.type]();
    if (field?.required === false) schema2 = schema2.optional();
    if (!isClientSide && field?.returned === false) return acc;
    return {
      ...acc,
      [key]: schema2
    };
  }, {});
  return object(zodFields);
}
var db_exports = /* @__PURE__ */ __exportAll({
  convertFromDB: () => convertFromDB,
  convertToDB: () => convertToDB,
  createInternalAdapter: () => createInternalAdapter,
  getSchema: () => getSchema,
  getSessionDefaultFields: () => getSessionDefaultFields,
  getWithHooks: () => getWithHooks,
  mergeSchema: () => mergeSchema,
  parseAccountInput: () => parseAccountInput,
  parseAccountOutput: () => parseAccountOutput,
  parseAdditionalUserInput: () => parseAdditionalUserInput,
  parseInputData: () => parseInputData,
  parseSessionInput: () => parseSessionInput,
  parseSessionOutput: () => parseSessionOutput,
  parseUserInput: () => parseUserInput,
  parseUserOutput: () => parseUserOutput,
  toZodSchema: () => toZodSchema
});
__reExport(db_exports, import__better_auth_core_db);
const getSession = () => createAuthEndpoint("/get-session", {
  method: ["GET", "POST"],
  operationId: "getSession",
  query: getSessionQuerySchema,
  requireHeaders: true,
  metadata: { openapi: {
    operationId: "getSession",
    description: "Get the current session",
    responses: { "200": {
      description: "Success",
      content: { "application/json": { schema: {
        type: "object",
        nullable: true,
        properties: {
          session: { $ref: "#/components/schemas/Session" },
          user: { $ref: "#/components/schemas/User" }
        },
        required: ["session", "user"]
      } } }
    } }
  } }
}, async (ctx) => {
  const deferSessionRefresh = ctx.context.options.session?.deferSessionRefresh;
  const isPostRequest = ctx.method === "POST";
  if (isPostRequest && !deferSessionRefresh) throw APIError.from("METHOD_NOT_ALLOWED", BASE_ERROR_CODES.METHOD_NOT_ALLOWED_DEFER_SESSION_REQUIRED);
  try {
    const sessionCookieToken = await ctx.getSignedCookie(ctx.context.authCookies.sessionToken.name, ctx.context.secret);
    if (!sessionCookieToken) return null;
    const sessionDataCookie = getChunkedCookie(ctx, ctx.context.authCookies.sessionData.name);
    let sessionDataPayload = null;
    if (sessionDataCookie) {
      const strategy = ctx.context.options.session?.cookieCache?.strategy || "compact";
      if (strategy === "jwe") {
        const payload = await symmetricDecodeJWT(sessionDataCookie, ctx.context.secretConfig, "better-auth-session");
        if (payload && payload.session && payload.user) sessionDataPayload = {
          session: {
            session: payload.session,
            user: payload.user,
            updatedAt: payload.updatedAt,
            version: payload.version
          },
          expiresAt: payload.exp ? payload.exp * 1e3 : Date.now()
        };
        else {
          expireCookie(ctx, ctx.context.authCookies.sessionData);
          return ctx.json(null);
        }
      } else if (strategy === "jwt") {
        const payload = await verifyJWT(sessionDataCookie, ctx.context.secret);
        if (payload && payload.session && payload.user) sessionDataPayload = {
          session: {
            session: payload.session,
            user: payload.user,
            updatedAt: payload.updatedAt,
            version: payload.version
          },
          expiresAt: payload.exp ? payload.exp * 1e3 : Date.now()
        };
        else {
          expireCookie(ctx, ctx.context.authCookies.sessionData);
          return ctx.json(null);
        }
      } else {
        const parsed = safeJSONParse(binary.decode(base64Url.decode(sessionDataCookie)));
        if (parsed) if (await createHMAC("SHA-256", "base64urlnopad").verify(ctx.context.secret, JSON.stringify({
          ...parsed.session,
          expiresAt: parsed.expiresAt
        }), parsed.signature)) sessionDataPayload = parsed;
        else {
          expireCookie(ctx, ctx.context.authCookies.sessionData);
          return ctx.json(null);
        }
      }
    }
    const dontRememberMe = await ctx.getSignedCookie(ctx.context.authCookies.dontRememberToken.name, ctx.context.secret);
    if (sessionDataPayload?.session && ctx.context.options.session?.cookieCache?.enabled && !ctx.query?.disableCookieCache) {
      const session2 = sessionDataPayload.session;
      const versionConfig = ctx.context.options.session?.cookieCache?.version;
      let expectedVersion = "1";
      if (versionConfig) {
        if (typeof versionConfig === "string") expectedVersion = versionConfig;
        else if (typeof versionConfig === "function") {
          const result = versionConfig(session2.session, session2.user);
          expectedVersion = result instanceof Promise ? await result : result;
        }
      }
      if ((session2.version || "1") !== expectedVersion) expireCookie(ctx, ctx.context.authCookies.sessionData);
      else {
        const cachedSessionExpiresAt = new Date(session2.session.expiresAt);
        if (sessionDataPayload.expiresAt < Date.now() || cachedSessionExpiresAt < /* @__PURE__ */ new Date()) expireCookie(ctx, ctx.context.authCookies.sessionData);
        else {
          const cookieRefreshCache = ctx.context.sessionConfig.cookieRefreshCache;
          if (cookieRefreshCache === false) {
            ctx.context.session = session2;
            const parsedSession3 = parseSessionOutput(ctx.context.options, {
              ...session2.session,
              expiresAt: new Date(session2.session.expiresAt),
              createdAt: new Date(session2.session.createdAt),
              updatedAt: new Date(session2.session.updatedAt)
            });
            const parsedUser3 = parseUserOutput(ctx.context.options, {
              ...session2.user,
              createdAt: new Date(session2.user.createdAt),
              updatedAt: new Date(session2.user.updatedAt)
            });
            return ctx.json({
              session: parsedSession3,
              user: parsedUser3
            });
          }
          const timeUntilExpiry = sessionDataPayload.expiresAt - Date.now();
          const updateAge2 = cookieRefreshCache.updateAge * 1e3;
          const shouldSkipSessionRefresh2 = await getShouldSkipSessionRefresh();
          if (timeUntilExpiry < updateAge2 && !shouldSkipSessionRefresh2) {
            const newExpiresAt = getDate(ctx.context.options.session?.cookieCache?.maxAge || 300, "sec");
            const refreshedSession = {
              session: {
                ...session2.session,
                expiresAt: newExpiresAt
              },
              user: session2.user,
              updatedAt: Date.now()
            };
            await setCookieCache(ctx, refreshedSession, false);
            const sessionTokenOptions = ctx.context.authCookies.sessionToken.attributes;
            const sessionTokenMaxAge = dontRememberMe ? void 0 : ctx.context.sessionConfig.expiresIn;
            await ctx.setSignedCookie(ctx.context.authCookies.sessionToken.name, session2.session.token, ctx.context.secret, {
              ...sessionTokenOptions,
              maxAge: sessionTokenMaxAge
            });
            const parsedRefreshedSession = parseSessionOutput(ctx.context.options, {
              ...refreshedSession.session,
              expiresAt: new Date(refreshedSession.session.expiresAt),
              createdAt: new Date(refreshedSession.session.createdAt),
              updatedAt: new Date(refreshedSession.session.updatedAt)
            });
            const parsedRefreshedUser = parseUserOutput(ctx.context.options, {
              ...refreshedSession.user,
              createdAt: new Date(refreshedSession.user.createdAt),
              updatedAt: new Date(refreshedSession.user.updatedAt)
            });
            ctx.context.session = {
              session: parsedRefreshedSession,
              user: parsedRefreshedUser
            };
            return ctx.json({
              session: parsedRefreshedSession,
              user: parsedRefreshedUser
            });
          }
          const parsedSession2 = parseSessionOutput(ctx.context.options, {
            ...session2.session,
            expiresAt: new Date(session2.session.expiresAt),
            createdAt: new Date(session2.session.createdAt),
            updatedAt: new Date(session2.session.updatedAt)
          });
          const parsedUser2 = parseUserOutput(ctx.context.options, {
            ...session2.user,
            createdAt: new Date(session2.user.createdAt),
            updatedAt: new Date(session2.user.updatedAt)
          });
          ctx.context.session = {
            session: parsedSession2,
            user: parsedUser2
          };
          return ctx.json({
            session: parsedSession2,
            user: parsedUser2
          });
        }
      }
    }
    const session = await ctx.context.internalAdapter.findSession(sessionCookieToken);
    ctx.context.session = session;
    if (!session || session.session.expiresAt < /* @__PURE__ */ new Date()) {
      deleteSessionCookie(ctx);
      if (session) {
        if (!deferSessionRefresh || isPostRequest) await ctx.context.internalAdapter.deleteSession(session.session.token);
      }
      return ctx.json(null);
    }
    if (dontRememberMe || ctx.query?.disableRefresh) {
      const parsedSession2 = parseSessionOutput(ctx.context.options, session.session);
      const parsedUser2 = parseUserOutput(ctx.context.options, session.user);
      return ctx.json({
        session: parsedSession2,
        user: parsedUser2
      });
    }
    const expiresIn = ctx.context.sessionConfig.expiresIn;
    const updateAge = ctx.context.sessionConfig.updateAge;
    const shouldBeUpdated = session.session.expiresAt.valueOf() - expiresIn * 1e3 + updateAge * 1e3 <= Date.now();
    const disableRefresh = ctx.query?.disableRefresh || ctx.context.options.session?.disableSessionRefresh;
    const shouldSkipSessionRefresh = await getShouldSkipSessionRefresh();
    const needsRefresh = shouldBeUpdated && !disableRefresh && !shouldSkipSessionRefresh;
    if (deferSessionRefresh && !isPostRequest) {
      await setCookieCache(ctx, session, !!dontRememberMe);
      const parsedSession2 = parseSessionOutput(ctx.context.options, session.session);
      const parsedUser2 = parseUserOutput(ctx.context.options, session.user);
      return ctx.json({
        session: parsedSession2,
        user: parsedUser2,
        needsRefresh
      });
    }
    if (needsRefresh) {
      const updatedSession = await ctx.context.internalAdapter.updateSession(session.session.token, {
        expiresAt: getDate(ctx.context.sessionConfig.expiresIn, "sec"),
        updatedAt: /* @__PURE__ */ new Date()
      });
      if (!updatedSession) {
        deleteSessionCookie(ctx);
        throw APIError.from("UNAUTHORIZED", BASE_ERROR_CODES.FAILED_TO_GET_SESSION);
      }
      const maxAge = (updatedSession.expiresAt.valueOf() - Date.now()) / 1e3;
      await setSessionCookie(ctx, {
        session: updatedSession,
        user: session.user
      }, false, { maxAge });
      const parsedUpdatedSession = parseSessionOutput(ctx.context.options, updatedSession);
      const parsedUser2 = parseUserOutput(ctx.context.options, session.user);
      return ctx.json({
        session: parsedUpdatedSession,
        user: parsedUser2
      });
    }
    await setCookieCache(ctx, session, !!dontRememberMe);
    const parsedSession = parseSessionOutput(ctx.context.options, session.session);
    const parsedUser = parseUserOutput(ctx.context.options, session.user);
    return ctx.json({
      session: parsedSession,
      user: parsedUser
    });
  } catch (error2) {
    if (isAPIError(error2)) throw error2;
    ctx.context.logger.error("INTERNAL_SERVER_ERROR", error2);
    throw APIError.from("INTERNAL_SERVER_ERROR", BASE_ERROR_CODES.FAILED_TO_GET_SESSION);
  }
});
const getSessionFromCtx = async (ctx, config2) => {
  if (ctx.context.session) return ctx.context.session;
  const session = await getSession()({
    ...ctx,
    method: "GET",
    asResponse: false,
    headers: ctx.headers,
    returnHeaders: false,
    returnStatus: false,
    query: {
      ...config2,
      ...ctx.query
    }
  }).catch((e) => {
    return null;
  });
  ctx.context.session = session;
  return session;
};
const sessionMiddleware = createAuthMiddleware(async (ctx) => {
  const session = await getSessionFromCtx(ctx);
  if (!session?.session) throw APIError.from("UNAUTHORIZED", {
    message: "Unauthorized",
    code: "UNAUTHORIZED"
  });
  return { session };
});
const sensitiveSessionMiddleware = createAuthMiddleware(async (ctx) => {
  const session = await getSessionFromCtx(ctx, { disableCookieCache: true });
  if (!session?.session) throw APIError.from("UNAUTHORIZED", {
    message: "Unauthorized",
    code: "UNAUTHORIZED"
  });
  return { session };
});
createAuthMiddleware(async (ctx) => {
  const session = await getSessionFromCtx(ctx);
  if (!session?.session && (ctx.request || ctx.headers)) throw APIError.from("UNAUTHORIZED", {
    message: "Unauthorized",
    code: "UNAUTHORIZED"
  });
  return { session };
});
const freshSessionMiddleware = createAuthMiddleware(async (ctx) => {
  const session = await getSessionFromCtx(ctx);
  if (!session?.session) throw APIError.from("UNAUTHORIZED", {
    message: "Unauthorized",
    code: "UNAUTHORIZED"
  });
  if (ctx.context.sessionConfig.freshAge === 0) return { session };
  const freshAge = ctx.context.sessionConfig.freshAge;
  const lastUpdated = new Date(session.session.updatedAt || session.session.createdAt).getTime();
  if (!(Date.now() - lastUpdated < freshAge * 1e3)) throw APIError.from("FORBIDDEN", BASE_ERROR_CODES.SESSION_NOT_FRESH);
  return { session };
});
const listSessions = () => createAuthEndpoint("/list-sessions", {
  method: "GET",
  operationId: "listUserSessions",
  use: [sessionMiddleware],
  requireHeaders: true,
  metadata: { openapi: {
    operationId: "listUserSessions",
    description: "List all active sessions for the user",
    responses: { "200": {
      description: "Success",
      content: { "application/json": { schema: {
        type: "array",
        items: { $ref: "#/components/schemas/Session" }
      } } }
    } }
  } }
}, async (ctx) => {
  try {
    const activeSessions = (await ctx.context.internalAdapter.listSessions(ctx.context.session.user.id, { onlyActiveSessions: true })).filter((session) => {
      return session.expiresAt > /* @__PURE__ */ new Date();
    });
    return ctx.json(activeSessions.map((session) => parseSessionOutput(ctx.context.options, session)));
  } catch (e) {
    ctx.context.logger.error(e);
    throw ctx.error("INTERNAL_SERVER_ERROR");
  }
});
const revokeSession = createAuthEndpoint("/revoke-session", {
  method: "POST",
  body: object({ token: string().meta({ description: "The token to revoke" }) }),
  use: [sensitiveSessionMiddleware],
  requireHeaders: true,
  metadata: { openapi: {
    description: "Revoke a single session",
    requestBody: { content: { "application/json": { schema: {
      type: "object",
      properties: { token: {
        type: "string",
        description: "The token to revoke"
      } },
      required: ["token"]
    } } } },
    responses: { "200": {
      description: "Success",
      content: { "application/json": { schema: {
        type: "object",
        properties: { status: {
          type: "boolean",
          description: "Indicates if the session was revoked successfully"
        } },
        required: ["status"]
      } } }
    } }
  } }
}, async (ctx) => {
  const token = ctx.body.token;
  if ((await ctx.context.internalAdapter.findSession(token))?.session.userId === ctx.context.session.user.id) try {
    await ctx.context.internalAdapter.deleteSession(token);
  } catch (error2) {
    ctx.context.logger.error(error2 && typeof error2 === "object" && "name" in error2 ? error2.name : "", error2);
    throw APIError.from("INTERNAL_SERVER_ERROR", {
      message: "Internal Server Error",
      code: "INTERNAL_SERVER_ERROR"
    });
  }
  return ctx.json({ status: true });
});
const revokeSessions = createAuthEndpoint("/revoke-sessions", {
  method: "POST",
  use: [sensitiveSessionMiddleware],
  requireHeaders: true,
  metadata: { openapi: {
    description: "Revoke all sessions for the user",
    responses: { "200": {
      description: "Success",
      content: { "application/json": { schema: {
        type: "object",
        properties: { status: {
          type: "boolean",
          description: "Indicates if all sessions were revoked successfully"
        } },
        required: ["status"]
      } } }
    } }
  } }
}, async (ctx) => {
  try {
    await ctx.context.internalAdapter.deleteSessions(ctx.context.session.user.id);
  } catch (error2) {
    ctx.context.logger.error(error2 && typeof error2 === "object" && "name" in error2 ? error2.name : "", error2);
    throw APIError.from("INTERNAL_SERVER_ERROR", {
      message: "Internal Server Error",
      code: "INTERNAL_SERVER_ERROR"
    });
  }
  return ctx.json({ status: true });
});
const revokeOtherSessions = createAuthEndpoint("/revoke-other-sessions", {
  method: "POST",
  requireHeaders: true,
  use: [sensitiveSessionMiddleware],
  metadata: { openapi: {
    description: "Revoke all other sessions for the user except the current one",
    responses: { "200": {
      description: "Success",
      content: { "application/json": { schema: {
        type: "object",
        properties: { status: {
          type: "boolean",
          description: "Indicates if all other sessions were revoked successfully"
        } },
        required: ["status"]
      } } }
    } }
  } }
}, async (ctx) => {
  const session = ctx.context.session;
  if (!session.user) throw APIError.from("UNAUTHORIZED", {
    message: "Unauthorized",
    code: "UNAUTHORIZED"
  });
  const otherSessions = (await ctx.context.internalAdapter.listSessions(session.user.id)).filter((session2) => {
    return session2.expiresAt > /* @__PURE__ */ new Date();
  }).filter((session2) => session2.token !== ctx.context.session.session.token);
  await Promise.all(otherSessions.map((session2) => ctx.context.internalAdapter.deleteSession(session2.token)));
  return ctx.json({ status: true });
});
async function runPluginInit(context2) {
  let options = context2.options;
  const plugins = options.plugins || [];
  const dbHooks = [];
  const pluginTrustedOrigins = [];
  for (const plugin of plugins) if (plugin.init) {
    const initPromise = plugin.init(context2);
    let result;
    if (isPromise(initPromise)) result = await initPromise;
    else result = initPromise;
    if (typeof result === "object") {
      if (result.options) {
        const { databaseHooks, trustedOrigins, ...restOpts } = result.options;
        if (databaseHooks) dbHooks.push(databaseHooks);
        if (trustedOrigins) pluginTrustedOrigins.push(trustedOrigins);
        options = defu(options, restOpts);
      }
      if (result.context) Object.assign(context2, result.context);
    }
  }
  if (pluginTrustedOrigins.length > 0) {
    const allSources = [...options.trustedOrigins ? [options.trustedOrigins] : [], ...pluginTrustedOrigins];
    const staticOrigins = allSources.filter(Array.isArray).flat();
    const dynamicOrigins = allSources.filter((s) => typeof s === "function");
    if (dynamicOrigins.length > 0) options.trustedOrigins = async (request) => {
      const resolved = await Promise.all(dynamicOrigins.map((fn) => fn(request)));
      return [...staticOrigins, ...resolved.flat()].filter((v) => typeof v === "string" && v !== "");
    };
    else options.trustedOrigins = staticOrigins;
  }
  dbHooks.push(options.databaseHooks);
  context2.internalAdapter = createInternalAdapter(context2.adapter, {
    options,
    logger: context2.logger,
    hooks: dbHooks.filter((u) => u !== void 0),
    generateId: context2.generateId
  });
  context2.options = options;
}
function getInternalPlugins(options) {
  const plugins = [];
  if (options.advanced?.crossSubDomainCookies?.enabled) ;
  return plugins;
}
async function getTrustedOrigins(options, request) {
  const trustedOrigins = [];
  if (isDynamicBaseURLConfig(options.baseURL)) {
    const allowedHosts = options.baseURL.allowedHosts;
    for (const host of allowedHosts) if (!host.includes("://")) {
      trustedOrigins.push(`https://${host}`);
      if (host.includes("localhost") || host.includes("127.0.0.1")) trustedOrigins.push(`http://${host}`);
    } else trustedOrigins.push(host);
    if (options.baseURL.fallback) try {
      trustedOrigins.push(new URL(options.baseURL.fallback).origin);
    } catch {
    }
  } else {
    const baseURL = getBaseURL(typeof options.baseURL === "string" ? options.baseURL : void 0, options.basePath, request);
    if (baseURL) trustedOrigins.push(new URL(baseURL).origin);
  }
  if (options.trustedOrigins) {
    if (Array.isArray(options.trustedOrigins)) trustedOrigins.push(...options.trustedOrigins);
    if (typeof options.trustedOrigins === "function") {
      const validOrigins = await options.trustedOrigins(request);
      trustedOrigins.push(...validOrigins);
    }
  }
  const envTrustedOrigins = env.BETTER_AUTH_TRUSTED_ORIGINS;
  if (envTrustedOrigins) trustedOrigins.push(...envTrustedOrigins.split(","));
  return trustedOrigins.filter((v) => Boolean(v));
}
async function getAwaitableValue(arr, item) {
  if (!arr) return void 0;
  for (const val of arr) {
    const value = typeof val === "function" ? await val() : val;
    if (value[item.field ?? "id"] === item.value) return value;
  }
}
async function getTrustedProviders(options, request) {
  const trustedProviders = options.account?.accountLinking?.trustedProviders;
  if (!trustedProviders) return [];
  if (Array.isArray(trustedProviders)) return trustedProviders.filter((v) => Boolean(v));
  return (await trustedProviders(request) ?? []).filter((v) => Boolean(v));
}
function isLikelyEncrypted(token) {
  if (token.startsWith("$ba$")) return true;
  return token.length % 2 === 0 && /^[0-9a-f]+$/i.test(token);
}
function decryptOAuthToken(token, ctx) {
  if (!token) return token;
  if (ctx.options.account?.encryptOAuthTokens) {
    if (!isLikelyEncrypted(token)) return token;
    return symmetricDecrypt({
      key: ctx.secretConfig,
      data: token
    });
  }
  return token;
}
function setTokenUtil(token, ctx) {
  if (ctx.options.account?.encryptOAuthTokens && token) return symmetricEncrypt({
    key: ctx.secretConfig,
    data: token
  });
  return token;
}
const listUserAccounts = createAuthEndpoint("/list-accounts", {
  method: "GET",
  use: [sessionMiddleware],
  metadata: { openapi: {
    operationId: "listUserAccounts",
    description: "List all accounts linked to the user",
    responses: { "200": {
      description: "Success",
      content: { "application/json": { schema: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            providerId: { type: "string" },
            createdAt: {
              type: "string",
              format: "date-time"
            },
            updatedAt: {
              type: "string",
              format: "date-time"
            },
            accountId: { type: "string" },
            userId: { type: "string" },
            scopes: {
              type: "array",
              items: { type: "string" }
            }
          },
          required: [
            "id",
            "providerId",
            "createdAt",
            "updatedAt",
            "accountId",
            "userId",
            "scopes"
          ]
        }
      } } }
    } }
  } }
}, async (c) => {
  const session = c.context.session;
  const accounts = await c.context.internalAdapter.findAccounts(session.user.id);
  return c.json(accounts.map((a) => {
    const { scope, ...parsed } = parseAccountOutput(c.context.options, a);
    return {
      ...parsed,
      scopes: scope?.split(",") || []
    };
  }));
});
const linkSocialAccount = createAuthEndpoint("/link-social", {
  method: "POST",
  requireHeaders: true,
  body: object({
    callbackURL: string().meta({ description: "The URL to redirect to after the user has signed in" }).optional(),
    provider: SocialProviderListEnum,
    idToken: object({
      token: string(),
      nonce: string().optional(),
      accessToken: string().optional(),
      refreshToken: string().optional(),
      scopes: array(string()).optional()
    }).optional(),
    requestSignUp: boolean().optional(),
    scopes: array(string()).meta({ description: "Additional scopes to request from the provider" }).optional(),
    errorCallbackURL: string().meta({ description: "The URL to redirect to if there is an error during the link process" }).optional(),
    disableRedirect: boolean().meta({ description: "Disable automatic redirection to the provider. Useful for handling the redirection yourself" }).optional(),
    additionalData: record(string(), any()).optional()
  }),
  use: [sessionMiddleware],
  metadata: { openapi: {
    description: "Link a social account to the user",
    operationId: "linkSocialAccount",
    responses: { "200": {
      description: "Success",
      content: { "application/json": { schema: {
        type: "object",
        properties: {
          url: {
            type: "string",
            description: "The authorization URL to redirect the user to"
          },
          redirect: {
            type: "boolean",
            description: "Indicates if the user should be redirected to the authorization URL"
          },
          status: { type: "boolean" }
        },
        required: ["redirect"]
      } } }
    } }
  } }
}, async (c) => {
  const session = c.context.session;
  const provider = await getAwaitableValue(c.context.socialProviders, { value: c.body.provider });
  if (!provider) {
    c.context.logger.error("Provider not found. Make sure to add the provider in your auth config", { provider: c.body.provider });
    throw APIError.from("NOT_FOUND", BASE_ERROR_CODES.PROVIDER_NOT_FOUND);
  }
  if (c.body.idToken) {
    if (!provider.verifyIdToken) {
      c.context.logger.error("Provider does not support id token verification", { provider: c.body.provider });
      throw APIError.from("NOT_FOUND", BASE_ERROR_CODES.ID_TOKEN_NOT_SUPPORTED);
    }
    const { token, nonce } = c.body.idToken;
    if (!await provider.verifyIdToken(token, nonce)) {
      c.context.logger.error("Invalid id token", { provider: c.body.provider });
      throw APIError.from("UNAUTHORIZED", BASE_ERROR_CODES.INVALID_TOKEN);
    }
    const linkingUserInfo = await provider.getUserInfo({
      idToken: token,
      accessToken: c.body.idToken.accessToken,
      refreshToken: c.body.idToken.refreshToken
    });
    if (!linkingUserInfo || !linkingUserInfo?.user) {
      c.context.logger.error("Failed to get user info", { provider: c.body.provider });
      throw APIError.from("UNAUTHORIZED", BASE_ERROR_CODES.FAILED_TO_GET_USER_INFO);
    }
    const linkingUserId = String(linkingUserInfo.user.id);
    if (!linkingUserInfo.user.email) {
      c.context.logger.error("User email not found", { provider: c.body.provider });
      throw APIError.from("UNAUTHORIZED", BASE_ERROR_CODES.USER_EMAIL_NOT_FOUND);
    }
    if ((await c.context.internalAdapter.findAccounts(session.user.id)).find((a) => a.providerId === provider.id && a.accountId === linkingUserId)) return c.json({
      url: "",
      status: true,
      redirect: false
    });
    if (!c.context.trustedProviders.includes(provider.id) && !linkingUserInfo.user.emailVerified || c.context.options.account?.accountLinking?.enabled === false) throw APIError.from("UNAUTHORIZED", {
      message: "Account not linked - linking not allowed",
      code: "LINKING_NOT_ALLOWED"
    });
    if (linkingUserInfo.user.email?.toLowerCase() !== session.user.email.toLowerCase() && c.context.options.account?.accountLinking?.allowDifferentEmails !== true) throw APIError.from("UNAUTHORIZED", {
      message: "Account not linked - different emails not allowed",
      code: "LINKING_DIFFERENT_EMAILS_NOT_ALLOWED"
    });
    try {
      await c.context.internalAdapter.createAccount({
        userId: session.user.id,
        providerId: provider.id,
        accountId: linkingUserId,
        accessToken: c.body.idToken.accessToken,
        idToken: token,
        refreshToken: c.body.idToken.refreshToken,
        scope: c.body.idToken.scopes?.join(",")
      });
    } catch (_e) {
      throw APIError.from("EXPECTATION_FAILED", {
        message: "Account not linked - unable to create account",
        code: "LINKING_FAILED"
      });
    }
    if (c.context.options.account?.accountLinking?.updateUserInfoOnLink === true) try {
      await c.context.internalAdapter.updateUser(session.user.id, {
        name: linkingUserInfo.user?.name,
        image: linkingUserInfo.user?.image
      });
    } catch (e) {
      console.warn("Could not update user - " + e.toString());
    }
    return c.json({
      url: "",
      status: true,
      redirect: false
    });
  }
  const state = await generateState(c, {
    userId: session.user.id,
    email: session.user.email
  }, c.body.additionalData);
  const url = await provider.createAuthorizationURL({
    state: state.state,
    codeVerifier: state.codeVerifier,
    redirectURI: `${c.context.baseURL}/callback/${provider.id}`,
    scopes: c.body.scopes
  });
  if (!c.body.disableRedirect) c.setHeader("Location", url.toString());
  return c.json({
    url: url.toString(),
    redirect: !c.body.disableRedirect
  });
});
const unlinkAccount = createAuthEndpoint("/unlink-account", {
  method: "POST",
  body: object({
    providerId: string(),
    accountId: string().optional()
  }),
  use: [freshSessionMiddleware],
  metadata: { openapi: {
    description: "Unlink an account",
    responses: { "200": {
      description: "Success",
      content: { "application/json": { schema: {
        type: "object",
        properties: { status: { type: "boolean" } }
      } } }
    } }
  } }
}, async (ctx) => {
  const { providerId, accountId } = ctx.body;
  const accounts = await ctx.context.internalAdapter.findAccounts(ctx.context.session.user.id);
  if (accounts.length === 1 && !ctx.context.options.account?.accountLinking?.allowUnlinkingAll) throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.FAILED_TO_UNLINK_LAST_ACCOUNT);
  const accountExist = accounts.find((account) => accountId ? account.accountId === accountId && account.providerId === providerId : account.providerId === providerId);
  if (!accountExist) throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.ACCOUNT_NOT_FOUND);
  await ctx.context.internalAdapter.deleteAccount(accountExist.id);
  return ctx.json({ status: true });
});
const getAccessToken = createAuthEndpoint("/get-access-token", {
  method: "POST",
  body: object({
    providerId: string().meta({ description: "The provider ID for the OAuth provider" }),
    accountId: string().meta({ description: "The account ID associated with the refresh token" }).optional(),
    userId: string().meta({ description: "The user ID associated with the account" }).optional()
  }),
  metadata: { openapi: {
    description: "Get a valid access token, doing a refresh if needed",
    responses: {
      200: {
        description: "A Valid access token",
        content: { "application/json": { schema: {
          type: "object",
          properties: {
            tokenType: { type: "string" },
            idToken: { type: "string" },
            accessToken: { type: "string" },
            accessTokenExpiresAt: {
              type: "string",
              format: "date-time"
            }
          }
        } } }
      },
      400: { description: "Invalid refresh token or provider configuration" }
    }
  } }
}, async (ctx) => {
  const { providerId, accountId, userId } = ctx.body || {};
  const req = ctx.request;
  const session = await getSessionFromCtx(ctx);
  if (req && !session) throw ctx.error("UNAUTHORIZED");
  const resolvedUserId = session?.user?.id || userId;
  if (!resolvedUserId) throw ctx.error("UNAUTHORIZED");
  const provider = await getAwaitableValue(ctx.context.socialProviders, { value: providerId });
  if (!provider) throw APIError.from("BAD_REQUEST", {
    message: `Provider ${providerId} is not supported.`,
    code: "PROVIDER_NOT_SUPPORTED"
  });
  const accountData = await getAccountCookie(ctx);
  let account = void 0;
  if (accountData && providerId === accountData.providerId && (!accountId || accountData.id === accountId)) account = accountData;
  else account = (await ctx.context.internalAdapter.findAccounts(resolvedUserId)).find((acc) => accountId ? acc.accountId === accountId && acc.providerId === providerId : acc.providerId === providerId);
  if (!account) throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.ACCOUNT_NOT_FOUND);
  try {
    let newTokens = null;
    const accessTokenExpired = account.accessTokenExpiresAt && new Date(account.accessTokenExpiresAt).getTime() - Date.now() < 5e3;
    if (account.refreshToken && accessTokenExpired && provider.refreshAccessToken) {
      const refreshToken2 = await decryptOAuthToken(account.refreshToken, ctx.context);
      newTokens = await provider.refreshAccessToken(refreshToken2);
      const updatedData = {
        accessToken: await setTokenUtil(newTokens?.accessToken, ctx.context),
        accessTokenExpiresAt: newTokens?.accessTokenExpiresAt,
        refreshToken: newTokens?.refreshToken ? await setTokenUtil(newTokens.refreshToken, ctx.context) : account.refreshToken,
        refreshTokenExpiresAt: newTokens?.refreshTokenExpiresAt ?? account.refreshTokenExpiresAt,
        idToken: newTokens?.idToken || account.idToken
      };
      let updatedAccount = null;
      if (account.id) updatedAccount = await ctx.context.internalAdapter.updateAccount(account.id, updatedData);
      if (ctx.context.options.account?.storeAccountCookie) await setAccountCookie(ctx, {
        ...account,
        ...updatedAccount ?? updatedData
      });
    }
    const accessTokenExpiresAt = (() => {
      if (newTokens?.accessTokenExpiresAt) {
        if (typeof newTokens.accessTokenExpiresAt === "string") return new Date(newTokens.accessTokenExpiresAt);
        return newTokens.accessTokenExpiresAt;
      }
      if (account.accessTokenExpiresAt) {
        if (typeof account.accessTokenExpiresAt === "string") return new Date(account.accessTokenExpiresAt);
        return account.accessTokenExpiresAt;
      }
    })();
    const tokens = {
      accessToken: newTokens?.accessToken ?? await decryptOAuthToken(account.accessToken ?? "", ctx.context),
      accessTokenExpiresAt,
      scopes: account.scope?.split(",") ?? [],
      idToken: newTokens?.idToken ?? account.idToken ?? void 0
    };
    return ctx.json(tokens);
  } catch (_error) {
    throw APIError.from("BAD_REQUEST", {
      message: "Failed to get a valid access token",
      code: "FAILED_TO_GET_ACCESS_TOKEN"
    });
  }
});
const refreshToken = createAuthEndpoint("/refresh-token", {
  method: "POST",
  body: object({
    providerId: string().meta({ description: "The provider ID for the OAuth provider" }),
    accountId: string().meta({ description: "The account ID associated with the refresh token" }).optional(),
    userId: string().meta({ description: "The user ID associated with the account" }).optional()
  }),
  metadata: { openapi: {
    description: "Refresh the access token using a refresh token",
    responses: {
      200: {
        description: "Access token refreshed successfully",
        content: { "application/json": { schema: {
          type: "object",
          properties: {
            tokenType: { type: "string" },
            idToken: { type: "string" },
            accessToken: { type: "string" },
            refreshToken: { type: "string" },
            accessTokenExpiresAt: {
              type: "string",
              format: "date-time"
            },
            refreshTokenExpiresAt: {
              type: "string",
              format: "date-time"
            }
          }
        } } }
      },
      400: { description: "Invalid refresh token or provider configuration" }
    }
  } }
}, async (ctx) => {
  const { providerId, accountId, userId } = ctx.body;
  const req = ctx.request;
  const session = await getSessionFromCtx(ctx);
  if (req && !session) throw ctx.error("UNAUTHORIZED");
  const resolvedUserId = session?.user?.id || userId;
  if (!resolvedUserId) throw APIError.from("BAD_REQUEST", {
    message: `Either userId or session is required`,
    code: "USER_ID_OR_SESSION_REQUIRED"
  });
  const provider = await getAwaitableValue(ctx.context.socialProviders, { value: providerId });
  if (!provider) throw APIError.from("BAD_REQUEST", {
    message: `Provider ${providerId} is not supported.`,
    code: "PROVIDER_NOT_SUPPORTED"
  });
  if (!provider.refreshAccessToken) throw APIError.from("BAD_REQUEST", {
    message: `Provider ${providerId} does not support token refreshing.`,
    code: "TOKEN_REFRESH_NOT_SUPPORTED"
  });
  let account = void 0;
  const accountData = await getAccountCookie(ctx);
  if (accountData && (!providerId || providerId === accountData?.providerId)) account = accountData;
  else account = (await ctx.context.internalAdapter.findAccounts(resolvedUserId)).find((acc) => accountId ? acc.accountId === accountId && acc.providerId === providerId : acc.providerId === providerId);
  if (!account) throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.ACCOUNT_NOT_FOUND);
  let refreshToken2 = void 0;
  if (accountData && providerId === accountData.providerId) refreshToken2 = accountData.refreshToken ?? void 0;
  else refreshToken2 = account.refreshToken ?? void 0;
  if (!refreshToken2) throw APIError.from("BAD_REQUEST", {
    message: "Refresh token not found",
    code: "REFRESH_TOKEN_NOT_FOUND"
  });
  try {
    const decryptedRefreshToken = await decryptOAuthToken(refreshToken2, ctx.context);
    const tokens = await provider.refreshAccessToken(decryptedRefreshToken);
    const resolvedRefreshToken = tokens.refreshToken ? await setTokenUtil(tokens.refreshToken, ctx.context) : refreshToken2;
    const resolvedRefreshTokenExpiresAt = tokens.refreshTokenExpiresAt ?? account.refreshTokenExpiresAt;
    if (account.id) {
      const updateData = {
        ...account || {},
        accessToken: await setTokenUtil(tokens.accessToken, ctx.context),
        refreshToken: resolvedRefreshToken,
        accessTokenExpiresAt: tokens.accessTokenExpiresAt,
        refreshTokenExpiresAt: resolvedRefreshTokenExpiresAt,
        scope: tokens.scopes?.join(",") || account.scope,
        idToken: tokens.idToken || account.idToken
      };
      await ctx.context.internalAdapter.updateAccount(account.id, updateData);
    }
    if (accountData && providerId === accountData.providerId && ctx.context.options.account?.storeAccountCookie) await setAccountCookie(ctx, {
      ...accountData,
      accessToken: await setTokenUtil(tokens.accessToken, ctx.context),
      refreshToken: resolvedRefreshToken,
      accessTokenExpiresAt: tokens.accessTokenExpiresAt,
      refreshTokenExpiresAt: resolvedRefreshTokenExpiresAt,
      scope: tokens.scopes?.join(",") || accountData.scope,
      idToken: tokens.idToken || accountData.idToken
    });
    return ctx.json({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken ?? decryptedRefreshToken,
      accessTokenExpiresAt: tokens.accessTokenExpiresAt,
      refreshTokenExpiresAt: resolvedRefreshTokenExpiresAt,
      scope: tokens.scopes?.join(",") || account.scope,
      idToken: tokens.idToken || account.idToken,
      providerId: account.providerId,
      accountId: account.accountId
    });
  } catch (_error) {
    throw APIError.from("BAD_REQUEST", {
      message: "Failed to refresh access token",
      code: "FAILED_TO_REFRESH_ACCESS_TOKEN"
    });
  }
});
const accountInfoQuerySchema = optional(object({ accountId: string().meta({ description: "The provider given account id for which to get the account info" }).optional() }));
const accountInfo = createAuthEndpoint("/account-info", {
  method: "GET",
  use: [sessionMiddleware],
  metadata: { openapi: {
    description: "Get the account info provided by the provider",
    responses: { "200": {
      description: "Success",
      content: { "application/json": { schema: {
        type: "object",
        properties: {
          user: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              email: { type: "string" },
              image: { type: "string" },
              emailVerified: { type: "boolean" }
            },
            required: ["id", "emailVerified"]
          },
          data: {
            type: "object",
            properties: {},
            additionalProperties: true
          }
        },
        required: ["user", "data"],
        additionalProperties: false
      } } }
    } }
  } },
  query: accountInfoQuerySchema
}, async (ctx) => {
  const providedAccountId = ctx.query?.accountId;
  let account = void 0;
  if (!providedAccountId) {
    if (ctx.context.options.account?.storeAccountCookie) {
      const accountData = await getAccountCookie(ctx);
      if (accountData) account = accountData;
    }
  } else {
    const accountData = await ctx.context.internalAdapter.findAccount(providedAccountId);
    if (accountData) account = accountData;
  }
  if (!account || account.userId !== ctx.context.session.user.id) throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.ACCOUNT_NOT_FOUND);
  const provider = await getAwaitableValue(ctx.context.socialProviders, { value: account.providerId });
  if (!provider) throw APIError.from("INTERNAL_SERVER_ERROR", {
    message: `Provider account provider is ${account.providerId} but it is not configured`,
    code: "PROVIDER_NOT_CONFIGURED"
  });
  const tokens = await getAccessToken({
    ...ctx,
    method: "POST",
    body: {
      accountId: account.accountId,
      providerId: account.providerId
    },
    returnHeaders: false,
    returnStatus: false
  });
  if (!tokens.accessToken) throw APIError.from("BAD_REQUEST", {
    message: "Access token not found",
    code: "ACCESS_TOKEN_NOT_FOUND"
  });
  const info2 = await provider.getUserInfo({
    ...tokens,
    accessToken: tokens.accessToken
  });
  return ctx.json(info2);
});
async function createEmailVerificationToken(secret, email2, updateTo, expiresIn = 3600, extraPayload) {
  return await signJWT({
    email: email2.toLowerCase(),
    updateTo,
    ...extraPayload
  }, secret, expiresIn);
}
async function sendVerificationEmailFn(ctx, user) {
  if (!ctx.context.options.emailVerification?.sendVerificationEmail) {
    ctx.context.logger.error("Verification email isn't enabled.");
    throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.VERIFICATION_EMAIL_NOT_ENABLED);
  }
  const token = await createEmailVerificationToken(ctx.context.secret, user.email, void 0, ctx.context.options.emailVerification?.expiresIn);
  const callbackURL = ctx.body.callbackURL ? encodeURIComponent(ctx.body.callbackURL) : encodeURIComponent("/");
  const url = `${ctx.context.baseURL}/verify-email?token=${token}&callbackURL=${callbackURL}`;
  await ctx.context.runInBackgroundOrAwait(ctx.context.options.emailVerification.sendVerificationEmail({
    user,
    url,
    token
  }, ctx.request));
}
const sendVerificationEmail = createAuthEndpoint("/send-verification-email", {
  method: "POST",
  operationId: "sendVerificationEmail",
  body: object({
    email: email().meta({ description: "The email to send the verification email to" }),
    callbackURL: string().meta({ description: "The URL to use for email verification callback" }).optional()
  }),
  metadata: { openapi: {
    operationId: "sendVerificationEmail",
    description: "Send a verification email to the user",
    requestBody: { content: { "application/json": { schema: {
      type: "object",
      properties: {
        email: {
          type: "string",
          description: "The email to send the verification email to",
          example: "user@example.com"
        },
        callbackURL: {
          type: "string",
          description: "The URL to use for email verification callback",
          example: "https://example.com/callback",
          nullable: true
        }
      },
      required: ["email"]
    } } } },
    responses: {
      "200": {
        description: "Success",
        content: { "application/json": { schema: {
          type: "object",
          properties: { status: {
            type: "boolean",
            description: "Indicates if the email was sent successfully",
            example: true
          } }
        } } }
      },
      "400": {
        description: "Bad Request",
        content: { "application/json": { schema: {
          type: "object",
          properties: { message: {
            type: "string",
            description: "Error message",
            example: "Verification email isn't enabled"
          } }
        } } }
      }
    }
  } }
}, async (ctx) => {
  if (!ctx.context.options.emailVerification?.sendVerificationEmail) {
    ctx.context.logger.error("Verification email isn't enabled.");
    throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.VERIFICATION_EMAIL_NOT_ENABLED);
  }
  const { email: email2 } = ctx.body;
  const session = await getSessionFromCtx(ctx);
  if (!session) {
    const user = await ctx.context.internalAdapter.findUserByEmail(email2);
    if (!user || user.user.emailVerified) {
      await createEmailVerificationToken(ctx.context.secret, email2, void 0, ctx.context.options.emailVerification?.expiresIn);
      return ctx.json({ status: true });
    }
    await sendVerificationEmailFn(ctx, user.user);
    return ctx.json({ status: true });
  }
  if (session?.user.email !== email2) throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.EMAIL_MISMATCH);
  if (session?.user.emailVerified) throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.EMAIL_ALREADY_VERIFIED);
  await sendVerificationEmailFn(ctx, session.user);
  return ctx.json({ status: true });
});
const verifyEmail = createAuthEndpoint("/verify-email", {
  method: "GET",
  operationId: "verifyEmail",
  query: object({
    token: string().meta({ description: "The token to verify the email" }),
    callbackURL: string().meta({ description: "The URL to redirect to after email verification" }).optional()
  }),
  use: [originCheck((ctx) => ctx.query.callbackURL)],
  metadata: { openapi: {
    description: "Verify the email of the user",
    parameters: [{
      name: "token",
      in: "query",
      description: "The token to verify the email",
      required: true,
      schema: { type: "string" }
    }, {
      name: "callbackURL",
      in: "query",
      description: "The URL to redirect to after email verification",
      required: false,
      schema: { type: "string" }
    }],
    responses: { "200": {
      description: "Success",
      content: { "application/json": { schema: {
        type: "object",
        properties: {
          user: {
            type: "object",
            $ref: "#/components/schemas/User"
          },
          status: {
            type: "boolean",
            description: "Indicates if the email was verified successfully"
          }
        },
        required: ["user", "status"]
      } } }
    } }
  } }
}, async (ctx) => {
  function redirectOnError(error2) {
    if (ctx.query.callbackURL) {
      if (ctx.query.callbackURL.includes("?")) throw ctx.redirect(`${ctx.query.callbackURL}&error=${error2.code}`);
      throw ctx.redirect(`${ctx.query.callbackURL}?error=${error2.code}`);
    }
    throw APIError.from("UNAUTHORIZED", error2);
  }
  const { token } = ctx.query;
  let jwt;
  try {
    jwt = await jwtVerify(token, new TextEncoder().encode(ctx.context.secret), { algorithms: ["HS256"] });
  } catch (e) {
    if (e instanceof JWTExpired) return redirectOnError(BASE_ERROR_CODES.TOKEN_EXPIRED);
    return redirectOnError(BASE_ERROR_CODES.INVALID_TOKEN);
  }
  const parsed = object({
    email: email(),
    updateTo: string().optional(),
    requestType: string().optional()
  }).parse(jwt.payload);
  const user = await ctx.context.internalAdapter.findUserByEmail(parsed.email);
  if (!user) return redirectOnError(BASE_ERROR_CODES.USER_NOT_FOUND);
  if (parsed.updateTo) {
    const session = await getSessionFromCtx(ctx);
    if (session && session.user.email !== parsed.email) return redirectOnError(BASE_ERROR_CODES.INVALID_USER);
    switch (parsed.requestType) {
      case "change-email-confirmation": {
        const newToken = await createEmailVerificationToken(ctx.context.secret, parsed.email, parsed.updateTo, ctx.context.options.emailVerification?.expiresIn, { requestType: "change-email-verification" });
        const updateCallbackURL = ctx.query.callbackURL ? encodeURIComponent(ctx.query.callbackURL) : encodeURIComponent("/");
        const url = `${ctx.context.baseURL}/verify-email?token=${newToken}&callbackURL=${updateCallbackURL}`;
        if (ctx.context.options.emailVerification?.sendVerificationEmail) await ctx.context.runInBackgroundOrAwait(ctx.context.options.emailVerification.sendVerificationEmail({
          user: {
            ...user.user,
            email: parsed.updateTo
          },
          url,
          token: newToken
        }, ctx.request));
        if (ctx.query.callbackURL) throw ctx.redirect(ctx.query.callbackURL);
        return ctx.json({ status: true });
      }
      case "change-email-verification": {
        let activeSession = session;
        if (!activeSession) {
          const newSession = await ctx.context.internalAdapter.createSession(user.user.id);
          if (!newSession) throw APIError.from("INTERNAL_SERVER_ERROR", BASE_ERROR_CODES.FAILED_TO_CREATE_SESSION);
          activeSession = {
            session: newSession,
            user: user.user
          };
        }
        const updatedUser2 = await ctx.context.internalAdapter.updateUserByEmail(parsed.email, {
          email: parsed.updateTo,
          emailVerified: true
        });
        if (ctx.context.options.emailVerification?.afterEmailVerification) await ctx.context.options.emailVerification.afterEmailVerification(updatedUser2, ctx.request);
        await setSessionCookie(ctx, {
          session: activeSession.session,
          user: {
            ...activeSession.user,
            email: parsed.updateTo,
            emailVerified: true
          }
        });
        if (ctx.query.callbackURL) throw ctx.redirect(ctx.query.callbackURL);
        return ctx.json({
          status: true,
          user: parseUserOutput(ctx.context.options, updatedUser2)
        });
      }
      default: {
        let activeSession = session;
        if (!activeSession) {
          const newSession = await ctx.context.internalAdapter.createSession(user.user.id);
          if (!newSession) throw APIError.from("INTERNAL_SERVER_ERROR", BASE_ERROR_CODES.FAILED_TO_CREATE_SESSION);
          activeSession = {
            session: newSession,
            user: user.user
          };
        }
        const updatedUser2 = await ctx.context.internalAdapter.updateUserByEmail(parsed.email, {
          email: parsed.updateTo,
          emailVerified: false
        });
        const newToken = await createEmailVerificationToken(ctx.context.secret, parsed.updateTo);
        const updateCallbackURL = ctx.query.callbackURL ? encodeURIComponent(ctx.query.callbackURL) : encodeURIComponent("/");
        if (ctx.context.options.emailVerification?.sendVerificationEmail) await ctx.context.runInBackgroundOrAwait(ctx.context.options.emailVerification.sendVerificationEmail({
          user: updatedUser2,
          url: `${ctx.context.baseURL}/verify-email?token=${newToken}&callbackURL=${updateCallbackURL}`,
          token: newToken
        }, ctx.request));
        await setSessionCookie(ctx, {
          session: activeSession.session,
          user: {
            ...activeSession.user,
            email: parsed.updateTo,
            emailVerified: false
          }
        });
        if (ctx.query.callbackURL) throw ctx.redirect(ctx.query.callbackURL);
        return ctx.json({
          status: true,
          user: parseUserOutput(ctx.context.options, updatedUser2)
        });
      }
    }
  }
  if (user.user.emailVerified) {
    if (ctx.query.callbackURL) throw ctx.redirect(ctx.query.callbackURL);
    return ctx.json({
      status: true,
      user: null
    });
  }
  if (ctx.context.options.emailVerification?.beforeEmailVerification) await ctx.context.options.emailVerification.beforeEmailVerification(user.user, ctx.request);
  const updatedUser = await ctx.context.internalAdapter.updateUserByEmail(parsed.email, { emailVerified: true });
  if (ctx.context.options.emailVerification?.afterEmailVerification) await ctx.context.options.emailVerification.afterEmailVerification(updatedUser, ctx.request);
  if (ctx.context.options.emailVerification?.autoSignInAfterVerification) {
    const currentSession = await getSessionFromCtx(ctx);
    if (!currentSession || currentSession.user.email !== parsed.email) {
      const session = await ctx.context.internalAdapter.createSession(user.user.id);
      if (!session) throw APIError.from("INTERNAL_SERVER_ERROR", BASE_ERROR_CODES.FAILED_TO_CREATE_SESSION);
      await setSessionCookie(ctx, {
        session,
        user: {
          ...user.user,
          emailVerified: true
        }
      });
    } else await setSessionCookie(ctx, {
      session: currentSession.session,
      user: {
        ...currentSession.user,
        emailVerified: true
      }
    });
  }
  if (ctx.query.callbackURL) throw ctx.redirect(ctx.query.callbackURL);
  return ctx.json({
    status: true,
    user: null
  });
});
async function handleOAuthUserInfo(c, opts) {
  const { userInfo, account, callbackURL, disableSignUp, overrideUserInfo } = opts;
  const dbUser = await c.context.internalAdapter.findOAuthUser(userInfo.email.toLowerCase(), account.accountId, account.providerId).catch((e) => {
    logger.error("Better auth was unable to query your database.\nError: ", e);
    const errorURL = c.context.options.onAPIError?.errorURL || `${c.context.baseURL}/error`;
    throw c.redirect(`${errorURL}?error=internal_server_error`);
  });
  let user = dbUser?.user;
  const isRegister = !user;
  if (dbUser) {
    const linkedAccount = dbUser.linkedAccount ?? dbUser.accounts.find((acc) => acc.providerId === account.providerId && acc.accountId === account.accountId);
    if (!linkedAccount) {
      const accountLinking = c.context.options.account?.accountLinking;
      if (!(opts.isTrustedProvider || c.context.trustedProviders.includes(account.providerId)) && !userInfo.emailVerified || accountLinking?.enabled === false || accountLinking?.disableImplicitLinking === true) {
        if (isDevelopment()) logger.warn(`User already exist but account isn't linked to ${account.providerId}. To read more about how account linking works in Better Auth see https://www.better-auth.com/docs/concepts/users-accounts#account-linking.`);
        return {
          error: "account not linked",
          data: null
        };
      }
      try {
        await c.context.internalAdapter.linkAccount({
          providerId: account.providerId,
          accountId: userInfo.id.toString(),
          userId: dbUser.user.id,
          accessToken: await setTokenUtil(account.accessToken, c.context),
          refreshToken: await setTokenUtil(account.refreshToken, c.context),
          idToken: account.idToken,
          accessTokenExpiresAt: account.accessTokenExpiresAt,
          refreshTokenExpiresAt: account.refreshTokenExpiresAt,
          scope: account.scope
        });
      } catch (e) {
        logger.error("Unable to link account", e);
        return {
          error: "unable to link account",
          data: null
        };
      }
      if (userInfo.emailVerified && !dbUser.user.emailVerified && userInfo.email.toLowerCase() === dbUser.user.email) await c.context.internalAdapter.updateUser(dbUser.user.id, { emailVerified: true });
    } else {
      const freshTokens = c.context.options.account?.updateAccountOnSignIn !== false ? Object.fromEntries(Object.entries({
        idToken: account.idToken,
        accessToken: await setTokenUtil(account.accessToken, c.context),
        refreshToken: await setTokenUtil(account.refreshToken, c.context),
        accessTokenExpiresAt: account.accessTokenExpiresAt,
        refreshTokenExpiresAt: account.refreshTokenExpiresAt,
        scope: account.scope
      }).filter(([_, value]) => value !== void 0)) : {};
      if (c.context.options.account?.storeAccountCookie) await setAccountCookie(c, {
        ...linkedAccount,
        ...freshTokens
      });
      if (Object.keys(freshTokens).length > 0) await c.context.internalAdapter.updateAccount(linkedAccount.id, freshTokens);
      if (userInfo.emailVerified && !dbUser.user.emailVerified && userInfo.email.toLowerCase() === dbUser.user.email) await c.context.internalAdapter.updateUser(dbUser.user.id, { emailVerified: true });
    }
    if (overrideUserInfo) {
      const { id: _, ...restUserInfo } = userInfo;
      user = await c.context.internalAdapter.updateUser(dbUser.user.id, {
        ...restUserInfo,
        email: userInfo.email.toLowerCase(),
        emailVerified: userInfo.email.toLowerCase() === dbUser.user.email ? dbUser.user.emailVerified || userInfo.emailVerified : userInfo.emailVerified
      });
    }
  } else {
    if (disableSignUp) return {
      error: "signup disabled",
      data: null,
      isRegister: false
    };
    try {
      const { id: _, ...restUserInfo } = userInfo;
      const accountData = {
        accessToken: await setTokenUtil(account.accessToken, c.context),
        refreshToken: await setTokenUtil(account.refreshToken, c.context),
        idToken: account.idToken,
        accessTokenExpiresAt: account.accessTokenExpiresAt,
        refreshTokenExpiresAt: account.refreshTokenExpiresAt,
        scope: account.scope,
        providerId: account.providerId,
        accountId: userInfo.id.toString()
      };
      const { user: createdUser, account: createdAccount } = await c.context.internalAdapter.createOAuthUser({
        ...restUserInfo,
        email: userInfo.email.toLowerCase()
      }, accountData);
      user = createdUser;
      if (c.context.options.account?.storeAccountCookie) await setAccountCookie(c, createdAccount);
      if (!userInfo.emailVerified && user && c.context.options.emailVerification?.sendOnSignUp && c.context.options.emailVerification?.sendVerificationEmail) {
        const token = await createEmailVerificationToken(c.context.secret, user.email, void 0, c.context.options.emailVerification?.expiresIn);
        const url = `${c.context.baseURL}/verify-email?token=${token}&callbackURL=${callbackURL}`;
        await c.context.runInBackgroundOrAwait(c.context.options.emailVerification.sendVerificationEmail({
          user,
          url,
          token
        }, c.request));
      }
    } catch (e) {
      logger.error(e);
      if (isAPIError(e)) return {
        error: e.message,
        data: null,
        isRegister: false
      };
      return {
        error: "unable to create user",
        data: null,
        isRegister: false
      };
    }
  }
  if (!user) return {
    error: "unable to create user",
    data: null,
    isRegister: false
  };
  const session = await c.context.internalAdapter.createSession(user.id);
  if (!session) return {
    error: "unable to create session",
    data: null,
    isRegister: false
  };
  return {
    data: {
      session,
      user
    },
    error: null,
    isRegister
  };
}
const schema = object({
  code: string().optional(),
  error: string().optional(),
  device_id: string().optional(),
  error_description: string().optional(),
  state: string().optional(),
  user: string().optional()
});
const callbackOAuth = createAuthEndpoint("/callback/:id", {
  method: ["GET", "POST"],
  operationId: "handleOAuthCallback",
  body: schema.optional(),
  query: schema.optional(),
  metadata: {
    ...HIDE_METADATA,
    allowedMediaTypes: ["application/x-www-form-urlencoded", "application/json"]
  }
}, async (c) => {
  let queryOrBody;
  const defaultErrorURL = c.context.options.onAPIError?.errorURL || `${c.context.baseURL}/error`;
  if (c.method === "POST") {
    const postData = c.body ? schema.parse(c.body) : {};
    const queryData = c.query ? schema.parse(c.query) : {};
    const mergedData = schema.parse({
      ...postData,
      ...queryData
    });
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(mergedData)) if (value !== void 0 && value !== null) params.set(key, String(value));
    const redirectURL = `${c.context.baseURL}/callback/${c.params.id}?${params.toString()}`;
    throw c.redirect(redirectURL);
  }
  try {
    if (c.method === "GET") queryOrBody = schema.parse(c.query);
    else if (c.method === "POST") queryOrBody = schema.parse(c.body);
    else throw new Error("Unsupported method");
  } catch (e) {
    c.context.logger.error("INVALID_CALLBACK_REQUEST", e);
    throw c.redirect(`${defaultErrorURL}?error=invalid_callback_request`);
  }
  const { code, error: error2, state, error_description, device_id, user: userData } = queryOrBody;
  if (!state) {
    c.context.logger.error("State not found", error2);
    const url = `${defaultErrorURL}${defaultErrorURL.includes("?") ? "&" : "?"}state=state_not_found`;
    throw c.redirect(url);
  }
  const { codeVerifier, callbackURL, link, errorURL, newUserURL, requestSignUp } = await parseState(c);
  function redirectOnError(error3, description) {
    const baseURL = errorURL ?? defaultErrorURL;
    const params = new URLSearchParams({ error: error3 });
    if (description) params.set("error_description", description);
    const url = `${baseURL}${baseURL.includes("?") ? "&" : "?"}${params.toString()}`;
    throw c.redirect(url);
  }
  if (error2) redirectOnError(error2, error_description);
  if (!code) {
    c.context.logger.error("Code not found");
    throw redirectOnError("no_code");
  }
  const provider = await getAwaitableValue(c.context.socialProviders, { value: c.params.id });
  if (!provider) {
    c.context.logger.error("Oauth provider with id", c.params.id, "not found");
    throw redirectOnError("oauth_provider_not_found");
  }
  let tokens;
  try {
    tokens = await provider.validateAuthorizationCode({
      code,
      codeVerifier,
      deviceId: device_id,
      redirectURI: `${c.context.baseURL}/callback/${provider.id}`
    });
  } catch (e) {
    c.context.logger.error("", e);
    throw redirectOnError("invalid_code");
  }
  if (!tokens) throw redirectOnError("invalid_code");
  const parsedUserData = userData ? safeJSONParse(userData) : null;
  const userInfo = await provider.getUserInfo({
    ...tokens,
    user: parsedUserData ?? void 0
  }).then((res) => res?.user);
  if (!userInfo) {
    c.context.logger.error("Unable to get user info");
    return redirectOnError("unable_to_get_user_info");
  }
  if (!callbackURL) {
    c.context.logger.error("No callback URL found");
    throw redirectOnError("no_callback_url");
  }
  if (link) {
    if (!c.context.trustedProviders.includes(provider.id) && !userInfo.emailVerified || c.context.options.account?.accountLinking?.enabled === false) {
      c.context.logger.error("Unable to link account - untrusted provider");
      return redirectOnError("unable_to_link_account");
    }
    if (userInfo.email?.toLowerCase() !== link.email.toLowerCase() && c.context.options.account?.accountLinking?.allowDifferentEmails !== true) return redirectOnError("email_doesn't_match");
    const existingAccount = await c.context.internalAdapter.findAccount(String(userInfo.id));
    if (existingAccount) {
      if (existingAccount.userId.toString() !== link.userId.toString()) return redirectOnError("account_already_linked_to_different_user");
      const updateData = Object.fromEntries(Object.entries({
        accessToken: await setTokenUtil(tokens.accessToken, c.context),
        refreshToken: await setTokenUtil(tokens.refreshToken, c.context),
        idToken: tokens.idToken,
        accessTokenExpiresAt: tokens.accessTokenExpiresAt,
        refreshTokenExpiresAt: tokens.refreshTokenExpiresAt,
        scope: tokens.scopes?.join(",")
      }).filter(([_, value]) => value !== void 0));
      await c.context.internalAdapter.updateAccount(existingAccount.id, updateData);
    } else if (!await c.context.internalAdapter.createAccount({
      userId: link.userId,
      providerId: provider.id,
      accountId: String(userInfo.id),
      ...tokens,
      accessToken: await setTokenUtil(tokens.accessToken, c.context),
      refreshToken: await setTokenUtil(tokens.refreshToken, c.context),
      scope: tokens.scopes?.join(",")
    })) return redirectOnError("unable_to_link_account");
    let toRedirectTo2;
    try {
      toRedirectTo2 = callbackURL.toString();
    } catch {
      toRedirectTo2 = callbackURL;
    }
    throw c.redirect(toRedirectTo2);
  }
  if (!userInfo.email) {
    c.context.logger.error("Provider did not return email. This could be due to misconfiguration in the provider settings.");
    return redirectOnError("email_not_found");
  }
  const accountData = {
    providerId: provider.id,
    accountId: String(userInfo.id),
    ...tokens,
    scope: tokens.scopes?.join(",")
  };
  const result = await handleOAuthUserInfo(c, {
    userInfo: {
      ...userInfo,
      id: String(userInfo.id),
      email: userInfo.email,
      name: userInfo.name || ""
    },
    account: accountData,
    callbackURL,
    disableSignUp: provider.disableImplicitSignUp && !requestSignUp || provider.options?.disableSignUp,
    overrideUserInfo: provider.options?.overrideUserInfoOnSignIn
  });
  if (result.error) {
    c.context.logger.error(result.error.split(" ").join("_"));
    return redirectOnError(result.error.split(" ").join("_"));
  }
  const { session, user } = result.data;
  await setSessionCookie(c, {
    session,
    user
  });
  let toRedirectTo;
  try {
    toRedirectTo = (result.isRegister ? newUserURL || callbackURL : callbackURL).toString();
  } catch {
    toRedirectTo = result.isRegister ? newUserURL || callbackURL : callbackURL;
  }
  throw c.redirect(toRedirectTo);
});
function sanitize(input) {
  return input.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/&(?!amp;|lt;|gt;|quot;|#39;|#x[0-9a-fA-F]+;|#[0-9]+;)/g, "&amp;");
}
const html = (options, code = "Unknown", description = null) => {
  const custom = options.onAPIError?.customizeDefaultErrorPage;
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Error</title>
    <style>
      * {
        box-sizing: border-box;
      }
      body {
        font-family: ${custom?.font?.defaultFamily || "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"};
        background: ${custom?.colors?.background || "var(--background)"};
        color: var(--foreground);
        margin: 0;
      }
      :root,
      :host {
        --spacing: 0.25rem;
        --container-md: 28rem;
        --text-sm: ${custom?.size?.textSm || "0.875rem"};
        --text-sm--line-height: calc(1.25 / 0.875);
        --text-2xl: ${custom?.size?.text2xl || "1.5rem"};
        --text-2xl--line-height: calc(2 / 1.5);
        --text-4xl: ${custom?.size?.text4xl || "2.25rem"};
        --text-4xl--line-height: calc(2.5 / 2.25);
        --text-6xl: ${custom?.size?.text6xl || "3rem"};
        --text-6xl--line-height: 1;
        --font-weight-medium: 500;
        --font-weight-semibold: 600;
        --font-weight-bold: 700;
        --default-transition-duration: 150ms;
        --default-transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        --radius: ${custom?.size?.radiusSm || "0.625rem"};
        --default-mono-font-family: ${custom?.font?.monoFamily || "var(--font-geist-mono)"};
        --primary: ${custom?.colors?.primary || "black"};
        --primary-foreground: ${custom?.colors?.primaryForeground || "white"};
        --background: ${custom?.colors?.background || "white"};
        --foreground: ${custom?.colors?.foreground || "oklch(0.271 0 0)"};
        --border: ${custom?.colors?.border || "oklch(0.89 0 0)"};
        --destructive: ${custom?.colors?.destructive || "oklch(0.55 0.15 25.723)"};
        --muted-foreground: ${custom?.colors?.mutedForeground || "oklch(0.545 0 0)"};
        --corner-border: ${custom?.colors?.cornerBorder || "#404040"};
      }

      button, .btn {
        cursor: pointer;
        background: none;
        border: none;
        color: inherit;
        font: inherit;
        transition: all var(--default-transition-duration)
          var(--default-transition-timing-function);
      }
      button:hover, .btn:hover {
        opacity: 0.8;
      }

      @media (prefers-color-scheme: dark) {
        :root,
        :host {
          --primary: ${custom?.colors?.primary || "white"};
          --primary-foreground: ${custom?.colors?.primaryForeground || "black"};
          --background: ${custom?.colors?.background || "oklch(0.15 0 0)"};
          --foreground: ${custom?.colors?.foreground || "oklch(0.98 0 0)"};
          --border: ${custom?.colors?.border || "oklch(0.27 0 0)"};
          --destructive: ${custom?.colors?.destructive || "oklch(0.65 0.15 25.723)"};
          --muted-foreground: ${custom?.colors?.mutedForeground || "oklch(0.65 0 0)"};
          --corner-border: ${custom?.colors?.cornerBorder || "#a0a0a0"};
        }
      }
      @media (max-width: 640px) {
        :root, :host {
          --text-6xl: 2.5rem;
          --text-2xl: 1.25rem;
          --text-sm: 0.8125rem;
        }
      }
      @media (max-width: 480px) {
        :root, :host {
          --text-6xl: 2rem;
          --text-2xl: 1.125rem;
        }
      }
    </style>
  </head>
  <body style="width: 100vw; min-height: 100vh; overflow-x: hidden; overflow-y: auto;">
    <div
        style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 1.5rem;
            position: relative;
            width: 100%;
            min-height: 100vh;
            padding: 1rem;
        "
        >
${custom?.disableBackgroundGrid ? "" : `
      <div
        style="
          position: absolute;
          inset: 0;
          background-image: linear-gradient(to right, ${custom?.colors?.gridColor || "var(--border)"} 1px, transparent 1px),
            linear-gradient(to bottom, ${custom?.colors?.gridColor || "var(--border)"} 1px, transparent 1px);
          background-size: 40px 40px;
          opacity: 0.6;
          pointer-events: none;
          width: 100vw;
          height: 100vh;
        "
      ></div>
      <div
        style="
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${custom?.colors?.background || "var(--background)"};
          mask-image: radial-gradient(ellipse at center, transparent 20%, black);
          -webkit-mask-image: radial-gradient(ellipse at center, transparent 20%, black);
          pointer-events: none;
        "
      ></div>
`}

<div
  style="
    position: relative;
    z-index: 10;
    border: 2px solid var(--border);
    background: ${custom?.colors?.cardBackground || "var(--background)"};
    padding: 1.5rem;
    max-width: 42rem;
    width: 100%;
  "
>
    ${custom?.disableCornerDecorations ? "" : `
        <!-- Corner decorations -->
        <div
          style="
            position: absolute;
            top: -2px;
            left: -2px;
            width: 2rem;
            height: 2rem;
            border-top: 4px solid var(--corner-border);
            border-left: 4px solid var(--corner-border);
          "
        ></div>
        <div
          style="
            position: absolute;
            top: -2px;
            right: -2px;
            width: 2rem;
            height: 2rem;
            border-top: 4px solid var(--corner-border);
            border-right: 4px solid var(--corner-border);
          "
        ></div>
  
        <div
          style="
            position: absolute;
            bottom: -2px;
            left: -2px;
            width: 2rem;
            height: 2rem;
            border-bottom: 4px solid var(--corner-border);
            border-left: 4px solid var(--corner-border);
          "
        ></div>
        <div
          style="
            position: absolute;
            bottom: -2px;
            right: -2px;
            width: 2rem;
            height: 2rem;
            border-bottom: 4px solid var(--corner-border);
            border-right: 4px solid var(--corner-border);
          "
        ></div>`}

        <div style="text-align: center; margin-bottom: 1.5rem;">
          <div style="margin-bottom: 1.5rem;">
            <div
              style="
                display: inline-block;
                border: 2px solid ${custom?.disableTitleBorder ? "transparent" : custom?.colors?.titleBorder || "var(--destructive)"};
                padding: 0.375rem 1rem;
              "
            >
              <h1
                style="
                  font-size: var(--text-6xl);
                  font-weight: var(--font-weight-semibold);
                  color: ${custom?.colors?.titleColor || "var(--foreground)"};
                  letter-spacing: -0.02em;
                  margin: 0;
                "
              >
                ERROR
              </h1>
            </div>
            <div
              style="
                height: 2px;
                background-color: var(--border);
                width: calc(100% + 3rem);
                margin-left: -1.5rem;
                margin-top: 1.5rem;
              "
            ></div>
          </div>

          <h2
            style="
              font-size: var(--text-2xl);
              font-weight: var(--font-weight-semibold);
              color: var(--foreground);
              margin: 0 0 1rem;
            "
          >
            Something went wrong
          </h2>

          <div
            style="
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                border: 2px solid var(--border);
                background-color: var(--muted);
                padding: 0.375rem 0.75rem;
                margin: 0 0 1rem;
                flex-wrap: wrap;
                justify-content: center;
            "
            >
            <span
                style="
                font-size: 0.75rem;
                color: var(--muted-foreground);
                font-weight: var(--font-weight-semibold);
                "
            >
                CODE:
            </span>
            <span
                style="
                font-size: var(--text-sm);
                font-family: var(--default-mono-font-family, monospace);
                color: var(--foreground);
                word-break: break-all;
                "
            >
                ${sanitize(code)}
            </span>
            </div>

          <p
            style="
              color: var(--muted-foreground);
              max-width: 28rem;
              margin: 0 auto;
              font-size: var(--text-sm);
              line-height: 1.5;
              text-wrap: pretty;
            "
          >
            ${!description ? `We encountered an unexpected error. Please try again or return to the home page. If you're a developer, you can find more information about the error <a href='https://better-auth.com/docs/reference/errors/${encodeURIComponent(code)}' target='_blank' rel="noopener noreferrer" style='color: var(--foreground); text-decoration: underline;'>here</a>.` : description}
          </p>
        </div>

        <div
          style="
            display: flex;
            gap: 0.75rem;
            margin-top: 1.5rem;
            justify-content: center;
            flex-wrap: wrap;
          "
        >
          <a
            href="/"
            style="
              text-decoration: none;
            "
          >
            <div
              style="
                border: 2px solid var(--border);
                background: var(--primary);
                color: var(--primary-foreground);
                padding: 0.5rem 1rem;
                border-radius: 0;
                white-space: nowrap;
              "
              class="btn"
            >
              Go Home
            </div>
          </a>
          <a
            href="https://better-auth.com/docs/reference/errors/${encodeURIComponent(code)}?askai=${encodeURIComponent(`What does the error code ${code} mean?`)}"
            target="_blank"
            rel="noopener noreferrer"
            style="
              text-decoration: none;
            "
          >
            <div
              style="
                border: 2px solid var(--border);
                background: transparent;
                color: var(--foreground);
                padding: 0.5rem 1rem;
                border-radius: 0;
                white-space: nowrap;
              "
              class="btn"
            >
              Ask AI
            </div>
          </a>
        </div>
      </div>
    </div>
  </body>
</html>`;
};
const error = createAuthEndpoint("/error", {
  method: "GET",
  metadata: {
    ...HIDE_METADATA,
    openapi: {
      description: "Displays an error page",
      responses: { "200": {
        description: "Success",
        content: { "text/html": { schema: {
          type: "string",
          description: "The HTML content of the error page"
        } } }
      } }
    }
  }
}, async (c) => {
  const url = new URL(c.request?.url || "");
  const unsanitizedCode = url.searchParams.get("error") || "UNKNOWN";
  const unsanitizedDescription = url.searchParams.get("error_description") || null;
  const safeCode = /^[\'A-Za-z0-9_-]+$/.test(unsanitizedCode) ? unsanitizedCode : "UNKNOWN";
  const safeDescription = unsanitizedDescription ? sanitize(unsanitizedDescription) : null;
  const queryParams = new URLSearchParams();
  queryParams.set("error", safeCode);
  if (unsanitizedDescription) queryParams.set("error_description", unsanitizedDescription);
  const options = c.context.options;
  const errorURL = options.onAPIError?.errorURL;
  if (errorURL) return new Response(null, {
    status: 302,
    headers: { Location: `${errorURL}${errorURL.includes("?") ? "&" : "?"}${queryParams.toString()}` }
  });
  if (isProduction && !options.onAPIError?.customizeDefaultErrorPage) return new Response(null, {
    status: 302,
    headers: { Location: `/?${queryParams.toString()}` }
  });
  return new Response(html(c.context.options, safeCode, safeDescription), { headers: { "Content-Type": "text/html" } });
});
const ok = createAuthEndpoint("/ok", {
  method: "GET",
  metadata: {
    ...HIDE_METADATA,
    openapi: {
      description: "Check if the API is working",
      responses: { "200": {
        description: "API is working",
        content: { "application/json": { schema: {
          type: "object",
          properties: { ok: {
            type: "boolean",
            description: "Indicates if the API is working"
          } },
          required: ["ok"]
        } } }
      } }
    }
  }
}, async (ctx) => {
  return ctx.json({ ok: true });
});
async function validatePassword(ctx, data) {
  const credentialAccount = (await ctx.context.internalAdapter.findAccounts(data.userId))?.find((account) => account.providerId === "credential");
  const currentPassword = credentialAccount?.password;
  if (!credentialAccount || !currentPassword) return false;
  return await ctx.context.password.verify({
    hash: currentPassword,
    password: data.password
  });
}
async function checkPassword(userId, c) {
  const credentialAccount = (await c.context.internalAdapter.findAccounts(userId))?.find((account) => account.providerId === "credential");
  const currentPassword = credentialAccount?.password;
  if (!credentialAccount || !currentPassword || !c.body.password) throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.CREDENTIAL_ACCOUNT_NOT_FOUND);
  if (!await c.context.password.verify({
    hash: currentPassword,
    password: c.body.password
  })) throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.INVALID_PASSWORD);
  return true;
}
function redirectError(ctx, callbackURL, query) {
  const url = callbackURL ? new URL(callbackURL, ctx.baseURL) : new URL(`${ctx.baseURL}/error`);
  if (query) Object.entries(query).forEach(([k, v]) => url.searchParams.set(k, v));
  return url.href;
}
function redirectCallback(ctx, callbackURL, query) {
  const url = new URL(callbackURL, ctx.baseURL);
  if (query) Object.entries(query).forEach(([k, v]) => url.searchParams.set(k, v));
  return url.href;
}
const requestPasswordReset = createAuthEndpoint("/request-password-reset", {
  method: "POST",
  body: object({
    email: email().meta({ description: "The email address of the user to send a password reset email to" }),
    redirectTo: string().meta({ description: "The URL to redirect the user to reset their password. If the token isn't valid or expired, it'll be redirected with a query parameter `?error=INVALID_TOKEN`. If the token is valid, it'll be redirected with a query parameter `?token=VALID_TOKEN" }).optional()
  }),
  metadata: { openapi: {
    operationId: "requestPasswordReset",
    description: "Send a password reset email to the user",
    responses: { "200": {
      description: "Success",
      content: { "application/json": { schema: {
        type: "object",
        properties: {
          status: { type: "boolean" },
          message: { type: "string" }
        }
      } } }
    } }
  } },
  use: [originCheck((ctx) => ctx.body.redirectTo)]
}, async (ctx) => {
  if (!ctx.context.options.emailAndPassword?.sendResetPassword) {
    ctx.context.logger.error("Reset password isn't enabled.Please pass an emailAndPassword.sendResetPassword function in your auth config!");
    throw APIError.from("BAD_REQUEST", {
      message: "Reset password isn't enabled",
      code: "RESET_PASSWORD_DISABLED"
    });
  }
  const { email: email2, redirectTo } = ctx.body;
  const user = await ctx.context.internalAdapter.findUserByEmail(email2, { includeAccounts: true });
  if (!user) {
    generateId(24);
    await ctx.context.internalAdapter.findVerificationValue("dummy-verification-token");
    ctx.context.logger.error("Reset Password: User not found", { email: email2 });
    return ctx.json({
      status: true,
      message: "If this email exists in our system, check your email for the reset link"
    });
  }
  const expiresAt = getDate(ctx.context.options.emailAndPassword.resetPasswordTokenExpiresIn || 3600 * 1, "sec");
  const verificationToken = generateId(24);
  await ctx.context.internalAdapter.createVerificationValue({
    value: user.user.id,
    identifier: `reset-password:${verificationToken}`,
    expiresAt
  });
  const callbackURL = redirectTo ? encodeURIComponent(redirectTo) : "";
  const url = `${ctx.context.baseURL}/reset-password/${verificationToken}?callbackURL=${callbackURL}`;
  await ctx.context.runInBackgroundOrAwait(ctx.context.options.emailAndPassword.sendResetPassword({
    user: user.user,
    url,
    token: verificationToken
  }, ctx.request));
  return ctx.json({
    status: true,
    message: "If this email exists in our system, check your email for the reset link"
  });
});
const requestPasswordResetCallback = createAuthEndpoint("/reset-password/:token", {
  method: "GET",
  operationId: "forgetPasswordCallback",
  query: object({ callbackURL: string().meta({ description: "The URL to redirect the user to reset their password" }) }),
  use: [originCheck((ctx) => ctx.query.callbackURL)],
  metadata: { openapi: {
    operationId: "resetPasswordCallback",
    description: "Redirects the user to the callback URL with the token",
    parameters: [{
      name: "token",
      in: "path",
      required: true,
      description: "The token to reset the password",
      schema: { type: "string" }
    }, {
      name: "callbackURL",
      in: "query",
      required: true,
      description: "The URL to redirect the user to reset their password",
      schema: { type: "string" }
    }],
    responses: { "200": {
      description: "Success",
      content: { "application/json": { schema: {
        type: "object",
        properties: { token: { type: "string" } }
      } } }
    } }
  } }
}, async (ctx) => {
  const { token } = ctx.params;
  const { callbackURL } = ctx.query;
  if (!token || !callbackURL) throw ctx.redirect(redirectError(ctx.context, callbackURL, { error: "INVALID_TOKEN" }));
  const verification = await ctx.context.internalAdapter.findVerificationValue(`reset-password:${token}`);
  if (!verification || verification.expiresAt < /* @__PURE__ */ new Date()) throw ctx.redirect(redirectError(ctx.context, callbackURL, { error: "INVALID_TOKEN" }));
  throw ctx.redirect(redirectCallback(ctx.context, callbackURL, { token }));
});
const resetPassword = createAuthEndpoint("/reset-password", {
  method: "POST",
  operationId: "resetPassword",
  query: object({ token: string().optional() }).optional(),
  body: object({
    newPassword: string().meta({ description: "The new password to set" }),
    token: string().meta({ description: "The token to reset the password" }).optional()
  }),
  metadata: { openapi: {
    operationId: "resetPassword",
    description: "Reset the password for a user",
    responses: { "200": {
      description: "Success",
      content: { "application/json": { schema: {
        type: "object",
        properties: { status: { type: "boolean" } }
      } } }
    } }
  } }
}, async (ctx) => {
  const token = ctx.body.token || ctx.query?.token;
  if (!token) throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.INVALID_TOKEN);
  const { newPassword } = ctx.body;
  const minLength = ctx.context.password?.config.minPasswordLength;
  const maxLength = ctx.context.password?.config.maxPasswordLength;
  if (newPassword.length < minLength) throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.PASSWORD_TOO_SHORT);
  if (newPassword.length > maxLength) throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.PASSWORD_TOO_LONG);
  const id = `reset-password:${token}`;
  const verification = await ctx.context.internalAdapter.findVerificationValue(id);
  if (!verification || verification.expiresAt < /* @__PURE__ */ new Date()) throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.INVALID_TOKEN);
  const userId = verification.value;
  const hashedPassword = await ctx.context.password.hash(newPassword);
  if (!(await ctx.context.internalAdapter.findAccounts(userId)).find((ac) => ac.providerId === "credential")) await ctx.context.internalAdapter.createAccount({
    userId,
    providerId: "credential",
    password: hashedPassword,
    accountId: userId
  });
  else await ctx.context.internalAdapter.updatePassword(userId, hashedPassword);
  await ctx.context.internalAdapter.deleteVerificationByIdentifier(id);
  if (ctx.context.options.emailAndPassword?.onPasswordReset) {
    const user = await ctx.context.internalAdapter.findUserById(userId);
    if (user) await ctx.context.options.emailAndPassword.onPasswordReset({ user }, ctx.request);
  }
  if (ctx.context.options.emailAndPassword?.revokeSessionsOnPasswordReset) await ctx.context.internalAdapter.deleteSessions(userId);
  return ctx.json({ status: true });
});
const verifyPassword = createAuthEndpoint("/verify-password", {
  method: "POST",
  body: object({ password: string().meta({ description: "The password to verify" }) }),
  metadata: {
    scope: "server",
    openapi: {
      operationId: "verifyPassword",
      description: "Verify the current user's password",
      responses: { "200": {
        description: "Success",
        content: { "application/json": { schema: {
          type: "object",
          properties: { status: { type: "boolean" } }
        } } }
      } }
    }
  },
  use: [sensitiveSessionMiddleware]
}, async (ctx) => {
  const { password } = ctx.body;
  const session = ctx.context.session;
  if (!await validatePassword(ctx, {
    password,
    userId: session.user.id
  })) throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.INVALID_PASSWORD);
  return ctx.json({ status: true });
});
const socialSignInBodySchema = object({
  callbackURL: string().meta({ description: "Callback URL to redirect to after the user has signed in" }).optional(),
  newUserCallbackURL: string().optional(),
  errorCallbackURL: string().meta({ description: "Callback URL to redirect to if an error happens" }).optional(),
  provider: SocialProviderListEnum,
  disableRedirect: boolean().meta({ description: "Disable automatic redirection to the provider. Useful for handling the redirection yourself" }).optional(),
  idToken: optional(object({
    token: string().meta({ description: "ID token from the provider" }),
    nonce: string().meta({ description: "Nonce used to generate the token" }).optional(),
    accessToken: string().meta({ description: "Access token from the provider" }).optional(),
    refreshToken: string().meta({ description: "Refresh token from the provider" }).optional(),
    expiresAt: number().meta({ description: "Expiry date of the token" }).optional(),
    user: object({
      name: object({
        firstName: string().optional(),
        lastName: string().optional()
      }).optional(),
      email: string().optional()
    }).meta({ description: "The user object from the provider. Only available for some providers like Apple." }).optional()
  })),
  scopes: array(string()).meta({ description: "Array of scopes to request from the provider. This will override the default scopes passed." }).optional(),
  requestSignUp: boolean().meta({ description: "Explicitly request sign-up. Useful when disableImplicitSignUp is true for this provider" }).optional(),
  loginHint: string().meta({ description: "The login hint to use for the authorization code request" }).optional(),
  additionalData: record(string(), any()).optional().meta({ description: "Additional data to be passed through the OAuth flow" })
});
const signInSocial = () => createAuthEndpoint("/sign-in/social", {
  method: "POST",
  operationId: "socialSignIn",
  body: socialSignInBodySchema,
  metadata: {
    $Infer: {
      body: {},
      returned: {}
    },
    openapi: {
      description: "Sign in with a social provider",
      operationId: "socialSignIn",
      responses: { "200": {
        description: "Success - Returns either session details or redirect URL",
        content: { "application/json": { schema: {
          type: "object",
          description: "Session response when idToken is provided",
          properties: {
            token: { type: "string" },
            user: {
              type: "object",
              $ref: "#/components/schemas/User"
            },
            url: { type: "string" },
            redirect: {
              type: "boolean",
              enum: [false]
            }
          },
          required: [
            "redirect",
            "token",
            "user"
          ]
        } } }
      } }
    }
  }
}, async (c) => {
  const provider = await getAwaitableValue(c.context.socialProviders, { value: c.body.provider });
  if (!provider) {
    c.context.logger.error("Provider not found. Make sure to add the provider in your auth config", { provider: c.body.provider });
    throw APIError.from("NOT_FOUND", BASE_ERROR_CODES.PROVIDER_NOT_FOUND);
  }
  if (c.body.idToken) {
    if (!provider.verifyIdToken) {
      c.context.logger.error("Provider does not support id token verification", { provider: c.body.provider });
      throw APIError.from("NOT_FOUND", BASE_ERROR_CODES.ID_TOKEN_NOT_SUPPORTED);
    }
    const { token, nonce } = c.body.idToken;
    if (!await provider.verifyIdToken(token, nonce)) {
      c.context.logger.error("Invalid id token", { provider: c.body.provider });
      throw APIError.from("UNAUTHORIZED", BASE_ERROR_CODES.INVALID_TOKEN);
    }
    const userInfo = await provider.getUserInfo({
      idToken: token,
      accessToken: c.body.idToken.accessToken,
      refreshToken: c.body.idToken.refreshToken,
      user: c.body.idToken.user
    });
    if (!userInfo || !userInfo?.user) {
      c.context.logger.error("Failed to get user info", { provider: c.body.provider });
      throw APIError.from("UNAUTHORIZED", BASE_ERROR_CODES.FAILED_TO_GET_USER_INFO);
    }
    if (!userInfo.user.email) {
      c.context.logger.error("User email not found", { provider: c.body.provider });
      throw APIError.from("UNAUTHORIZED", BASE_ERROR_CODES.USER_EMAIL_NOT_FOUND);
    }
    const data = await handleOAuthUserInfo(c, {
      userInfo: {
        ...userInfo.user,
        email: userInfo.user.email,
        id: String(userInfo.user.id),
        name: userInfo.user.name || "",
        image: userInfo.user.image,
        emailVerified: userInfo.user.emailVerified || false
      },
      account: {
        providerId: provider.id,
        accountId: String(userInfo.user.id),
        accessToken: c.body.idToken.accessToken
      },
      callbackURL: c.body.callbackURL,
      disableSignUp: provider.disableImplicitSignUp && !c.body.requestSignUp || provider.disableSignUp
    });
    if (data.error) throw APIError.from("UNAUTHORIZED", {
      message: data.error,
      code: "OAUTH_LINK_ERROR"
    });
    await setSessionCookie(c, data.data);
    return c.json({
      redirect: false,
      token: data.data.session.token,
      url: void 0,
      user: parseUserOutput(c.context.options, data.data.user)
    });
  }
  const { codeVerifier, state } = await generateState(c, void 0, c.body.additionalData);
  const url = await provider.createAuthorizationURL({
    state,
    codeVerifier,
    redirectURI: `${c.context.baseURL}/callback/${provider.id}`,
    scopes: c.body.scopes,
    loginHint: c.body.loginHint
  });
  if (!c.body.disableRedirect) c.setHeader("Location", url.toString());
  return c.json({
    url: url.toString(),
    redirect: !c.body.disableRedirect
  });
});
const signInEmail = () => createAuthEndpoint("/sign-in/email", {
  method: "POST",
  operationId: "signInEmail",
  use: [formCsrfMiddleware],
  body: object({
    email: string().meta({ description: "Email of the user" }),
    password: string().meta({ description: "Password of the user" }),
    callbackURL: string().meta({ description: "Callback URL to use as a redirect for email verification" }).optional(),
    rememberMe: boolean().meta({ description: "If this is false, the session will not be remembered. Default is `true`." }).default(true).optional()
  }),
  metadata: {
    allowedMediaTypes: ["application/x-www-form-urlencoded", "application/json"],
    $Infer: {
      body: {},
      returned: {}
    },
    openapi: {
      operationId: "signInEmail",
      description: "Sign in with email and password",
      responses: { "200": {
        description: "Success - Returns either session details or redirect URL",
        content: { "application/json": { schema: {
          type: "object",
          description: "Session response when idToken is provided",
          properties: {
            redirect: {
              type: "boolean",
              enum: [false]
            },
            token: {
              type: "string",
              description: "Session token"
            },
            url: {
              type: "string",
              nullable: true
            },
            user: {
              type: "object",
              $ref: "#/components/schemas/User"
            }
          },
          required: [
            "redirect",
            "token",
            "user"
          ]
        } } }
      } }
    }
  }
}, async (ctx) => {
  if (!ctx.context.options?.emailAndPassword?.enabled) {
    ctx.context.logger.error("Email and password is not enabled. Make sure to enable it in the options on you `auth.ts` file. Check `https://better-auth.com/docs/authentication/email-password` for more!");
    throw APIError.from("BAD_REQUEST", {
      code: "EMAIL_PASSWORD_DISABLED",
      message: "Email and password is not enabled"
    });
  }
  const { email: email$1, password } = ctx.body;
  if (!email().safeParse(email$1).success) throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.INVALID_EMAIL);
  const user = await ctx.context.internalAdapter.findUserByEmail(email$1, { includeAccounts: true });
  if (!user) {
    await ctx.context.password.hash(password);
    ctx.context.logger.error("User not found", { email: email$1 });
    throw APIError.from("UNAUTHORIZED", BASE_ERROR_CODES.INVALID_EMAIL_OR_PASSWORD);
  }
  const credentialAccount = user.accounts.find((a) => a.providerId === "credential");
  if (!credentialAccount) {
    await ctx.context.password.hash(password);
    ctx.context.logger.error("Credential account not found", { email: email$1 });
    throw APIError.from("UNAUTHORIZED", BASE_ERROR_CODES.INVALID_EMAIL_OR_PASSWORD);
  }
  const currentPassword = credentialAccount?.password;
  if (!currentPassword) {
    await ctx.context.password.hash(password);
    ctx.context.logger.error("Password not found", { email: email$1 });
    throw APIError.from("UNAUTHORIZED", BASE_ERROR_CODES.INVALID_EMAIL_OR_PASSWORD);
  }
  if (!await ctx.context.password.verify({
    hash: currentPassword,
    password
  })) {
    ctx.context.logger.error("Invalid password");
    throw APIError.from("UNAUTHORIZED", BASE_ERROR_CODES.INVALID_EMAIL_OR_PASSWORD);
  }
  if (ctx.context.options?.emailAndPassword?.requireEmailVerification && !user.user.emailVerified) {
    if (!ctx.context.options?.emailVerification?.sendVerificationEmail) throw APIError.from("FORBIDDEN", BASE_ERROR_CODES.EMAIL_NOT_VERIFIED);
    if (ctx.context.options?.emailVerification?.sendOnSignIn) {
      const token = await createEmailVerificationToken(ctx.context.secret, user.user.email, void 0, ctx.context.options.emailVerification?.expiresIn);
      const callbackURL = ctx.body.callbackURL ? encodeURIComponent(ctx.body.callbackURL) : encodeURIComponent("/");
      const url = `${ctx.context.baseURL}/verify-email?token=${token}&callbackURL=${callbackURL}`;
      await ctx.context.runInBackgroundOrAwait(ctx.context.options.emailVerification.sendVerificationEmail({
        user: user.user,
        url,
        token
      }, ctx.request));
    }
    throw APIError.from("FORBIDDEN", BASE_ERROR_CODES.EMAIL_NOT_VERIFIED);
  }
  const session = await ctx.context.internalAdapter.createSession(user.user.id, ctx.body.rememberMe === false);
  if (!session) {
    ctx.context.logger.error("Failed to create session");
    throw APIError.from("UNAUTHORIZED", BASE_ERROR_CODES.FAILED_TO_CREATE_SESSION);
  }
  await setSessionCookie(ctx, {
    session,
    user: user.user
  }, ctx.body.rememberMe === false);
  if (ctx.body.callbackURL) ctx.setHeader("Location", ctx.body.callbackURL);
  return ctx.json({
    redirect: !!ctx.body.callbackURL,
    token: session.token,
    url: ctx.body.callbackURL,
    user: parseUserOutput(ctx.context.options, user.user)
  });
});
const signOut = createAuthEndpoint("/sign-out", {
  method: "POST",
  operationId: "signOut",
  requireHeaders: true,
  metadata: { openapi: {
    operationId: "signOut",
    description: "Sign out the current user",
    responses: { "200": {
      description: "Success",
      content: { "application/json": { schema: {
        type: "object",
        properties: { success: { type: "boolean" } }
      } } }
    } }
  } }
}, async (ctx) => {
  const sessionCookieToken = await ctx.getSignedCookie(ctx.context.authCookies.sessionToken.name, ctx.context.secret);
  if (sessionCookieToken) try {
    await ctx.context.internalAdapter.deleteSession(sessionCookieToken);
  } catch (e) {
    ctx.context.logger.error("Failed to delete session from database", e);
  }
  deleteSessionCookie(ctx);
  return ctx.json({ success: true });
});
const signUpEmailBodySchema = object({
  name: string(),
  email: email(),
  password: string().nonempty(),
  image: string().optional(),
  callbackURL: string().optional(),
  rememberMe: boolean().optional()
}).and(record(string(), any()));
const signUpEmail = () => createAuthEndpoint("/sign-up/email", {
  method: "POST",
  operationId: "signUpWithEmailAndPassword",
  use: [formCsrfMiddleware],
  body: signUpEmailBodySchema,
  metadata: {
    allowedMediaTypes: ["application/x-www-form-urlencoded", "application/json"],
    $Infer: {
      body: {},
      returned: {}
    },
    openapi: {
      operationId: "signUpWithEmailAndPassword",
      description: "Sign up a user using email and password",
      requestBody: { content: { "application/json": { schema: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "The name of the user"
          },
          email: {
            type: "string",
            description: "The email of the user"
          },
          password: {
            type: "string",
            description: "The password of the user"
          },
          image: {
            type: "string",
            description: "The profile image URL of the user"
          },
          callbackURL: {
            type: "string",
            description: "The URL to use for email verification callback"
          },
          rememberMe: {
            type: "boolean",
            description: "If this is false, the session will not be remembered. Default is `true`."
          }
        },
        required: [
          "name",
          "email",
          "password"
        ]
      } } } },
      responses: {
        "200": {
          description: "Successfully created user",
          content: { "application/json": { schema: {
            type: "object",
            properties: {
              token: {
                type: "string",
                nullable: true,
                description: "Authentication token for the session"
              },
              user: {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                    description: "The unique identifier of the user"
                  },
                  email: {
                    type: "string",
                    format: "email",
                    description: "The email address of the user"
                  },
                  name: {
                    type: "string",
                    description: "The name of the user"
                  },
                  image: {
                    type: "string",
                    format: "uri",
                    nullable: true,
                    description: "The profile image URL of the user"
                  },
                  emailVerified: {
                    type: "boolean",
                    description: "Whether the email has been verified"
                  },
                  createdAt: {
                    type: "string",
                    format: "date-time",
                    description: "When the user was created"
                  },
                  updatedAt: {
                    type: "string",
                    format: "date-time",
                    description: "When the user was last updated"
                  }
                },
                required: [
                  "id",
                  "email",
                  "name",
                  "emailVerified",
                  "createdAt",
                  "updatedAt"
                ]
              }
            },
            required: ["user"]
          } } }
        },
        "422": {
          description: "Unprocessable Entity. User already exists or failed to create user.",
          content: { "application/json": { schema: {
            type: "object",
            properties: { message: { type: "string" } }
          } } }
        }
      }
    }
  }
}, async (ctx) => {
  return runWithTransaction(ctx.context.adapter, async () => {
    if (!ctx.context.options.emailAndPassword?.enabled || ctx.context.options.emailAndPassword?.disableSignUp) throw APIError.from("BAD_REQUEST", {
      message: "Email and password sign up is not enabled",
      code: "EMAIL_PASSWORD_SIGN_UP_DISABLED"
    });
    const body = ctx.body;
    const { name, email: email$1, password, image, callbackURL: _callbackURL, rememberMe, ...rest } = body;
    if (!email().safeParse(email$1).success) throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.INVALID_EMAIL);
    if (!password || typeof password !== "string") throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.INVALID_PASSWORD);
    const minPasswordLength = ctx.context.password.config.minPasswordLength;
    if (password.length < minPasswordLength) {
      ctx.context.logger.error("Password is too short");
      throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.PASSWORD_TOO_SHORT);
    }
    const maxPasswordLength = ctx.context.password.config.maxPasswordLength;
    if (password.length > maxPasswordLength) {
      ctx.context.logger.error("Password is too long");
      throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.PASSWORD_TOO_LONG);
    }
    const shouldReturnGenericDuplicateResponse = ctx.context.options.emailAndPassword.requireEmailVerification;
    const shouldSkipAutoSignIn = ctx.context.options.emailAndPassword.autoSignIn === false || shouldReturnGenericDuplicateResponse;
    const additionalUserFields = parseUserInput(ctx.context.options, rest, "create");
    const normalizedEmail = email$1.toLowerCase();
    const dbUser = await ctx.context.internalAdapter.findUserByEmail(normalizedEmail);
    if (dbUser?.user) {
      ctx.context.logger.info(`Sign-up attempt for existing email: ${email$1}`);
      if (shouldReturnGenericDuplicateResponse) {
        await ctx.context.password.hash(password);
        if (ctx.context.options.emailAndPassword?.onExistingUserSignUp) await ctx.context.runInBackgroundOrAwait(ctx.context.options.emailAndPassword.onExistingUserSignUp({ user: dbUser.user }, ctx.request));
        const now2 = /* @__PURE__ */ new Date();
        const generatedId = ctx.context.generateId({ model: "user" }) || generateId();
        const coreFields = {
          name,
          email: normalizedEmail,
          emailVerified: false,
          image: image || null,
          createdAt: now2,
          updatedAt: now2
        };
        const customSyntheticUser = ctx.context.options.emailAndPassword?.customSyntheticUser;
        let syntheticUser;
        if (customSyntheticUser) {
          const additionalFieldKeys = Object.keys(ctx.context.options.user?.additionalFields ?? {});
          const additionalFields = {};
          for (const key of additionalFieldKeys) if (key in additionalUserFields) additionalFields[key] = additionalUserFields[key];
          syntheticUser = customSyntheticUser({
            coreFields,
            additionalFields,
            id: generatedId
          });
        } else syntheticUser = {
          ...coreFields,
          ...additionalUserFields,
          id: generatedId
        };
        return ctx.json({
          token: null,
          user: parseUserOutput(ctx.context.options, syntheticUser)
        });
      }
      throw APIError.from("UNPROCESSABLE_ENTITY", BASE_ERROR_CODES.USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL);
    }
    const hash = await ctx.context.password.hash(password);
    let createdUser;
    try {
      createdUser = await ctx.context.internalAdapter.createUser({
        email: normalizedEmail,
        name,
        image,
        ...additionalUserFields,
        emailVerified: false
      });
      if (!createdUser) throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.FAILED_TO_CREATE_USER);
    } catch (e) {
      if (isDevelopment()) ctx.context.logger.error("Failed to create user", e);
      if (isAPIError(e)) throw e;
      ctx.context.logger?.error("Failed to create user", e);
      throw APIError.from("UNPROCESSABLE_ENTITY", BASE_ERROR_CODES.FAILED_TO_CREATE_USER);
    }
    if (!createdUser) throw APIError.from("UNPROCESSABLE_ENTITY", BASE_ERROR_CODES.FAILED_TO_CREATE_USER);
    await ctx.context.internalAdapter.linkAccount({
      userId: createdUser.id,
      providerId: "credential",
      accountId: createdUser.id,
      password: hash
    });
    if (ctx.context.options.emailVerification?.sendOnSignUp ?? ctx.context.options.emailAndPassword.requireEmailVerification) {
      const token = await createEmailVerificationToken(ctx.context.secret, createdUser.email, void 0, ctx.context.options.emailVerification?.expiresIn);
      const callbackURL = body.callbackURL ? encodeURIComponent(body.callbackURL) : encodeURIComponent("/");
      const url = `${ctx.context.baseURL}/verify-email?token=${token}&callbackURL=${callbackURL}`;
      if (ctx.context.options.emailVerification?.sendVerificationEmail) await ctx.context.runInBackgroundOrAwait(ctx.context.options.emailVerification.sendVerificationEmail({
        user: createdUser,
        url,
        token
      }, ctx.request));
    }
    if (shouldSkipAutoSignIn) return ctx.json({
      token: null,
      user: parseUserOutput(ctx.context.options, createdUser)
    });
    const session = await ctx.context.internalAdapter.createSession(createdUser.id, rememberMe === false);
    if (!session) throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.FAILED_TO_CREATE_SESSION);
    await setSessionCookie(ctx, {
      session,
      user: createdUser
    }, rememberMe === false);
    return ctx.json({
      token: session.token,
      user: parseUserOutput(ctx.context.options, createdUser)
    });
  });
});
const updateSessionBodySchema = record(string().meta({ description: "Field name must be a string" }), any());
const updateSession = () => createAuthEndpoint("/update-session", {
  method: "POST",
  operationId: "updateSession",
  body: updateSessionBodySchema,
  use: [sessionMiddleware],
  metadata: {
    $Infer: { body: {} },
    openapi: {
      operationId: "updateSession",
      description: "Update the current session",
      responses: { "200": {
        description: "Success",
        content: { "application/json": { schema: {
          type: "object",
          properties: { session: {
            type: "object",
            $ref: "#/components/schemas/Session"
          } }
        } } }
      } }
    }
  }
}, async (ctx) => {
  const body = ctx.body;
  if (typeof body !== "object" || Array.isArray(body)) throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.BODY_MUST_BE_AN_OBJECT);
  const session = ctx.context.session;
  const additionalFields = parseSessionInput(ctx.context.options, body, "update");
  if (Object.keys(additionalFields).length === 0) throw APIError.fromStatus("BAD_REQUEST", { message: "No fields to update" });
  const newSession = await ctx.context.internalAdapter.updateSession(session.session.token, {
    ...additionalFields,
    updatedAt: /* @__PURE__ */ new Date()
  }) ?? {
    ...session.session,
    ...additionalFields,
    updatedAt: /* @__PURE__ */ new Date()
  };
  await setSessionCookie(ctx, {
    session: newSession,
    user: session.user
  });
  return ctx.json({ session: parseSessionOutput(ctx.context.options, newSession) });
});
const updateUserBodySchema = record(string().meta({ description: "Field name must be a string" }), any());
const updateUser = () => createAuthEndpoint("/update-user", {
  method: "POST",
  operationId: "updateUser",
  body: updateUserBodySchema,
  use: [sessionMiddleware],
  metadata: {
    $Infer: { body: {} },
    openapi: {
      operationId: "updateUser",
      description: "Update the current user",
      requestBody: { content: { "application/json": { schema: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "The name of the user"
          },
          image: {
            type: "string",
            description: "The image of the user",
            nullable: true
          }
        }
      } } } },
      responses: { "200": {
        description: "Success",
        content: { "application/json": { schema: {
          type: "object",
          properties: { user: {
            type: "object",
            $ref: "#/components/schemas/User"
          } }
        } } }
      } }
    }
  }
}, async (ctx) => {
  const body = ctx.body;
  if (typeof body !== "object" || Array.isArray(body)) throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.BODY_MUST_BE_AN_OBJECT);
  if (body.email) throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.EMAIL_CAN_NOT_BE_UPDATED);
  const { name, image, ...rest } = body;
  const session = ctx.context.session;
  const additionalFields = parseUserInput(ctx.context.options, rest, "update");
  if (image === void 0 && name === void 0 && Object.keys(additionalFields).length === 0) throw APIError.fromStatus("BAD_REQUEST", { message: "No fields to update" });
  const updatedUser = await ctx.context.internalAdapter.updateUser(session.user.id, {
    name,
    image,
    ...additionalFields
  }) ?? {
    ...session.user,
    ...name !== void 0 && { name },
    ...image !== void 0 && { image },
    ...additionalFields
  };
  await setSessionCookie(ctx, {
    session: session.session,
    user: updatedUser
  });
  return ctx.json({ status: true });
});
const changePassword = createAuthEndpoint("/change-password", {
  method: "POST",
  operationId: "changePassword",
  body: object({
    newPassword: string().meta({ description: "The new password to set" }),
    currentPassword: string().meta({ description: "The current password is required" }),
    revokeOtherSessions: boolean().meta({ description: "Must be a boolean value" }).optional()
  }),
  use: [sensitiveSessionMiddleware],
  metadata: { openapi: {
    operationId: "changePassword",
    description: "Change the password of the user",
    responses: { "200": {
      description: "Password successfully changed",
      content: { "application/json": { schema: {
        type: "object",
        properties: {
          token: {
            type: "string",
            nullable: true,
            description: "New session token if other sessions were revoked"
          },
          user: {
            type: "object",
            properties: {
              id: {
                type: "string",
                description: "The unique identifier of the user"
              },
              email: {
                type: "string",
                format: "email",
                description: "The email address of the user"
              },
              name: {
                type: "string",
                description: "The name of the user"
              },
              image: {
                type: "string",
                format: "uri",
                nullable: true,
                description: "The profile image URL of the user"
              },
              emailVerified: {
                type: "boolean",
                description: "Whether the email has been verified"
              },
              createdAt: {
                type: "string",
                format: "date-time",
                description: "When the user was created"
              },
              updatedAt: {
                type: "string",
                format: "date-time",
                description: "When the user was last updated"
              }
            },
            required: [
              "id",
              "email",
              "name",
              "emailVerified",
              "createdAt",
              "updatedAt"
            ]
          }
        },
        required: ["user"]
      } } }
    } }
  } }
}, async (ctx) => {
  const { newPassword, currentPassword, revokeOtherSessions: revokeOtherSessions2 } = ctx.body;
  const session = ctx.context.session;
  const minPasswordLength = ctx.context.password.config.minPasswordLength;
  if (newPassword.length < minPasswordLength) {
    ctx.context.logger.error("Password is too short");
    throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.PASSWORD_TOO_SHORT);
  }
  const maxPasswordLength = ctx.context.password.config.maxPasswordLength;
  if (newPassword.length > maxPasswordLength) {
    ctx.context.logger.error("Password is too long");
    throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.PASSWORD_TOO_LONG);
  }
  const account = (await ctx.context.internalAdapter.findAccounts(session.user.id)).find((account2) => account2.providerId === "credential" && account2.password);
  if (!account || !account.password) throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.CREDENTIAL_ACCOUNT_NOT_FOUND);
  const passwordHash = await ctx.context.password.hash(newPassword);
  if (!await ctx.context.password.verify({
    hash: account.password,
    password: currentPassword
  })) throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.INVALID_PASSWORD);
  await ctx.context.internalAdapter.updateAccount(account.id, { password: passwordHash });
  let token = null;
  if (revokeOtherSessions2) {
    await ctx.context.internalAdapter.deleteSessions(session.user.id);
    const newSession = await ctx.context.internalAdapter.createSession(session.user.id);
    if (!newSession) throw APIError.from("INTERNAL_SERVER_ERROR", BASE_ERROR_CODES.FAILED_TO_GET_SESSION);
    await setSessionCookie(ctx, {
      session: newSession,
      user: session.user
    });
    token = newSession.token;
  }
  return ctx.json({
    token,
    user: parseUserOutput(ctx.context.options, session.user)
  });
});
const setPassword = createAuthEndpoint({
  method: "POST",
  body: object({ newPassword: string().meta({ description: "The new password to set is required" }) }),
  use: [sensitiveSessionMiddleware]
}, async (ctx) => {
  const { newPassword } = ctx.body;
  const session = ctx.context.session;
  const minPasswordLength = ctx.context.password.config.minPasswordLength;
  if (newPassword.length < minPasswordLength) {
    ctx.context.logger.error("Password is too short");
    throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.PASSWORD_TOO_SHORT);
  }
  const maxPasswordLength = ctx.context.password.config.maxPasswordLength;
  if (newPassword.length > maxPasswordLength) {
    ctx.context.logger.error("Password is too long");
    throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.PASSWORD_TOO_LONG);
  }
  const account = (await ctx.context.internalAdapter.findAccounts(session.user.id)).find((account2) => account2.providerId === "credential" && account2.password);
  const passwordHash = await ctx.context.password.hash(newPassword);
  if (!account) {
    await ctx.context.internalAdapter.linkAccount({
      userId: session.user.id,
      providerId: "credential",
      accountId: session.user.id,
      password: passwordHash
    });
    return ctx.json({ status: true });
  }
  throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.PASSWORD_ALREADY_SET);
});
const deleteUser = createAuthEndpoint("/delete-user", {
  method: "POST",
  use: [sensitiveSessionMiddleware],
  body: object({
    callbackURL: string().meta({ description: "The callback URL to redirect to after the user is deleted" }).optional(),
    password: string().meta({ description: "The password of the user is required to delete the user" }).optional(),
    token: string().meta({ description: "The token to delete the user is required" }).optional()
  }),
  metadata: { openapi: {
    operationId: "deleteUser",
    description: "Delete the user",
    requestBody: { content: { "application/json": { schema: {
      type: "object",
      properties: {
        callbackURL: {
          type: "string",
          description: "The callback URL to redirect to after the user is deleted"
        },
        password: {
          type: "string",
          description: "The user's password. Required if session is not fresh"
        },
        token: {
          type: "string",
          description: "The deletion verification token"
        }
      }
    } } } },
    responses: { "200": {
      description: "User deletion processed successfully",
      content: { "application/json": { schema: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            description: "Indicates if the operation was successful"
          },
          message: {
            type: "string",
            enum: ["User deleted", "Verification email sent"],
            description: "Status message of the deletion process"
          }
        },
        required: ["success", "message"]
      } } }
    } }
  } }
}, async (ctx) => {
  if (!ctx.context.options.user?.deleteUser?.enabled) {
    ctx.context.logger.error("Delete user is disabled. Enable it in the options");
    throw APIError.fromStatus("NOT_FOUND");
  }
  const session = ctx.context.session;
  if (ctx.body.password) {
    const account = (await ctx.context.internalAdapter.findAccounts(session.user.id)).find((account2) => account2.providerId === "credential" && account2.password);
    if (!account || !account.password) throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.CREDENTIAL_ACCOUNT_NOT_FOUND);
    if (!await ctx.context.password.verify({
      hash: account.password,
      password: ctx.body.password
    })) throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.INVALID_PASSWORD);
  }
  if (ctx.body.token) {
    await deleteUserCallback({
      ...ctx,
      query: { token: ctx.body.token }
    });
    return ctx.json({
      success: true,
      message: "User deleted"
    });
  }
  if (ctx.context.options.user.deleteUser?.sendDeleteAccountVerification) {
    const token = generateRandomString(32, "0-9", "a-z");
    await ctx.context.internalAdapter.createVerificationValue({
      value: session.user.id,
      identifier: `delete-account-${token}`,
      expiresAt: new Date(Date.now() + (ctx.context.options.user.deleteUser?.deleteTokenExpiresIn || 3600 * 24) * 1e3)
    });
    const url = `${ctx.context.baseURL}/delete-user/callback?token=${token}&callbackURL=${encodeURIComponent(ctx.body.callbackURL || "/")}`;
    await ctx.context.runInBackgroundOrAwait(ctx.context.options.user.deleteUser.sendDeleteAccountVerification({
      user: session.user,
      url,
      token
    }, ctx.request));
    return ctx.json({
      success: true,
      message: "Verification email sent"
    });
  }
  if (!ctx.body.password && ctx.context.sessionConfig.freshAge !== 0) {
    const currentAge = new Date(session.session.createdAt).getTime();
    const freshAge = ctx.context.sessionConfig.freshAge * 1e3;
    if (Date.now() - currentAge > freshAge) throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.SESSION_EXPIRED);
  }
  const beforeDelete = ctx.context.options.user.deleteUser?.beforeDelete;
  if (beforeDelete) await beforeDelete(session.user, ctx.request);
  await ctx.context.internalAdapter.deleteUser(session.user.id);
  await ctx.context.internalAdapter.deleteSessions(session.user.id);
  deleteSessionCookie(ctx);
  const afterDelete = ctx.context.options.user.deleteUser?.afterDelete;
  if (afterDelete) await afterDelete(session.user, ctx.request);
  return ctx.json({
    success: true,
    message: "User deleted"
  });
});
const deleteUserCallback = createAuthEndpoint("/delete-user/callback", {
  method: "GET",
  query: object({
    token: string().meta({ description: "The token to verify the deletion request" }),
    callbackURL: string().meta({ description: "The URL to redirect to after deletion" }).optional()
  }),
  use: [originCheck((ctx) => ctx.query.callbackURL)],
  metadata: { openapi: {
    description: "Callback to complete user deletion with verification token",
    responses: { "200": {
      description: "User successfully deleted",
      content: { "application/json": { schema: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            description: "Indicates if the deletion was successful"
          },
          message: {
            type: "string",
            enum: ["User deleted"],
            description: "Confirmation message"
          }
        },
        required: ["success", "message"]
      } } }
    } }
  } }
}, async (ctx) => {
  if (!ctx.context.options.user?.deleteUser?.enabled) {
    ctx.context.logger.error("Delete user is disabled. Enable it in the options");
    throw APIError.from("NOT_FOUND", {
      message: "Not found",
      code: "NOT_FOUND"
    });
  }
  const session = await getSessionFromCtx(ctx);
  if (!session) throw APIError.from("NOT_FOUND", BASE_ERROR_CODES.FAILED_TO_GET_USER_INFO);
  const token = await ctx.context.internalAdapter.findVerificationValue(`delete-account-${ctx.query.token}`);
  if (!token || token.expiresAt < /* @__PURE__ */ new Date()) throw APIError.from("NOT_FOUND", BASE_ERROR_CODES.INVALID_TOKEN);
  if (token.value !== session.user.id) throw APIError.from("NOT_FOUND", BASE_ERROR_CODES.INVALID_TOKEN);
  const beforeDelete = ctx.context.options.user.deleteUser?.beforeDelete;
  if (beforeDelete) await beforeDelete(session.user, ctx.request);
  await ctx.context.internalAdapter.deleteUser(session.user.id);
  await ctx.context.internalAdapter.deleteSessions(session.user.id);
  await ctx.context.internalAdapter.deleteAccounts(session.user.id);
  await ctx.context.internalAdapter.deleteVerificationByIdentifier(`delete-account-${ctx.query.token}`);
  deleteSessionCookie(ctx);
  const afterDelete = ctx.context.options.user.deleteUser?.afterDelete;
  if (afterDelete) await afterDelete(session.user, ctx.request);
  if (ctx.query.callbackURL) throw ctx.redirect(ctx.query.callbackURL || "/");
  return ctx.json({
    success: true,
    message: "User deleted"
  });
});
const changeEmail = createAuthEndpoint("/change-email", {
  method: "POST",
  body: object({
    newEmail: email().meta({ description: "The new email address to set must be a valid email address" }),
    callbackURL: string().meta({ description: "The URL to redirect to after email verification" }).optional()
  }),
  use: [sensitiveSessionMiddleware],
  metadata: { openapi: {
    operationId: "changeEmail",
    responses: { "200": {
      description: "Email change request processed successfully",
      content: { "application/json": { schema: {
        type: "object",
        properties: {
          user: {
            type: "object",
            $ref: "#/components/schemas/User"
          },
          status: {
            type: "boolean",
            description: "Indicates if the request was successful"
          },
          message: {
            type: "string",
            enum: ["Email updated", "Verification email sent"],
            description: "Status message of the email change process",
            nullable: true
          }
        },
        required: ["status"]
      } } }
    } }
  } }
}, async (ctx) => {
  if (!ctx.context.options.user?.changeEmail?.enabled) {
    ctx.context.logger.error("Change email is disabled.");
    throw APIError.fromStatus("BAD_REQUEST", { message: "Change email is disabled" });
  }
  const newEmail = ctx.body.newEmail.toLowerCase();
  if (newEmail === ctx.context.session.user.email) {
    ctx.context.logger.error("Email is the same");
    throw APIError.fromStatus("BAD_REQUEST", { message: "Email is the same" });
  }
  const canUpdateWithoutVerification = ctx.context.session.user.emailVerified !== true && ctx.context.options.user.changeEmail.updateEmailWithoutVerification;
  const canSendConfirmation = ctx.context.session.user.emailVerified && ctx.context.options.user.changeEmail.sendChangeEmailConfirmation;
  const canSendVerification = ctx.context.options.emailVerification?.sendVerificationEmail;
  if (!canUpdateWithoutVerification && !canSendConfirmation && !canSendVerification) {
    ctx.context.logger.error("Verification email isn't enabled.");
    throw APIError.fromStatus("BAD_REQUEST", { message: "Verification email isn't enabled" });
  }
  if (await ctx.context.internalAdapter.findUserByEmail(newEmail)) {
    await createEmailVerificationToken(ctx.context.secret, ctx.context.session.user.email, newEmail, ctx.context.options.emailVerification?.expiresIn);
    ctx.context.logger.info("Change email attempt for existing email");
    return ctx.json({ status: true });
  }
  if (canUpdateWithoutVerification) {
    await ctx.context.internalAdapter.updateUserByEmail(ctx.context.session.user.email, { email: newEmail });
    await setSessionCookie(ctx, {
      session: ctx.context.session.session,
      user: {
        ...ctx.context.session.user,
        email: newEmail
      }
    });
    if (canSendVerification) {
      const token2 = await createEmailVerificationToken(ctx.context.secret, newEmail, void 0, ctx.context.options.emailVerification?.expiresIn);
      const url2 = `${ctx.context.baseURL}/verify-email?token=${token2}&callbackURL=${ctx.body.callbackURL || "/"}`;
      await ctx.context.runInBackgroundOrAwait(canSendVerification({
        user: {
          ...ctx.context.session.user,
          email: newEmail
        },
        url: url2,
        token: token2
      }, ctx.request));
    }
    return ctx.json({ status: true });
  }
  if (canSendConfirmation) {
    const token2 = await createEmailVerificationToken(ctx.context.secret, ctx.context.session.user.email, newEmail, ctx.context.options.emailVerification?.expiresIn, { requestType: "change-email-confirmation" });
    const url2 = `${ctx.context.baseURL}/verify-email?token=${token2}&callbackURL=${ctx.body.callbackURL || "/"}`;
    await ctx.context.runInBackgroundOrAwait(canSendConfirmation({
      user: ctx.context.session.user,
      newEmail,
      url: url2,
      token: token2
    }, ctx.request));
    return ctx.json({ status: true });
  }
  if (!canSendVerification) {
    ctx.context.logger.error("Verification email isn't enabled.");
    throw APIError.fromStatus("BAD_REQUEST", { message: "Verification email isn't enabled" });
  }
  const token = await createEmailVerificationToken(ctx.context.secret, ctx.context.session.user.email, newEmail, ctx.context.options.emailVerification?.expiresIn, { requestType: "change-email-verification" });
  const url = `${ctx.context.baseURL}/verify-email?token=${token}&callbackURL=${ctx.body.callbackURL || "/"}`;
  await ctx.context.runInBackgroundOrAwait(canSendVerification({
    user: {
      ...ctx.context.session.user,
      email: newEmail
    },
    url,
    token
  }, ctx.request));
  return ctx.json({ status: true });
});
const defuReplaceArrays = createDefu((obj, key, value) => {
  if (Array.isArray(obj[key]) && Array.isArray(value)) {
    obj[key] = value;
    return true;
  }
});
const hooksSourceWeakMap = /* @__PURE__ */ new WeakMap();
function toAuthEndpoints(endpoints, ctx) {
  const api = {};
  for (const [key, endpoint] of Object.entries(endpoints)) {
    api[key] = async (context2) => {
      const run = async () => {
        const authContext = await ctx;
        let internalContext = {
          ...context2,
          context: {
            ...authContext,
            returned: void 0,
            responseHeaders: void 0,
            session: null
          },
          path: endpoint.path,
          headers: context2?.headers ? new Headers(context2?.headers) : void 0
        };
        return runWithEndpointContext(internalContext, async () => {
          const { beforeHooks, afterHooks } = getHooks(authContext);
          const before = await runBeforeHooks(internalContext, beforeHooks);
          if ("context" in before && before.context && typeof before.context === "object") {
            const { headers, ...rest } = before.context;
            if (headers) headers.forEach((value, key2) => {
              internalContext.headers.set(key2, value);
            });
            internalContext = defuReplaceArrays(rest, internalContext);
          } else if (before) return context2?.asResponse ? toResponse(before, { headers: context2?.headers }) : context2?.returnHeaders ? {
            headers: context2?.headers,
            response: before
          } : before;
          internalContext.asResponse = false;
          internalContext.returnHeaders = true;
          internalContext.returnStatus = true;
          const result = await runWithEndpointContext(internalContext, () => endpoint(internalContext)).catch((e) => {
            if (isAPIError(e))
              return {
                response: e,
                status: e.statusCode,
                headers: e.headers ? new Headers(e.headers) : null
              };
            throw e;
          });
          if (result && result instanceof Response) return result;
          internalContext.context.returned = result.response;
          internalContext.context.responseHeaders = result.headers;
          const after = await runAfterHooks(internalContext, afterHooks);
          if (after.response) result.response = after.response;
          if (isAPIError(result.response) && shouldPublishLog(authContext.logger.level, "debug")) result.response.stack = result.response.errorStack;
          if (isAPIError(result.response) && !context2?.asResponse) throw result.response;
          return context2?.asResponse ? toResponse(result.response, {
            headers: result.headers,
            status: result.status
          }) : context2?.returnHeaders ? context2?.returnStatus ? {
            headers: result.headers,
            response: result.response,
            status: result.status
          } : {
            headers: result.headers,
            response: result.response
          } : context2?.returnStatus ? {
            response: result.response,
            status: result.status
          } : result.response;
        });
      };
      if (await hasRequestState()) return run();
      else return runWithRequestState(/* @__PURE__ */ new WeakMap(), run);
    };
    api[key].path = endpoint.path;
    api[key].options = endpoint.options;
  }
  return api;
}
async function runBeforeHooks(context2, hooks) {
  let modifiedContext = {};
  for (const hook of hooks) {
    let matched = false;
    try {
      matched = hook.matcher(context2);
    } catch (error2) {
      const hookSource = hooksSourceWeakMap.get(hook.handler) ?? "unknown";
      context2.context.logger.error(`An error occurred during ${hookSource} hook matcher execution:`, error2);
      throw new APIError("INTERNAL_SERVER_ERROR", { message: `An error occurred during hook matcher execution. Check the logs for more details.` });
    }
    if (matched) {
      const result = await hook.handler({
        ...context2,
        returnHeaders: false
      }).catch((e) => {
        if (isAPIError(e) && shouldPublishLog(context2.context.logger.level, "debug")) e.stack = e.errorStack;
        throw e;
      });
      if (result && typeof result === "object") {
        if ("context" in result && typeof result.context === "object") {
          const { headers, ...rest } = result.context;
          if (headers instanceof Headers) if (modifiedContext.headers) headers.forEach((value, key) => {
            modifiedContext.headers?.set(key, value);
          });
          else modifiedContext.headers = headers;
          modifiedContext = defuReplaceArrays(rest, modifiedContext);
          continue;
        }
        return result;
      }
    }
  }
  return { context: modifiedContext };
}
async function runAfterHooks(context2, hooks) {
  for (const hook of hooks) if (hook.matcher(context2)) {
    const result = await hook.handler(context2).catch((e) => {
      if (isAPIError(e)) {
        const headers = e[kAPIErrorHeaderSymbol];
        if (shouldPublishLog(context2.context.logger.level, "debug")) e.stack = e.errorStack;
        return {
          response: e,
          headers: headers ? headers : e.headers ? new Headers(e.headers) : null
        };
      }
      throw e;
    });
    if (result.headers) result.headers.forEach((value, key) => {
      if (!context2.context.responseHeaders) context2.context.responseHeaders = new Headers({ [key]: value });
      else if (key.toLowerCase() === "set-cookie") context2.context.responseHeaders.append(key, value);
      else context2.context.responseHeaders.set(key, value);
    });
    if (result.response) context2.context.returned = result.response;
  }
  return {
    response: context2.context.returned,
    headers: context2.context.responseHeaders
  };
}
function getHooks(authContext) {
  const plugins = authContext.options.plugins || [];
  const beforeHooks = [];
  const afterHooks = [];
  const beforeHookHandler = authContext.options.hooks?.before;
  if (beforeHookHandler) {
    hooksSourceWeakMap.set(beforeHookHandler, "user");
    beforeHooks.push({
      matcher: () => true,
      handler: beforeHookHandler
    });
  }
  const afterHookHandler = authContext.options.hooks?.after;
  if (afterHookHandler) {
    hooksSourceWeakMap.set(afterHookHandler, "user");
    afterHooks.push({
      matcher: () => true,
      handler: afterHookHandler
    });
  }
  const pluginBeforeHooks = plugins.filter((plugin) => plugin.hooks?.before).map((plugin) => plugin.hooks?.before).flat();
  const pluginAfterHooks = plugins.filter((plugin) => plugin.hooks?.after).map((plugin) => plugin.hooks?.after).flat();
  if (pluginBeforeHooks.length) beforeHooks.push(...pluginBeforeHooks);
  if (pluginAfterHooks.length) afterHooks.push(...pluginAfterHooks);
  return {
    beforeHooks,
    afterHooks
  };
}
function checkEndpointConflicts(options, logger2) {
  const endpointRegistry = /* @__PURE__ */ new Map();
  options.plugins?.forEach((plugin) => {
    if (plugin.endpoints) {
      for (const [key, endpoint] of Object.entries(plugin.endpoints)) if (endpoint && "path" in endpoint && typeof endpoint.path === "string") {
        const path2 = endpoint.path;
        let methods = [];
        if (endpoint.options && "method" in endpoint.options) {
          if (Array.isArray(endpoint.options.method)) methods = endpoint.options.method;
          else if (typeof endpoint.options.method === "string") methods = [endpoint.options.method];
        }
        if (methods.length === 0) methods = ["*"];
        if (!endpointRegistry.has(path2)) endpointRegistry.set(path2, []);
        endpointRegistry.get(path2).push({
          pluginId: plugin.id,
          endpointKey: key,
          methods
        });
      }
    }
  });
  const conflicts = [];
  for (const [path2, entries] of endpointRegistry.entries()) if (entries.length > 1) {
    const methodMap = /* @__PURE__ */ new Map();
    let hasConflict = false;
    for (const entry of entries) for (const method of entry.methods) {
      if (!methodMap.has(method)) methodMap.set(method, []);
      methodMap.get(method).push(entry.pluginId);
      if (methodMap.get(method).length > 1) hasConflict = true;
      if (method === "*" && entries.length > 1) hasConflict = true;
      else if (method !== "*" && methodMap.has("*")) hasConflict = true;
    }
    if (hasConflict) {
      const uniquePlugins = [...new Set(entries.map((e) => e.pluginId))];
      const conflictingMethods = [];
      for (const [method, plugins] of methodMap.entries()) if (plugins.length > 1 || method === "*" && entries.length > 1 || method !== "*" && methodMap.has("*")) conflictingMethods.push(method);
      conflicts.push({
        path: path2,
        plugins: uniquePlugins,
        conflictingMethods
      });
    }
  }
  if (conflicts.length > 0) {
    const conflictMessages = conflicts.map((conflict) => `  - "${conflict.path}" [${conflict.conflictingMethods.join(", ")}] used by plugins: ${conflict.plugins.join(", ")}`).join("\n");
    logger2.error(`Endpoint path conflicts detected! Multiple plugins are trying to use the same endpoint paths with conflicting HTTP methods:
${conflictMessages}

To resolve this, you can:
	1. Use only one of the conflicting plugins
	2. Configure the plugins to use different paths (if supported)
	3. Ensure plugins use different HTTP methods for the same path
`);
  }
}
function getEndpoints(ctx, options) {
  const pluginEndpoints = options.plugins?.reduce((acc, plugin) => {
    return {
      ...acc,
      ...plugin.endpoints
    };
  }, {}) ?? {};
  const middlewares = options.plugins?.map((plugin) => plugin.middlewares?.map((m) => {
    const middleware = (async (context2) => {
      const authContext = await ctx;
      return m.middleware({
        ...context2,
        context: {
          ...authContext,
          ...context2.context
        }
      });
    });
    middleware.options = m.middleware.options;
    return {
      path: m.path,
      middleware
    };
  })).filter((plugin) => plugin !== void 0).flat() || [];
  return {
    api: toAuthEndpoints({
      signInSocial: signInSocial(),
      callbackOAuth,
      getSession: getSession(),
      signOut,
      signUpEmail: signUpEmail(),
      signInEmail: signInEmail(),
      resetPassword,
      verifyPassword,
      verifyEmail,
      sendVerificationEmail,
      changeEmail,
      changePassword,
      setPassword,
      updateSession: updateSession(),
      updateUser: updateUser(),
      deleteUser,
      requestPasswordReset,
      requestPasswordResetCallback,
      listSessions: listSessions(),
      revokeSession,
      revokeSessions,
      revokeOtherSessions,
      linkSocialAccount,
      listUserAccounts,
      deleteUserCallback,
      unlinkAccount,
      refreshToken,
      getAccessToken,
      accountInfo,
      ...pluginEndpoints,
      ok,
      error
    }, ctx),
    middlewares
  };
}
const router$1 = (ctx, options) => {
  const { api, middlewares } = getEndpoints(ctx, options);
  const basePath = new URL(ctx.baseURL).pathname;
  return createRouter$1(api, {
    routerContext: ctx,
    openapi: { disabled: true },
    basePath,
    routerMiddleware: [{
      path: "/**",
      middleware: originCheckMiddleware
    }, ...middlewares],
    allowedMediaTypes: ["application/json"],
    skipTrailingSlashes: options.advanced?.skipTrailingSlashes ?? false,
    async onRequest(req) {
      const disabledPaths = ctx.options.disabledPaths || [];
      const normalizedPath = normalizePathname(req.url, basePath);
      if (disabledPaths.includes(normalizedPath)) return new Response("Not Found", { status: 404 });
      let currentRequest = req;
      for (const plugin of ctx.options.plugins || []) if (plugin.onRequest) {
        const response = await plugin.onRequest(currentRequest, ctx);
        if (response && "response" in response) return response.response;
        if (response && "request" in response) currentRequest = response.request;
      }
      const rateLimitResponse2 = await onRequestRateLimit(currentRequest, ctx);
      if (rateLimitResponse2) return rateLimitResponse2;
      return currentRequest;
    },
    async onResponse(res, req) {
      await onResponseRateLimit(req, ctx);
      for (const plugin of ctx.options.plugins || []) if (plugin.onResponse) {
        const response = await plugin.onResponse(res, ctx);
        if (response) return response.response;
      }
      return res;
    },
    onError(e) {
      if (isAPIError(e) && e.status === "FOUND") return;
      if (options.onAPIError?.throw) throw e;
      if (options.onAPIError?.onError) {
        options.onAPIError.onError(e, ctx);
        return;
      }
      const optLogLevel = options.logger?.level;
      const log = optLogLevel === "error" || optLogLevel === "warn" || optLogLevel === "debug" ? logger : void 0;
      if (options.logger?.disabled !== true) {
        if (e && typeof e === "object" && "message" in e && typeof e.message === "string") {
          if (e.message.includes("no column") || e.message.includes("column") || e.message.includes("relation") || e.message.includes("table") || e.message.includes("does not exist")) {
            ctx.logger?.error(e.message);
            return;
          }
        }
        if (isAPIError(e)) {
          if (e.status === "INTERNAL_SERVER_ERROR") ctx.logger.error(e.status, e);
          log?.error(e.message);
        } else ctx.logger?.error(e && typeof e === "object" && "name" in e ? e.name : "", e);
      }
    }
  });
};
async function getBaseAdapter(options, handleDirectDatabase) {
  let adapter2;
  if (!options.database) {
    const tables = getAuthTables(options);
    const memoryDB = Object.keys(tables).reduce((acc, key) => {
      acc[key] = [];
      return acc;
    }, {});
    const { memoryAdapter } = await import("../_libs/better-auth__memory-adapter.mjs");
    adapter2 = memoryAdapter(memoryDB)(options);
  } else if (typeof options.database === "function") adapter2 = options.database(options);
  else adapter2 = await handleDirectDatabase(options);
  if (!adapter2.transaction) {
    logger.warn("Adapter does not correctly implement transaction function, patching it automatically. Please update your adapter implementation.");
    adapter2.transaction = async (cb) => {
      return cb(adapter2);
    };
  }
  return adapter2;
}
async function getAdapter(options) {
  return getBaseAdapter(options, async (opts) => {
    const { createKyselyAdapter: createKyselyAdapter2 } = await import("./server-BubZoQFo.mjs").then(function(n) {
      return n.a;
    });
    const { kysely, databaseType, transaction } = await createKyselyAdapter2(opts);
    if (!kysely) throw new BetterAuthError("Failed to initialize database adapter");
    const { kyselyAdapter } = await import("./server-BubZoQFo.mjs").then(function(n) {
      return n.a;
    });
    return kyselyAdapter(kysely, {
      type: databaseType || "sqlite",
      debugLogs: opts.database && "debugLogs" in opts.database ? opts.database.debugLogs : false,
      transaction
    })(opts);
  });
}
const map = {
  postgres: {
    string: [
      "character varying",
      "varchar",
      "text",
      "uuid"
    ],
    number: [
      "int4",
      "integer",
      "bigint",
      "smallint",
      "numeric",
      "real",
      "double precision"
    ],
    boolean: ["bool", "boolean"],
    date: [
      "timestamptz",
      "timestamp",
      "date"
    ],
    json: ["json", "jsonb"]
  },
  mysql: {
    string: [
      "varchar",
      "text",
      "uuid"
    ],
    number: [
      "integer",
      "int",
      "bigint",
      "smallint",
      "decimal",
      "float",
      "double"
    ],
    boolean: ["boolean", "tinyint"],
    date: [
      "timestamp",
      "datetime",
      "date"
    ],
    json: ["json"]
  },
  sqlite: {
    string: ["TEXT"],
    number: ["INTEGER", "REAL"],
    boolean: ["INTEGER", "BOOLEAN"],
    date: ["DATE", "INTEGER"],
    json: ["TEXT"]
  },
  mssql: {
    string: [
      "varchar",
      "nvarchar",
      "uniqueidentifier"
    ],
    number: [
      "int",
      "bigint",
      "smallint",
      "decimal",
      "float",
      "double"
    ],
    boolean: ["bit", "smallint"],
    date: [
      "datetime2",
      "date",
      "datetime"
    ],
    json: ["varchar", "nvarchar"]
  }
};
function matchType(columnDataType, fieldType, dbType) {
  function normalize(type) {
    return type.toLowerCase().split("(")[0].trim();
  }
  if (fieldType === "string[]" || fieldType === "number[]") return columnDataType.toLowerCase().includes("json");
  const types = map[dbType];
  return (Array.isArray(fieldType) ? types["string"].map((t) => t.toLowerCase()) : types[fieldType].map((t) => t.toLowerCase())).includes(normalize(columnDataType));
}
async function getPostgresSchema(db) {
  try {
    const result = await sql`SHOW search_path`.execute(db);
    const searchPath = result.rows[0]?.search_path ?? result.rows[0]?.searchPath;
    if (searchPath) return searchPath.split(",").map((s) => s.trim()).map((s) => s.replace(/^["']|["']$/g, "")).filter((s) => !s.startsWith("$") && !s.startsWith("\\$"))[0] || "public";
  } catch {
  }
  return "public";
}
async function getMigrations(config2) {
  const betterAuthSchema = getSchema(config2);
  const logger2 = createLogger(config2.logger);
  let { kysely: db, databaseType: dbType } = await createKyselyAdapter(config2);
  if (!dbType) {
    logger2.warn("Could not determine database type, defaulting to sqlite. Please provide a type in the database options to avoid this.");
    dbType = "sqlite";
  }
  if (!db) {
    logger2.error("Only kysely adapter is supported for migrations. You can use `generate` command to generate the schema, if you're using a different adapter.");
    process.exit(1);
  }
  let currentSchema = "public";
  if (dbType === "postgres") {
    currentSchema = await getPostgresSchema(db);
    logger2.debug(`PostgreSQL migration: Using schema '${currentSchema}' (from search_path)`);
    try {
      const schemaCheck = await sql`
				SELECT schema_name
				FROM information_schema.schemata
				WHERE schema_name = ${currentSchema}
			`.execute(db);
      if (!(schemaCheck.rows[0]?.schema_name ?? schemaCheck.rows[0]?.schemaName)) logger2.warn(`Schema '${currentSchema}' does not exist. Tables will be inspected from available schemas. Consider creating the schema first or checking your database configuration.`);
    } catch (error2) {
      logger2.debug(`Could not verify schema existence: ${error2 instanceof Error ? error2.message : String(error2)}`);
    }
  }
  const allTableMetadata = await db.introspection.getTables();
  let tableMetadata = allTableMetadata;
  if (dbType === "postgres") try {
    const tablesInSchema = await sql`
				SELECT table_name
				FROM information_schema.tables
				WHERE table_schema = ${currentSchema}
				AND table_type = 'BASE TABLE'
			`.execute(db);
    const tableNamesInSchema = new Set(tablesInSchema.rows.map((row) => row.table_name ?? row.tableName));
    tableMetadata = allTableMetadata.filter((table) => table.schema === currentSchema && tableNamesInSchema.has(table.name));
    logger2.debug(`Found ${tableMetadata.length} table(s) in schema '${currentSchema}': ${tableMetadata.map((t) => t.name).join(", ") || "(none)"}`);
  } catch (error2) {
    logger2.warn(`Could not filter tables by schema. Using all discovered tables. Error: ${error2 instanceof Error ? error2.message : String(error2)}`);
  }
  const toBeCreated = [];
  const toBeAdded = [];
  for (const [key, value] of Object.entries(betterAuthSchema)) {
    const table = tableMetadata.find((t) => t.name === key);
    if (!table) {
      const tIndex = toBeCreated.findIndex((t) => t.table === key);
      const tableData = {
        table: key,
        fields: value.fields,
        order: value.order || Infinity
      };
      const insertIndex = toBeCreated.findIndex((t) => (t.order || Infinity) > tableData.order);
      if (insertIndex === -1) if (tIndex === -1) toBeCreated.push(tableData);
      else toBeCreated[tIndex].fields = {
        ...toBeCreated[tIndex].fields,
        ...value.fields
      };
      else toBeCreated.splice(insertIndex, 0, tableData);
      continue;
    }
    const toBeAddedFields = {};
    for (const [fieldName, field] of Object.entries(value.fields)) {
      const column = table.columns.find((c) => c.name === fieldName);
      if (!column) {
        toBeAddedFields[fieldName] = field;
        continue;
      }
      if (matchType(column.dataType, field.type, dbType)) continue;
      else logger2.warn(`Field ${fieldName} in table ${key} has a different type in the database. Expected ${field.type} but got ${column.dataType}.`);
    }
    if (Object.keys(toBeAddedFields).length > 0) toBeAdded.push({
      table: key,
      fields: toBeAddedFields,
      order: value.order || Infinity
    });
  }
  const migrations = [];
  const useUUIDs = config2.advanced?.database?.generateId === "uuid";
  const useNumberId = config2.advanced?.database?.generateId === "serial";
  function getType(field, fieldName) {
    const type = field.type;
    const provider = dbType || "sqlite";
    const typeMap = {
      string: {
        sqlite: "text",
        postgres: "text",
        mysql: field.unique ? "varchar(255)" : field.references ? "varchar(36)" : field.sortable ? "varchar(255)" : field.index ? "varchar(255)" : "text",
        mssql: field.unique || field.sortable ? "varchar(255)" : field.references ? "varchar(36)" : "varchar(8000)"
      },
      boolean: {
        sqlite: "integer",
        postgres: "boolean",
        mysql: "boolean",
        mssql: "smallint"
      },
      number: {
        sqlite: field.bigint ? "bigint" : "integer",
        postgres: field.bigint ? "bigint" : "integer",
        mysql: field.bigint ? "bigint" : "integer",
        mssql: field.bigint ? "bigint" : "integer"
      },
      date: {
        sqlite: "date",
        postgres: "timestamptz",
        mysql: "timestamp(3)",
        mssql: sql`datetime2(3)`
      },
      json: {
        sqlite: "text",
        postgres: "jsonb",
        mysql: "json",
        mssql: "varchar(8000)"
      },
      id: {
        postgres: useNumberId ? sql`integer GENERATED BY DEFAULT AS IDENTITY` : useUUIDs ? "uuid" : "text",
        mysql: useNumberId ? "integer" : useUUIDs ? "varchar(36)" : "varchar(36)",
        mssql: useNumberId ? "integer" : useUUIDs ? "varchar(36)" : "varchar(36)",
        sqlite: useNumberId ? "integer" : "text"
      },
      foreignKeyId: {
        postgres: useNumberId ? "integer" : useUUIDs ? "uuid" : "text",
        mysql: useNumberId ? "integer" : useUUIDs ? "varchar(36)" : "varchar(36)",
        mssql: useNumberId ? "integer" : useUUIDs ? "varchar(36)" : "varchar(36)",
        sqlite: useNumberId ? "integer" : "text"
      },
      "string[]": {
        sqlite: "text",
        postgres: "jsonb",
        mysql: "json",
        mssql: "varchar(8000)"
      },
      "number[]": {
        sqlite: "text",
        postgres: "jsonb",
        mysql: "json",
        mssql: "varchar(8000)"
      }
    };
    if (fieldName === "id" || field.references?.field === "id") {
      if (fieldName === "id") return typeMap.id[provider];
      return typeMap.foreignKeyId[provider];
    }
    if (Array.isArray(type)) return "text";
    if (!(type in typeMap)) throw new Error(`Unsupported field type '${String(type)}' for field '${fieldName}'. Allowed types are: string, number, boolean, date, string[], number[]. If you need to store structured data, store it as a JSON string (type: "string") or split it into primitive fields. See https://better-auth.com/docs/advanced/schema#additional-fields`);
    return typeMap[type][provider];
  }
  const getModelName = initGetModelName({
    schema: getAuthTables(config2),
    usePlural: false
  });
  const getFieldName = initGetFieldName({
    schema: getAuthTables(config2),
    usePlural: false
  });
  function getReferencePath(model, field) {
    try {
      return `${getModelName(model)}.${getFieldName({
        model,
        field
      })}`;
    } catch {
      return `${model}.${field}`;
    }
  }
  if (toBeAdded.length) for (const table of toBeAdded) for (const [fieldName, field] of Object.entries(table.fields)) {
    const type = getType(field, fieldName);
    const builder = db.schema.alterTable(table.table);
    if (field.index) {
      const indexName = `${table.table}_${fieldName}_${field.unique ? "uidx" : "idx"}`;
      const indexBuilder = db.schema.createIndex(indexName).on(table.table).columns([fieldName]);
      migrations.push(field.unique ? indexBuilder.unique() : indexBuilder);
    }
    const built = builder.addColumn(fieldName, type, (col) => {
      col = field.required !== false ? col.notNull() : col;
      if (field.references) col = col.references(getReferencePath(field.references.model, field.references.field)).onDelete(field.references.onDelete || "cascade");
      if (field.unique) col = col.unique();
      if (field.type === "date" && typeof field.defaultValue === "function" && (dbType === "postgres" || dbType === "mysql" || dbType === "mssql")) if (dbType === "mysql") col = col.defaultTo(sql`CURRENT_TIMESTAMP(3)`);
      else col = col.defaultTo(sql`CURRENT_TIMESTAMP`);
      return col;
    });
    migrations.push(built);
  }
  const toBeIndexed = [];
  if (toBeCreated.length) for (const table of toBeCreated) {
    const idType = getType({ type: useNumberId ? "number" : "string" }, "id");
    let dbT = db.schema.createTable(table.table).addColumn("id", idType, (col) => {
      if (useNumberId) {
        if (dbType === "postgres") return col.primaryKey().notNull();
        else if (dbType === "sqlite") return col.primaryKey().notNull();
        else if (dbType === "mssql") return col.identity().primaryKey().notNull();
        return col.autoIncrement().primaryKey().notNull();
      }
      if (useUUIDs) {
        if (dbType === "postgres") return col.primaryKey().defaultTo(sql`pg_catalog.gen_random_uuid()`).notNull();
        return col.primaryKey().notNull();
      }
      return col.primaryKey().notNull();
    });
    for (const [fieldName, field] of Object.entries(table.fields)) {
      const type = getType(field, fieldName);
      dbT = dbT.addColumn(fieldName, type, (col) => {
        col = field.required !== false ? col.notNull() : col;
        if (field.references) col = col.references(getReferencePath(field.references.model, field.references.field)).onDelete(field.references.onDelete || "cascade");
        if (field.unique) col = col.unique();
        if (field.type === "date" && typeof field.defaultValue === "function" && (dbType === "postgres" || dbType === "mysql" || dbType === "mssql")) if (dbType === "mysql") col = col.defaultTo(sql`CURRENT_TIMESTAMP(3)`);
        else col = col.defaultTo(sql`CURRENT_TIMESTAMP`);
        return col;
      });
      if (field.index) {
        const builder = db.schema.createIndex(`${table.table}_${fieldName}_${field.unique ? "uidx" : "idx"}`).on(table.table).columns([fieldName]);
        toBeIndexed.push(field.unique ? builder.unique() : builder);
      }
    }
    migrations.push(dbT);
  }
  if (toBeIndexed.length) for (const index of toBeIndexed) migrations.push(index);
  async function runMigrations() {
    for (const migration of migrations) await migration.execute();
  }
  async function compileMigrations() {
    return migrations.map((m) => m.compile().sql).join(";\n\n") + ";";
  }
  return {
    toBeCreated,
    toBeAdded,
    runMigrations,
    compileMigrations
  };
}
const DEFAULT_SECRET = "better-auth-secret-12345678901234567890";
function estimateEntropy$1(str) {
  const unique = new Set(str).size;
  if (unique === 0) return 0;
  return Math.log2(Math.pow(unique, str.length));
}
function parseSecretsEnv(envValue) {
  if (!envValue) return null;
  return envValue.split(",").map((entry) => {
    entry = entry.trim();
    const colonIdx = entry.indexOf(":");
    if (colonIdx === -1) throw new BetterAuthError(`Invalid BETTER_AUTH_SECRETS entry: "${entry}". Expected format: "<version>:<secret>"`);
    const version = parseInt(entry.slice(0, colonIdx), 10);
    if (!Number.isInteger(version) || version < 0) throw new BetterAuthError(`Invalid version in BETTER_AUTH_SECRETS: "${entry.slice(0, colonIdx)}". Version must be a non-negative integer.`);
    const value = entry.slice(colonIdx + 1).trim();
    if (!value) throw new BetterAuthError(`Empty secret value for version ${version} in BETTER_AUTH_SECRETS.`);
    return {
      version,
      value
    };
  });
}
function validateSecretsArray(secrets, logger2) {
  if (secrets.length === 0) throw new BetterAuthError("`secrets` array must contain at least one entry.");
  const seen = /* @__PURE__ */ new Set();
  for (const s of secrets) {
    const version = parseInt(String(s.version), 10);
    if (!Number.isInteger(version) || version < 0 || String(version) !== String(s.version).trim()) throw new BetterAuthError(`Invalid version ${s.version} in \`secrets\`. Version must be a non-negative integer.`);
    if (!s.value) throw new BetterAuthError(`Empty secret value for version ${version} in \`secrets\`.`);
    if (seen.has(version)) throw new BetterAuthError(`Duplicate version ${version} in \`secrets\`. Each version must be unique.`);
    seen.add(version);
  }
  const current = secrets[0];
  if (current.value.length < 32) logger2.warn(`[better-auth] Warning: the current secret (version ${current.version}) should be at least 32 characters long for adequate security.`);
  if (estimateEntropy$1(current.value) < 120) logger2.warn("[better-auth] Warning: the current secret appears low-entropy. Use a randomly generated secret for production.");
}
function buildSecretConfig(secrets, legacySecret) {
  const keys = /* @__PURE__ */ new Map();
  for (const s of secrets) keys.set(parseInt(String(s.version), 10), s.value);
  return {
    keys,
    currentVersion: parseInt(String(secrets[0].version), 10),
    legacySecret: legacySecret && legacySecret !== DEFAULT_SECRET ? legacySecret : void 0
  };
}
function estimateEntropy(str) {
  const unique = new Set(str).size;
  if (unique === 0) return 0;
  return Math.log2(Math.pow(unique, str.length));
}
function validateSecret(secret, logger2) {
  const isDefaultSecret = secret === DEFAULT_SECRET;
  if (isTest()) return;
  if (isDefaultSecret && isProduction) throw new BetterAuthError("You are using the default secret. Please set `BETTER_AUTH_SECRET` in your environment variables or pass `secret` in your auth config.");
  if (!secret) throw new BetterAuthError("BETTER_AUTH_SECRET is missing. Set it in your environment or pass `secret` to betterAuth({ secret }).");
  if (secret.length < 32) logger2.warn(`[better-auth] Warning: your BETTER_AUTH_SECRET should be at least 32 characters long for adequate security. Generate one with \`npx auth secret\` or \`openssl rand -base64 32\`.`);
  if (estimateEntropy(secret) < 120) logger2.warn("[better-auth] Warning: your BETTER_AUTH_SECRET appears low-entropy. Use a randomly generated secret for production.");
}
async function createAuthContext(adapter2, options, getDatabaseType) {
  if (!options.database) options = defu(options, {
    session: { cookieCache: {
      enabled: true,
      strategy: "jwe",
      refreshCache: true
    } },
    account: {
      storeStateStrategy: "cookie",
      storeAccountCookie: true
    }
  });
  const plugins = options.plugins || [];
  const internalPlugins = getInternalPlugins(options);
  const logger2 = createLogger(options.logger);
  const isDynamicConfig = isDynamicBaseURLConfig(options.baseURL);
  if (isDynamicBaseURLConfig(options.baseURL)) {
    const { allowedHosts } = options.baseURL;
    if (!allowedHosts || allowedHosts.length === 0) throw new BetterAuthError('baseURL.allowedHosts cannot be empty. Provide at least one allowed host pattern (e.g., ["myapp.com", "*.vercel.app"]).');
  }
  const baseURL = isDynamicConfig ? void 0 : getBaseURL(typeof options.baseURL === "string" ? options.baseURL : void 0, options.basePath);
  if (!baseURL && !isDynamicConfig) logger2.warn(`[better-auth] Base URL could not be determined. Please set a valid base URL using the baseURL config option or the BETTER_AUTH_URL environment variable. Without this, callbacks and redirects may not work correctly.`);
  if (adapter2.id === "memory" && options.advanced?.database?.generateId === false) logger2.error(`[better-auth] Misconfiguration detected.
You are using the memory DB with generateId: false.
This will cause no id to be generated for any model.
Most of the features of Better Auth will not work correctly.`);
  const secretsArray = options.secrets ?? parseSecretsEnv(env.BETTER_AUTH_SECRETS);
  const legacySecret = options.secret || env.BETTER_AUTH_SECRET || env.AUTH_SECRET || "";
  let secret;
  let secretConfig;
  if (secretsArray) {
    validateSecretsArray(secretsArray, logger2);
    secret = secretsArray[0].value;
    secretConfig = buildSecretConfig(secretsArray, legacySecret);
  } else {
    secret = legacySecret || DEFAULT_SECRET;
    validateSecret(secret, logger2);
    secretConfig = secret;
  }
  options = {
    ...options,
    secret,
    baseURL: isDynamicConfig ? options.baseURL : baseURL ? new URL(baseURL).origin : "",
    basePath: options.basePath || "/api/auth",
    plugins: plugins.concat(internalPlugins)
  };
  checkEndpointConflicts(options, logger2);
  const cookies = getCookies(options);
  const tables = getAuthTables(options);
  const providers = (await Promise.all(Object.entries(options.socialProviders || {}).map(async ([key, originalConfig]) => {
    const config2 = typeof originalConfig === "function" ? await originalConfig() : originalConfig;
    if (config2 == null) return null;
    if (config2.enabled === false) return null;
    if (!config2.clientId) logger2.warn(`Social provider ${key} is missing clientId or clientSecret`);
    const provider = socialProviders[key](config2);
    provider.disableImplicitSignUp = config2.disableImplicitSignUp;
    return provider;
  }))).filter((x) => x !== null);
  const generateIdFunc = ({ model, size }) => {
    if (typeof options.advanced?.generateId === "function") return options.advanced.generateId({
      model,
      size
    });
    const dbGenerateId = options?.advanced?.database?.generateId;
    if (typeof dbGenerateId === "function") return dbGenerateId({
      model,
      size
    });
    if (dbGenerateId === "uuid") return crypto.randomUUID();
    if (dbGenerateId === "serial" || dbGenerateId === false) return false;
    return generateId(size);
  };
  const { publish } = await createTelemetry(options, {
    adapter: adapter2.id,
    database: typeof options.database === "function" ? "adapter" : getDatabaseType(options.database)
  });
  const pluginIds = new Set(options.plugins.map((p) => p.id));
  const getPluginFn = (id) => options.plugins.find((p) => p.id === id) ?? null;
  const hasPluginFn = (id) => pluginIds.has(id);
  const trustedOrigins = await getTrustedOrigins(options);
  const trustedProviders = await getTrustedProviders(options);
  const ctx = {
    appName: options.appName || "Better Auth",
    baseURL: baseURL || "",
    version: getBetterAuthVersion(),
    socialProviders: providers,
    options,
    oauthConfig: {
      storeStateStrategy: options.account?.storeStateStrategy || (options.database ? "database" : "cookie"),
      skipStateCookieCheck: !!options.account?.skipStateCookieCheck
    },
    tables,
    trustedOrigins,
    trustedProviders,
    isTrustedOrigin(url, settings) {
      return this.trustedOrigins.some((origin) => matchesOriginPattern(url, origin, settings));
    },
    sessionConfig: {
      updateAge: options.session?.updateAge !== void 0 ? options.session.updateAge : 1440 * 60,
      expiresIn: options.session?.expiresIn || 3600 * 24 * 7,
      freshAge: options.session?.freshAge === void 0 ? 3600 * 24 : options.session.freshAge,
      cookieRefreshCache: (() => {
        const refreshCache = options.session?.cookieCache?.refreshCache;
        const maxAge = options.session?.cookieCache?.maxAge || 300;
        if ((!!options.database || !!options.secondaryStorage) && refreshCache) {
          logger2.warn("[better-auth] `session.cookieCache.refreshCache` is enabled while `database` or `secondaryStorage` is configured. `refreshCache` is meant for stateless (DB-less) setups. Disabling `refreshCache` — remove it from your config to silence this warning.");
          return false;
        }
        if (refreshCache === false || refreshCache === void 0) return false;
        if (refreshCache === true) return {
          enabled: true,
          updateAge: Math.floor(maxAge * 0.2)
        };
        return {
          enabled: true,
          updateAge: refreshCache.updateAge !== void 0 ? refreshCache.updateAge : Math.floor(maxAge * 0.2)
        };
      })()
    },
    secret,
    secretConfig,
    rateLimit: {
      ...options.rateLimit,
      enabled: options.rateLimit?.enabled ?? isProduction,
      window: options.rateLimit?.window || 10,
      max: options.rateLimit?.max || 100,
      storage: options.rateLimit?.storage || (options.secondaryStorage ? "secondary-storage" : "memory")
    },
    authCookies: cookies,
    logger: logger2,
    generateId: generateIdFunc,
    session: null,
    secondaryStorage: options.secondaryStorage,
    password: {
      hash: options.emailAndPassword?.password?.hash || hashPassword,
      verify: options.emailAndPassword?.password?.verify || verifyPassword$1,
      config: {
        minPasswordLength: options.emailAndPassword?.minPasswordLength || 8,
        maxPasswordLength: options.emailAndPassword?.maxPasswordLength || 128
      },
      checkPassword
    },
    setNewSession(session) {
      this.newSession = session;
    },
    newSession: null,
    adapter: adapter2,
    internalAdapter: createInternalAdapter(adapter2, {
      options,
      logger: logger2,
      hooks: options.databaseHooks ? [options.databaseHooks] : [],
      generateId: generateIdFunc
    }),
    createAuthCookie: createCookieGetter(options),
    async runMigrations() {
      throw new BetterAuthError("runMigrations will be set by the specific init implementation");
    },
    publishTelemetry: publish,
    skipCSRFCheck: !!options.advanced?.disableCSRFCheck,
    skipOriginCheck: options.advanced?.disableOriginCheck !== void 0 ? options.advanced.disableOriginCheck : isTest() ? true : false,
    runInBackground: options.advanced?.backgroundTasks?.handler ?? ((p) => {
      p.catch(() => {
      });
    }),
    async runInBackgroundOrAwait(promise) {
      try {
        if (options.advanced?.backgroundTasks?.handler) {
          if (promise instanceof Promise) options.advanced.backgroundTasks.handler(promise.catch((e) => {
            logger2.error("Failed to run background task:", e);
          }));
        } else await promise;
      } catch (e) {
        logger2.error("Failed to run background task:", e);
      }
    },
    getPlugin: getPluginFn,
    hasPlugin: hasPluginFn
  };
  const initOrPromise = runPluginInit(ctx);
  if (isPromise(initOrPromise)) await initOrPromise;
  return ctx;
}
const init = async (options) => {
  const adapter2 = await getAdapter(options);
  const getDatabaseType = (database) => getKyselyDatabaseType(database) || "unknown";
  const ctx = await createAuthContext(adapter2, options, getDatabaseType);
  ctx.runMigrations = async function() {
    if (!options.database || "updateMany" in options.database) throw new BetterAuthError("Database is not provided or it's an adapter. Migrations are only supported with a database instance.");
    const { runMigrations } = await getMigrations(options);
    await runMigrations();
  };
  return ctx;
};
const createBetterAuth = (options, initFn) => {
  const authContext = initFn(options);
  const { api } = getEndpoints(authContext, options);
  return {
    handler: async (request) => {
      const ctx = await authContext;
      const basePath = ctx.options.basePath || "/api/auth";
      let handlerCtx;
      if (isDynamicBaseURLConfig(options.baseURL)) {
        handlerCtx = Object.create(Object.getPrototypeOf(ctx), Object.getOwnPropertyDescriptors(ctx));
        const baseURL = resolveBaseURL(options.baseURL, basePath, request);
        if (baseURL) {
          handlerCtx.baseURL = baseURL;
          handlerCtx.options = {
            ...ctx.options,
            baseURL: getOrigin(baseURL) || void 0
          };
        } else throw new BetterAuthError("Could not resolve base URL from request. Check your allowedHosts config.");
        const trustedOriginOptions = {
          ...handlerCtx.options,
          baseURL: options.baseURL
        };
        handlerCtx.trustedOrigins = await getTrustedOrigins(trustedOriginOptions, request);
        if (options.advanced?.crossSubDomainCookies?.enabled) {
          handlerCtx.authCookies = getCookies(handlerCtx.options);
          handlerCtx.createAuthCookie = createCookieGetter(handlerCtx.options);
        }
      } else {
        handlerCtx = ctx;
        if (!ctx.options.baseURL) {
          const baseURL = getBaseURL(void 0, basePath, request, void 0, ctx.options.advanced?.trustedProxyHeaders);
          if (baseURL) {
            ctx.baseURL = baseURL;
            ctx.options.baseURL = getOrigin(ctx.baseURL) || void 0;
          } else throw new BetterAuthError("Could not get base URL from request. Please provide a valid base URL.");
        }
        handlerCtx.trustedOrigins = await getTrustedOrigins(ctx.options, request);
      }
      handlerCtx.trustedProviders = await getTrustedProviders(handlerCtx.options, request);
      const { handler: handler2 } = router$1(handlerCtx, options);
      return runWithAdapter(handlerCtx.adapter, () => handler2(request));
    },
    api,
    options,
    $context: authContext,
    $ERROR_CODES: {
      ...options.plugins?.reduce((acc, plugin) => {
        if (plugin.$ERROR_CODES) return {
          ...acc,
          ...plugin.$ERROR_CODES
        };
        return acc;
      }, {}),
      ...BASE_ERROR_CODES
    }
  };
};
const betterAuth = (options) => {
  return createBetterAuth(options, init);
};
const tanstackStartCookies = () => {
  return {
    id: "tanstack-start-cookies",
    hooks: { after: [{
      matcher(ctx) {
        return true;
      },
      handler: createAuthMiddleware(async (ctx) => {
        const returned = ctx.context.responseHeaders;
        if ("_flag" in ctx && ctx._flag === "router") return;
        if (returned instanceof Headers) {
          const setCookies = returned?.get("set-cookie");
          if (!setCookies) return;
          const parsed = parseSetCookieHeader(setCookies);
          const { setCookie } = await import("./server-BubZoQFo.mjs").then(function(n) {
            return n.s;
          });
          parsed.forEach((value, key) => {
            if (!key) return;
            const opts = {
              sameSite: value.samesite,
              secure: value.secure,
              maxAge: value["max-age"],
              httpOnly: value.httponly,
              domain: value.domain,
              path: value.path
            };
            try {
              setCookie(key, value.value, opts);
            } catch {
            }
          });
          return;
        }
      })
    }] }
  };
};
const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }
  },
  plugins: [tanstackStartCookies()]
});
const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: ({ request }) => auth.handler(request),
      POST: ({ request }) => auth.handler(request)
    }
  }
});
const ReplayRoute = Route$c.update({
  id: "/replay",
  path: "/replay",
  getParentRoute: () => Route$d
});
const RecordRoute = Route$b.update({
  id: "/record",
  path: "/record",
  getParentRoute: () => Route$d
});
const ProfileRoute = Route$a.update({
  id: "/profile",
  path: "/profile",
  getParentRoute: () => Route$d
});
const OnboardingRoute = Route$9.update({
  id: "/onboarding",
  path: "/onboarding",
  getParentRoute: () => Route$d
});
const LoginRoute = Route$8.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$d
});
const EmergencyRoute = Route$7.update({
  id: "/emergency",
  path: "/emergency",
  getParentRoute: () => Route$d
});
const DriverMonitorRoute = Route$6.update({
  id: "/driver-monitor",
  path: "/driver-monitor",
  getParentRoute: () => Route$d
});
const AboutRoute = Route$5.update({
  id: "/about",
  path: "/about",
  getParentRoute: () => Route$d
});
const IndexRoute = Route$4.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$d
});
const ApiTtsRoute = Route$3.update({
  id: "/api/tts",
  path: "/api/tts",
  getParentRoute: () => Route$d
});
const ApiSplatRoute = Route$2.update({
  id: "/api/$",
  path: "/api/$",
  getParentRoute: () => Route$d
});
const ApiRpcSplatRoute = Route$1.update({
  id: "/api/rpc/$",
  path: "/api/rpc/$",
  getParentRoute: () => Route$d
});
const ApiAuthSplatRoute = Route.update({
  id: "/api/auth/$",
  path: "/api/auth/$",
  getParentRoute: () => Route$d
});
const rootRouteChildren = {
  IndexRoute,
  AboutRoute,
  DriverMonitorRoute,
  EmergencyRoute,
  LoginRoute,
  OnboardingRoute,
  ProfileRoute,
  RecordRoute,
  ReplayRoute,
  ApiSplatRoute,
  ApiTtsRoute,
  ApiAuthSplatRoute,
  ApiRpcSplatRoute
};
const routeTree = Route$d._addFileChildren(rootRouteChildren)._addFileTypes();
function getRouter() {
  const router2 = createRouter({
    routeTree,
    context: getContext(),
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0
  });
  return router2;
}
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  router as a,
  getBaseURL as g,
  router$2 as r
};
