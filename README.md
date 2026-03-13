# DashCam - Unihack 2026

A phone-based dashcam app with dual camera views, driver monitoring AI, crash detection, and session reporting for learner drivers and insurance.

## Quick Start

```bash
bun install
bun --bun run dev       # dev server on port 3000
bun --bun run build     # production build
bun --bun run test      # vitest
bun --bun run lint      # biome lint
```

## Tech Stack

- **Framework**: TanStack Start (Vite + React 19 + TypeScript)
- **Routing**: TanStack Router (file-based, auto-generated route tree)
- **API**: oRPC (type-safe RPC + OpenAPI)
- **Auth**: Better Auth
- **DB**: Prisma + PostgreSQL
- **Styling**: Tailwind CSS v4, Shadcn UI (lucide icons)
- **State**: TanStack Store, TanStack Query

## Project Structure

```
src/
  routes/                    # TanStack Router (file-based, DO NOT rename)
    index.tsx                  Home page (DashCam dashboard)
    about.tsx                  About page
    __root.tsx                 Root layout (HTML shell, header, footer)
    api.$.ts                   oRPC OpenAPI handler
    api.rpc.$.ts               oRPC RPC handler
    api/auth/$.ts              Better Auth handler

  components/                # FRONTEND - React UI components
    home/                      Home page components
      DriverScoreCircle.tsx      Circular SVG score ring
      SessionCards.tsx           Scrollable dummy session cards
      BottomNav.tsx              Bottom navigation bar (camera/files/profile)
    Header.tsx                 App header with nav links
    Footer.tsx                 App footer
    ThemeToggle.tsx             Light/dark/auto toggle
    ui/                        Shadcn UI primitives (future)

  hooks/                     # FRONTEND - Custom React hooks

  lib/                       # FRONTEND - Client-side utilities
    auth-client.ts             Better Auth client (useSession, signOut)
    utils.ts                   cn() helper (clsx + tailwind-merge)

  integrations/              # FRONTEND - Third-party client wiring
    better-auth/
      header-user.tsx          Auth UI for header
    tanstack-query/
      root-provider.tsx        QueryClientProvider
      devtools.tsx             React Query devtools

  server/                    # BACKEND - Server-only code
    auth.ts                    Better Auth server config
    db.ts                      Prisma client singleton
    polyfill.ts                Node 18 polyfills for oRPC
    orpc/
      client.ts                Isomorphic oRPC client
      schema.ts                Shared Zod schemas
      router/
        index.ts               oRPC router barrel
        todos.ts               Example todo procedures

  generated/                 # Auto-generated Prisma client (do not edit)
  styles.css                 # Global styles + Tailwind v4 import
  router.tsx                 # TanStack Router instance
  routeTree.gen.ts           # Auto-generated route tree (do not edit)

prisma/
  schema.prisma              # Database schema
  migrations/                # Migration history
  seed.ts                    # Seed script
```

## Frontend vs Backend - Quick Guide

| Area | Location | Who works here |
|------|----------|---------------|
| Pages & layouts | `src/routes/` | Frontend devs |
| UI components | `src/components/` | Frontend devs |
| Hooks & client utils | `src/hooks/`, `src/lib/` | Frontend devs |
| API procedures | `src/server/orpc/router/` | Backend devs |
| Auth config | `src/server/auth.ts` | Backend devs |
| Database | `src/server/db.ts`, `prisma/` | Backend devs |
| Schemas (shared) | `src/server/orpc/schema.ts` | Both |

## Key Conventions

- **`src/routes/` cannot be moved** -- TanStack Router generates the route tree from this directory.
- Import alias `#/` maps to `src/` (e.g. `#/components/home/BottomNav`).
- Keep every file under 200 lines; extract to new components/modules when approaching the limit.
- Files prefixed with `demo-` are leftover starter templates and can be deleted.

## Database

```bash
bun run db:generate   # regenerate Prisma client
bun run db:push       # push schema to DB
bun run db:migrate    # create migration
bun run db:studio     # open Prisma Studio
bun run db:seed       # seed data
```

## Shadcn Components

```bash
pnpm dlx shadcn@latest add button
```

Components install to `src/components/ui/`.
