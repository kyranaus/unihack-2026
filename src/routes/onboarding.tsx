// src/routes/onboarding.tsx
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { motion } from "framer-motion"
import { authClient } from "#/lib/auth-client"

export const Route = createFileRoute("/onboarding")({ component: OnboardingPage })

function OnboardingPage() {
  const navigate = useNavigate()
  const { data: session, isPending } = authClient.useSession()
  const [username, setUsername] = useState("")
  const [saving, setSaving] = useState(false)

  if (isPending) return null

  if (!session?.user) {
    navigate({ to: "/login" })
    return null
  }

  const handleContinue = async () => {
    const trimmed = username.trim()
    if (!trimmed) return

    setSaving(true)
    try {
      await authClient.updateUser({ name: trimmed })
      navigate({ to: "/" })
    } catch {
      setSaving(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex w-full max-w-sm flex-col items-center gap-8"
      >
        <div className="flex flex-col items-center gap-2">
          <h1 className="font-brand text-3xl font-black text-foreground">
            Choose a username
          </h1>
          <p className="text-sm text-muted-foreground">
            This is how you'll appear in BeeSafe
          </p>
        </div>

        <div className="flex w-full flex-col gap-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleContinue()}
            placeholder="Enter your username"
            maxLength={24}
            autoFocus
            className="w-full rounded-xl border border-border bg-card px-4 py-3.5 text-center font-semibold text-foreground placeholder:text-muted-foreground/50 outline-none ring-primary focus:ring-2"
          />

          <button
            onClick={handleContinue}
            disabled={!username.trim() || saving}
            className="w-full rounded-full bg-primary px-6 py-3.5 font-brand text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-all active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none"
          >
            {saving ? "Saving..." : "Continue"}
          </button>
        </div>
      </motion.div>
    </main>
  )
}
