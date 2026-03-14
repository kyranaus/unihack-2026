// src/routes/_authed/record.tsx
import { createFileRoute, Link } from "@tanstack/react-router"
import { BackCamView } from "#/components/record/BackCamView"

export const Route = createFileRoute("/_authed/record")({ component: RecordPage })

function RecordPage() {
  return (
    <main className="fixed inset-0 z-50 flex flex-col bg-black text-white">
      {/* Back button */}
      <div className="absolute left-3 top-4 z-10">
        <Link
          to="/"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-zinc-300 backdrop-blur-sm no-underline"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
      </div>

      <BackCamView />
    </main>
  )
}
