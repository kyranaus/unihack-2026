// src/routes/index.tsx
import { createFileRoute } from "@tanstack/react-router"
import { DriverScoreCircle } from "#/components/home/DriverScoreCircle"
import { BrandLogo } from "#/components/home/BrandLogo"
import { Smartphone } from "lucide-react"

export const Route = createFileRoute("/")({ component: App })

const DRIVER_SCORE = 85
const USERNAME = "Stevenphanny"
const APP_URL = "https://kyranaus-unihack-2026.kyranmenezesaus.workers.dev/"
const QR_SRC = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&color=000000&bgcolor=ffffff&data=${encodeURIComponent(APP_URL)}`

function App() {
  return (
    <main className="min-h-screen bg-background text-foreground">

      {/* ── Desktop splash (hidden on mobile) ── */}
      <div className="hidden md:flex min-h-screen flex-col items-center justify-center gap-10 px-8">
        <BrandLogo />

        <div className="flex flex-col items-center gap-4">
          {/* QR code */}
          <img
            src={QR_SRC}
            alt="QR code to open BeeSafe on mobile"
            width={180}
            height={180}
          />

          {/* Disclaimer */}
          <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2">
            <Smartphone size={14} className="text-primary shrink-0" />
            <p className="text-xs text-muted-foreground">
              Best experienced on mobile — scan to open on your phone
            </p>
          </div>
        </div>
      </div>

      {/* ── Mobile app (hidden on desktop) ── */}
      <div className="md:hidden mx-auto flex min-h-screen max-w-md flex-col px-4 pb-4 pt-10">

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
