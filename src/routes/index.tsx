import { createFileRoute } from "@tanstack/react-router"
import { DriverScoreCircle } from "#/components/home/DriverScoreCircle"
import { SessionCards } from "#/components/home/SessionCards"
import { BottomNav } from "#/components/home/BottomNav"

export const Route = createFileRoute("/")({ component: App })

const DRIVER_SCORE = 82

function App() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-4 pb-4 pt-10">
        <header className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            DashCam
          </p>
          <h1 className="mt-1 text-2xl font-semibold">Today&apos;s safety</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Quick view of your driving score and recent sessions.
          </p>
        </header>

        <section className="flex flex-col items-center">
          <DriverScoreCircle score={DRIVER_SCORE} />
          <p className="mt-3 text-sm text-zinc-400">
            Driver score out of 100 (demo)
          </p>
        </section>

        <SessionCards />
        <BottomNav />
      </div>
    </main>
  )
}
