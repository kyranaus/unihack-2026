// src/routes/index.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <main className="flex h-screen items-center justify-center">
      <p className="text-lg font-semibold text-[var(--sea-ink-soft)]">DashCam</p>
    </main>
  )
}
