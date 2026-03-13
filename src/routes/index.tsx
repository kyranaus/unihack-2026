// src/routes/index.tsx
import { createFileRoute } from "@tanstack/react-router"
import { DriverScoreCircle } from "#/components/home/DriverScoreCircle"
import { BrandLogo } from "#/components/home/BrandLogo"

export const Route = createFileRoute("/")({ component: App })

const DRIVER_SCORE = 85
const USERNAME = "Stevenphanny"

function App() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-4 pb-4 pt-10">

        {/* Top bar — score left, user right */}
        <header className="mb-6 flex items-center justify-between">
          <div className="flex flex-col items-center gap-1">
            <DriverScoreCircle score={DRIVER_SCORE} />
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Driver score
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Welcome back
              </p>
              <p className="text-sm font-semibold">{USERNAME}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {USERNAME.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Centred brand wordmark */}
        <div className="flex flex-1 items-center justify-center">
          <BrandLogo />
        </div>

      </div>
    </main>
  )
}
