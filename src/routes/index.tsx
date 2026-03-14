// src/routes/index.tsx
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { motion } from "framer-motion"
import { BrandLogo } from "#/components/home/BrandLogo"
import { Smartphone, Video } from "lucide-react"
import { authClient } from "#/lib/auth-client"
import { DotLottiePlayer } from "@dotlottie/react-player"
import { useState, useEffect } from "react"

function useScreenSize() {
  const [size, setSize] = useState({
    w: typeof window !== "undefined" ? window.innerWidth : 400,
    h: typeof window !== "undefined" ? window.innerHeight : 600,
  })
  useEffect(() => {
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])
  return size
}

export const Route = createFileRoute("/")({ component: App })

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
  const { h: screenH } = useScreenSize()

  if (isPending) return null

  if (!session?.user) {
    navigate({ to: "/login" })
    return null
  }

  const username = session.user.name || "Driver"
  const offBottom = screenH + 80

  return (
    <main className="min-h-screen bg-background text-foreground">

      {/* ── Desktop splash (hidden on mobile) ── */}
      <div className="hidden md:flex relative min-h-screen flex-col items-center justify-center gap-10 px-8 pt-14 overflow-hidden">

        {/* Desktop bees flying bottom-up at left edge */}
        {[
          { delay: 0, duration: 5, pause: 1, size: "w-20", offset: "0%" },
          { delay: 0.8, duration: 6, pause: 2, size: "w-24", offset: "5%" },
          { delay: 1.6, duration: 4.5, pause: 1.5, size: "w-16", offset: "12%" },
          { delay: 2.4, duration: 7, pause: 3, size: "w-28", offset: "2%" },
          { delay: 3.2, duration: 5.5, pause: 2, size: "w-20", offset: "8%" },
          { delay: 4.0, duration: 6.5, pause: 2.5, size: "w-24", offset: "15%" },
          { delay: 4.8, duration: 5, pause: 1, size: "w-18", offset: "3%" },
          { delay: 5.6, duration: 6, pause: 2, size: "w-22", offset: "10%" },
        ].map((bee, i) => (
          <motion.div
            key={`dleft-${i}`}
            className={`pointer-events-none absolute z-50 ${bee.size}`}
            style={{ bottom: 0, left: bee.offset }}
            initial={{ y: 0 }}
            animate={{ y: -offBottom, x: [0, 6, -4, 8, 0] }}
            transition={{
              y: { delay: bee.delay, duration: bee.duration, ease: "linear", repeat: Infinity, repeatDelay: bee.pause },
              x: { delay: bee.delay, duration: bee.duration / 2, ease: "easeInOut", repeat: Infinity },
            }}
          >
            <DotLottiePlayer src="/2bees.lottie" autoplay loop className="w-full h-full" />
          </motion.div>
        ))}

        {/* Desktop bees flying bottom-up at right edge */}
        {[
          { delay: 0.4, duration: 5.5, pause: 1.5, size: "w-22", offset: "0%" },
          { delay: 1.2, duration: 6, pause: 2, size: "w-18", offset: "6%" },
          { delay: 2.0, duration: 4, pause: 1, size: "w-26", offset: "10%" },
          { delay: 2.8, duration: 7, pause: 3, size: "w-20", offset: "3%" },
          { delay: 3.6, duration: 5, pause: 2, size: "w-24", offset: "14%" },
          { delay: 4.4, duration: 6.5, pause: 2.5, size: "w-16", offset: "7%" },
          { delay: 5.2, duration: 5.5, pause: 1.5, size: "w-28", offset: "2%" },
          { delay: 6.0, duration: 6, pause: 2, size: "w-20", offset: "11%" },
        ].map((bee, i) => (
          <motion.div
            key={`dright-${i}`}
            className={`pointer-events-none absolute z-50 ${bee.size}`}
            style={{ bottom: 0, right: bee.offset }}
            initial={{ y: 0 }}
            animate={{ y: -offBottom, x: [0, -6, 4, -8, 0] }}
            transition={{
              y: { delay: bee.delay, duration: bee.duration, ease: "linear", repeat: Infinity, repeatDelay: bee.pause },
              x: { delay: bee.delay, duration: bee.duration / 2, ease: "easeInOut", repeat: Infinity },
            }}
          >
            <DotLottiePlayer src="/2bees.lottie" autoplay loop className="w-full h-full" />
          </motion.div>
        ))}

        <BrandLogo />
        <div className="flex flex-col items-center gap-4">
          <img
            src={QR_SRC}
            alt="QR code to open BeeSafe on mobile"
            width={180}
            height={180}
          />
          <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2">
            <Smartphone size={14} className="text-primary shrink-0" />
            <p className="text-xs text-muted-foreground">
              Best experienced on mobile — scan to open on your phone
            </p>
          </div>
        </div>
      </div>

      {/* ── Mobile app (hidden on desktop) ── */}
      <div className="md:hidden relative mx-auto min-h-screen max-w-md px-4 pb-28 overflow-hidden">

        {/* Bees flying bottom-up at left edge */}
        {[
          { delay: 0, duration: 4, pause: 1, size: "w-16", offset: "0%" },
          { delay: 0.6, duration: 5, pause: 1.5, size: "w-20", offset: "4%" },
          { delay: 1.2, duration: 3.5, pause: 1, size: "w-14", offset: "10%" },
          { delay: 1.8, duration: 5.5, pause: 2, size: "w-22", offset: "2%" },
          { delay: 2.4, duration: 4.5, pause: 1.5, size: "w-18", offset: "8%" },
          { delay: 3.0, duration: 5, pause: 2, size: "w-20", offset: "6%" },
          { delay: 3.6, duration: 4, pause: 1, size: "w-16", offset: "12%" },
        ].map((bee, i) => (
          <motion.div
            key={`mleft-${i}`}
            className={`pointer-events-none absolute z-50 ${bee.size}`}
            style={{ bottom: 0, left: bee.offset }}
            initial={{ y: 0 }}
            animate={{ y: -offBottom, x: [0, 5, -3, 6, 0] }}
            transition={{
              y: { delay: bee.delay, duration: bee.duration, ease: "linear", repeat: Infinity, repeatDelay: bee.pause },
              x: { delay: bee.delay, duration: bee.duration / 2, ease: "easeInOut", repeat: Infinity },
            }}
          >
            <DotLottiePlayer src="/2bees.lottie" autoplay loop className="w-full h-full" />
          </motion.div>
        ))}

        {/* Bees flying bottom-up at right edge */}
        {[
          { delay: 0.3, duration: 4.5, pause: 1.2, size: "w-18", offset: "0%" },
          { delay: 0.9, duration: 5, pause: 1.5, size: "w-16", offset: "5%" },
          { delay: 1.5, duration: 3.8, pause: 1, size: "w-22", offset: "9%" },
          { delay: 2.1, duration: 5.5, pause: 2, size: "w-14", offset: "2%" },
          { delay: 2.7, duration: 4, pause: 1.5, size: "w-20", offset: "7%" },
          { delay: 3.3, duration: 5.5, pause: 2, size: "w-18", offset: "11%" },
          { delay: 3.9, duration: 4.5, pause: 1, size: "w-16", offset: "4%" },
        ].map((bee, i) => (
          <motion.div
            key={`mright-${i}`}
            className={`pointer-events-none absolute z-50 ${bee.size}`}
            style={{ bottom: 0, right: bee.offset }}
            initial={{ y: 0 }}
            animate={{ y: -offBottom, x: [0, -5, 3, -6, 0] }}
            transition={{
              y: { delay: bee.delay, duration: bee.duration, ease: "linear", repeat: Infinity, repeatDelay: bee.pause },
              x: { delay: bee.delay, duration: bee.duration / 2, ease: "easeInOut", repeat: Infinity },
            }}
          >
            <DotLottiePlayer src="/2bees.lottie" autoplay loop className="w-full h-full" />
          </motion.div>
        ))}

        {/* Title block */}
        <div
          className="flex flex-col items-center gap-4"
          style={{ paddingTop: "12vh" }}
        >
          <BrandLogo />

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
