// src/routes/index.tsx
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { motion } from "framer-motion"
import { DriverScoreCircle } from "#/components/home/DriverScoreCircle"
import { BrandLogo } from "#/components/home/BrandLogo"
import { Smartphone, Video } from "lucide-react"
import { authClient } from "#/lib/auth-client"

export const Route = createFileRoute("/")({ component: App })

const DRIVER_SCORE = 85
const APP_URL = "https://kyranaus-unihack-2026.kyranmenezesaus.workers.dev/"
const QR_SRC = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&color=000000&bgcolor=ffffff&data=${encodeURIComponent(APP_URL)}`

// Brush-stroke reveal — each character pivots from the top like a loaded brush
const brushContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055, delayChildren: 2 } },
}
const brushChar = {
  hidden: { opacity: 0, scaleY: 0.08, y: -14, rotate: -8, filter: "blur(6px)" },
  show: {
    opacity: 1, scaleY: 1, y: 0, rotate: 0, filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 260, damping: 20, mass: 0.55 },
  },
}

function BrushName({ name }: { name: string }) {
  return (
    <motion.span
      variants={brushContainer}
      initial="hidden"
      animate="show"
      className="inline-flex font-brand text-2xl font-black text-foreground"
      aria-label={name}
    >
      {name.split("").map((char, i) => (
        <motion.span
          key={i}
          variants={brushChar}
          style={{ transformOrigin: "top center", display: "inline-block" }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  )
}

function App() {
  const navigate = useNavigate()
  const { data: session, isPending } = authClient.useSession()

  if (isPending) return null

  if (!session?.user) {
    navigate({ to: "/login" })
    return null
  }

  const username = session.user.name || "Driver"

  return (
    <main className="min-h-screen bg-background text-foreground">

      {/* ── Desktop splash (hidden on mobile) ── */}
      <div className="hidden md:flex min-h-screen flex-col items-center justify-center gap-10 px-8 pt-14">
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
      <div className="md:hidden relative mx-auto min-h-screen max-w-md px-4 pb-28">

        {/* Title block — sits at 20% from the top, adapts to any screen height */}
        <div
          className="flex flex-col items-center gap-4"
          style={{ paddingTop: "12vh" }}
        >
          <BrandLogo />

          {/* Welcome greeting below the logo */}
          <div className="flex flex-col items-center gap-1 mt-10">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.0, duration: 0.6, ease: "easeOut" }}
              className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground"
            >
              Welcome back
            </motion.p>
            
            <div className="mt-2">
              <BrushName name={username} />
            </div>
          </div>

          {/* Driver score — centred below the name */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 flex flex-col items-center gap-1"
          >
            <DriverScoreCircle score={DRIVER_SCORE} size={160} />
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mt-2">
              Driver score
            </span>
          </motion.div>
        </div>

        {/* Start recording button — floats above the nav bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.6, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-32 left-0 right-0 flex justify-center px-4"
        >
          <button
            onClick={() => navigate({ to: "/driver-monitor" })}
            className="flex items-center gap-2 rounded-full bg-primary px-8 py-3 font-brand text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 active:scale-95 transition-transform"
          >
            <Video size={16} strokeWidth={2.5} />
            Start Recording
          </button>
        </motion.div>

      </div>
    </main>
  )
}
