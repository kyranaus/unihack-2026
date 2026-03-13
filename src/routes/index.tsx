// src/routes/index.tsx
import { createFileRoute } from "@tanstack/react-router"
import { DriverScoreCircle } from "#/components/home/DriverScoreCircle"
import { SessionCards } from "#/components/home/SessionCards"
import { BottomNav } from "#/components/home/BottomNav"

export const Route = createFileRoute("/")({ component: App })

const DRIVER_SCORE = 82

function App() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-4 pb-4 pt-12">
        <section className="flex flex-col items-center py-6">
          <DriverScoreCircle score={DRIVER_SCORE} />
        </section>

        <SessionCards />
        <BottomNav />
      </div>
    </main>
  )
}
