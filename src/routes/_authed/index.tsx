// src/routes/_authed/index.tsx
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import QRCode from "qrcode"
import { DriverScoreCircle } from "#/components/home/DriverScoreCircle"
import { BrandLogo } from "#/components/home/BrandLogo"
import { Smartphone, Video } from "lucide-react"

export const Route = createFileRoute("/_authed/")({ component: App })

const DRIVER_SCORE = 85
const TARGET_URL = `https://beesafe.unihack.me/`

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
  const { user } = Route.useRouteContext()
  const username = user.name || "Driver"
  const [qrDataUrl, setQrDataUrl] = useState<string>("")

  useEffect(() => {
    QRCode.toDataURL(TARGET_URL, {
      width: 180,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    })
      .then(setQrDataUrl)
      .catch(console.error)
  }, [])

  return (
    <main className="min-h-screen bg-background text-foreground">

      {/* ── Desktop splash (hidden on mobile) ── */}
      <div className="hidden md:flex min-h-screen flex-col items-center justify-center gap-10 px-8 pt-14">
        <BrandLogo />
        <div className="flex flex-col items-center gap-4">
          {/* QR code */}
          <div className="rounded-2xl border border-border bg-card p-4 shadow-lg">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="QR code to open BeeSafe on mobile"
                width={180}
                height={180}
                className="rounded-xl"
              />
            ) : (
              <div className="h-[180px] w-[180px] animate-pulse rounded-xl bg-muted" />
            )}
          </div>

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
