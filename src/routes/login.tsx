// src/routes/login.tsx
import { createFileRoute, redirect } from "@tanstack/react-router"
import { motion } from "framer-motion"
import { BrandLogo } from "#/components/home/BrandLogo"
import { authClient } from "#/lib/auth-client"
import { getSession } from "#/lib/auth-session"

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: (search.redirect as string) || undefined,
  }),
  beforeLoad: async () => {
    const session = await getSession()
    if (session) throw redirect({ to: "/" })
  },
  component: LoginPage,
})

function LoginPage() {
  const handleGoogleSignIn = () => {
    authClient.signIn.social({
      provider: "google",
      callbackURL: "/onboarding",
    })
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <div className="flex w-full max-w-sm flex-col items-center gap-12">
        <BrandLogo />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex w-full flex-col items-center gap-4"
        >
          <button
            onClick={handleGoogleSignIn}
            className="flex w-full items-center justify-center gap-3 rounded-full border border-border bg-card px-6 py-3.5 font-semibold text-foreground shadow-sm transition-colors hover:bg-accent active:scale-[0.98]"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <p className="text-center text-[10px] text-muted-foreground">
            By continuing, you agree to BeeSafe's Terms &amp; Privacy Policy
          </p>
        </motion.div>
      </div>
    </main>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
        fill="#EA4335"
      />
    </svg>
  )
}
