// src/routes/_authed/index.tsx
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { lazy, useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import QRCode from "qrcode"

const DotLottieReact = lazy(() =>
  import("@lottiefiles/dotlottie-react").then((m) => ({ default: m.DotLottieReact }))
)
import { BrandLogo } from "#/components/home/BrandLogo"
import { Smartphone, Video } from "lucide-react"

export const Route = createFileRoute("/_authed/")({ component: App })

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
      className="inline-flex font-brand text-3xl font-semibold tracking-wide text-foreground"
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

const PARTICLE_BEES_LEFT = [
  { xPct: 2,  delay: 0,    dur: 3.8 },
  { xPct: 7,  delay: 0.7,  dur: 4.2 },
  { xPct: 12, delay: 1.4,  dur: 3.5 },
  { xPct: 17, delay: 2.1,  dur: 4.6 },
  { xPct: 22, delay: 2.8,  dur: 3.9 },
  { xPct: 27, delay: 0.3,  dur: 4.1 },
]

const PARTICLE_BEES_RIGHT = [
  { xPct: 2,  delay: 0.4,  dur: 4.0 },
  { xPct: 7,  delay: 1.1,  dur: 3.6 },
  { xPct: 12, delay: 1.8,  dur: 4.4 },
  { xPct: 17, delay: 2.5,  dur: 3.7 },
  { xPct: 22, delay: 0.9,  dur: 4.2 },
  { xPct: 27, delay: 3.2,  dur: 3.5 },
]

function BeeAnimations() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Bottom-left particle bees */}
      {PARTICLE_BEES_LEFT.map((b, i) => (
        <motion.div
          key={`bl-${i}`}
          className="absolute"
          style={{ bottom: -40, left: `${b.xPct}%` }}
          animate={{ y: ["0px", "-95vh"], opacity: [0, 1, 1, 0] }}
          transition={{ duration: b.dur, repeat: Infinity, delay: b.delay, ease: "easeOut" }}
        >
          <DotLottieReact src="/2bees.lottie" autoplay loop style={{ width: 36, height: 36 }} />
        </motion.div>
      ))}

      {/* Bottom-right particle bees */}
      {PARTICLE_BEES_RIGHT.map((b, i) => (
        <motion.div
          key={`br-${i}`}
          className="absolute"
          style={{ bottom: -40, right: `${b.xPct}%` }}
          animate={{ y: ["0px", "-95vh"], opacity: [0, 1, 1, 0] }}
          transition={{ duration: b.dur, repeat: Infinity, delay: b.delay, ease: "easeOut" }}
        >
          <DotLottieReact src="/2bees.lottie" autoplay loop style={{ width: 36, height: 36 }} />
        </motion.div>
      ))}
    </div>
  )
}

function App() {
  const navigate = useNavigate()
  const { user } = Route.useRouteContext()
  const username = user.name || "Driver"
  const [qrDataUrl, setQrDataUrl] = useState<string>("")
  const titleRef = useRef<HTMLDivElement>(null)
  const [beeTop, setBeeTop] = useState(0)

  useEffect(() => {
    const el = titleRef.current
    if (!el) return
    const update = () => setBeeTop(el.offsetTop + el.offsetHeight + 16)
    update()
    const obs = new ResizeObserver(update)
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

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
    <main className="min-h-screen bg-background text-foreground relative">
      <BeeAnimations />

      {/* ── Desktop splash (hidden on mobile) ── */}
      <div className="hidden md:flex min-h-screen flex-col items-center justify-center gap-10 px-8 pt-14 relative z-10">
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
      <div className="md:hidden relative mx-auto min-h-screen max-w-md px-4 pb-28 z-10">

        {/* Big bee — scrolls with content, positioned below username */}
        <motion.div
          className="absolute pointer-events-none"
          style={{ top: beeTop || "60%" }}
          initial={{ x: "-160px" }}
          animate={{ x: "calc(40vw)" }}
          transition={{ duration: 4, ease: "easeOut" }}
        >
          <motion.div
            animate={{ y: [0, -5, 0, 5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <DotLottieReact src="/flyingBee.lottie" autoplay loop style={{ width: 90, height: 90 }} />
          </motion.div>
        </motion.div>

        {/* Title block — centred, nudged above midpoint */}
        <div
          ref={titleRef}
          className="absolute inset-x-0 flex flex-col items-center gap-4"
          style={{ top: "25%" }}
        >
          <BrandLogo />

          {/* Welcome greeting below the logo */}
          <div className="flex flex-col items-center gap-1 mt-30">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.0, duration: 0.6, ease: "easeOut" }}
              className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground"
            >
              Welcome back
            </motion.p>

            <div className="mt-1">
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
            className="flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-xs font-medium tracking-widest uppercase text-primary-foreground shadow-lg shadow-primary/20 active:scale-95 transition-transform"
          >
            <Video size={16} strokeWidth={2.5} />
            Start Recording
          </button>
        </motion.div>

      </div>
    </main>
  )
}
