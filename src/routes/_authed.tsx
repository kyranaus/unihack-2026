// src/routes/_authed.tsx
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
import { getSession } from "#/lib/auth-session"

export const Route = createFileRoute("/_authed")({
  beforeLoad: async () => {
    let session = null
    try {
      session = await getSession()
    } catch {
      throw redirect({ to: "/login", search: { redirect: undefined } })
    }

    if (!session) {
      throw redirect({ to: "/login", search: { redirect: undefined } })
    }

    return { user: session.user }
  },
  component: () => <Outlet />,
})
