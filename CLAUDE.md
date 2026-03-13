# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Rules

- Split files exceeding 200 lines into components/modules
- Show ONLY changed code, never the full file
- Include a file path comment at the top of every code block
- Keep things simple and working — this is a hackathon, not production
- All UI must be responsive — keep styling minimal
- Use a new code block for every file changed
- Do NOT make changes outside the scope of what was asked — ask first if needed
- Do not add unrequested functionality

## App — DashCam

A phone-based dashcam app with:

- **Dual camera views** — front and back
- **Driver monitoring AI** — detects drowsiness and distraction via front camera
- **Crash detection AI** — auto-dials 000 on severe impact detection
- **Scam/liability protection** — continuous recording as evidence
- **Driver report** — session summaries for learner drivers and insurance/legal use

## Tech Stack

- **Framework:** TanStack Start (React 19, Nitro server, file-based routing)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 + Shadcn UI
- **API:** oRPC (type-safe RPC) + OpenAPI catch-all
- **Auth:** Better Auth (email/password, cookie sessions)
- **Database:** PostgreSQL via Prisma ORM
- **AI:** TanStack AI with Anthropic (Claude) provider
- **State:** TanStack Query (server state) + TanStack Store (client state)
- **Package manager:** Bun
- **Linting/Formatting:** Biome

## Commands

```bash
# Development
bun run dev           # Start dev server (port 3000)
bun run build         # Production build
bun run preview       # Preview production build

# Code quality
bun run lint          # Biome linter
bun run format        # Biome formatter
bun run check         # Biome check (lint + format)

# Testing
bun run test          # Vitest

# Database
bun run db:generate   # Generate Prisma client
bun run db:push       # Push schema (no migrations)
bun run db:migrate    # Run migrations
bun run db:studio     # Open Prisma Studio
bun run db:seed       # Seed database
```

## Environment Variables

```env
DATABASE_URL=<postgresql_connection_string>
ANTHROPIC_API_KEY=<anthropic_key>
BETTER_AUTH_SECRET=<generated_secret>   # bunx --bun @better-auth/cli secret
```

## Architecture

### Routing
File-based routing via TanStack Router in `src/routes/`. API routes:
- `/api/rpc/$` — oRPC handler (type-safe, Zod-validated)
- `/api/$` — OpenAPI/REST catch-all
- `/api/auth/$` — Better Auth

### API Layer
oRPC routers live in `src/orpc/router/`. Define schemas in `src/orpc/schema.ts` (Zod). The isomorphic client at `src/orpc/client.ts` works on both server and client.

### AI Integration
Uses TanStack AI `useChat()` hook with streaming via SSE. Tools are defined with Zod schemas. See `src/components/demo-AIAssistant.tsx` and `src/lib/demo-ai-hook.ts` for the pattern.

### Shadcn Components
Install components with:
```bash
bunx --bun shadcn@latest add <component-name>
```

### Adding Shadcn UI Components
When installing new Shadcn components, always use Bun:
```bash
bunx --bun shadcn@latest add <component>
```
