import { Store } from "@tanstack/store"

type DriveSessionState = {
  sessionId: string | null
  startedAt: number | null
}

export const driveSessionStore = new Store<DriveSessionState>({
  sessionId: null,
  startedAt: null,
})

export function getActiveSession() {
  const state = driveSessionStore.state
  if (!state.sessionId || !state.startedAt) return null
  return {
    sessionId: state.sessionId,
    elapsedSec: Math.floor((Date.now() - state.startedAt) / 1000),
  }
}
