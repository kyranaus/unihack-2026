// src/components/home/BrandLogo.tsx
import { motion } from "framer-motion"

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
}

const letterVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
}

export function BrandLogo() {
  return (
    <div className="flex flex-col items-center gap-5">
      {/* Wordmark — letters stagger in */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex items-baseline font-brand leading-none"
        aria-label="BeeSafe"
      >
        {"Bee".split("").map((char, i) => (
          <motion.span
            key={`bee-${i}`}
            variants={letterVariants}
            className="text-6xl font-black text-foreground"
          >
            {char}
          </motion.span>
        ))}
        {"Safe".split("").map((char, i) => (
          <motion.span
            key={`safe-${i}`}
            variants={letterVariants}
            className="text-6xl font-black"
            style={{ color: "var(--dashcam-yellow)", textShadow: "0 0 32px rgba(234,179,8,0.4)" }}
          >
            {char}
          </motion.span>
        ))}
      </motion.div>

      {/* Yellow underline sweeps left → right */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 0.85, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="h-px w-48 origin-left rounded-full bg-[var(--dashcam-yellow)]"
      />

      {/* Tagline fades in last */}
      <motion.p
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.7, ease: "easeOut" }}
        className="text-xs uppercase tracking-[0.28em] text-muted-foreground"
      >
        Drive smart. Stay safe.
      </motion.p>
    </div>
  )
}
