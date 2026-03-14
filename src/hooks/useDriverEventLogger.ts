import { useEffect, useRef } from "react"
import type { DriverState, SmoothedMetrics } from "#/lib/driver-monitor-utils"
import { getActiveSession } from "#/hooks/useDriveSession"
import { client } from "#/server/orpc/client"

const COOLDOWN_MS = 10000

const STATE_SEVERITY: Record<DriverState, "info" | "warning" | "critical"> = {
  ALERT: "info",
  DROWSY: "warning",
  DISTRACTED: "warning",
  NO_FACE: "info",
}

const STATE_SUMMARY: Record<DriverState, string> = {
  ALERT: "Driver alert and attentive",
  DROWSY: "Driver showing signs of drowsiness",
  DISTRACTED: "Driver distracted - not watching the road",
  NO_FACE: "Driver face not detected",
}

export function useDriverEventLogger(
  driverState: DriverState,
  metrics: SmoothedMetrics,
  camera: "front" | "back" = "front"
) {
  const prevStateRef = useRef<DriverState>(driverState)
  const lastLogTimeRef = useRef(0)

  useEffect(() => {
    if (driverState === prevStateRef.current) return
    prevStateRef.current = driverState

    if (driverState === "ALERT" || driverState === "NO_FACE") return

    const now = Date.now()
    if (now - lastLogTimeRef.current < COOLDOWN_MS) return
    lastLogTimeRef.current = now

    const session = getActiveSession()
    if (!session) return

    client.logDriverEvent({
      sessionId: session.sessionId,
      elapsedSec: Math.max(0, session.elapsedSec),
      type: "driver_state",
      summary: STATE_SUMMARY[driverState],
      severity: STATE_SEVERITY[driverState],
      camera,
      metadata: {
        state: driverState,
        ear: Number(metrics.ear.toFixed(3)),
        yaw: Number(metrics.yaw.toFixed(3)),
        pitch: Number(metrics.pitch.toFixed(3)),
      },
    }).catch(() => {})
  }, [driverState, metrics, camera])
}
