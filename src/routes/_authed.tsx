// src/routes/_authed.tsx
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
import { getSession } from "#/lib/auth-session"

export const Route = createFileRoute("/_authed")({
  beforeLoad: async () => {
    const session = await getSession()

    if (!session) {
      throw redirect({ to: "/login" })
    }

    return { user: session.user }
  },
  component: () => <Outlet />,
})
