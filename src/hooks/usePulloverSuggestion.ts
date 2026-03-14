// src/hooks/usePulloverSuggestion.ts
import { useCallback, useEffect, useRef, useState } from "react"
import type { DriverState } from "#/lib/driver-monitor-utils"
import { client } from "#/server/orpc/client"
import type { PulloverSpot } from "#/server/overpass"

const DROWSY_THRESHOLD = 2
const COOLDOWN_MS = 60_000

export type PulloverState = {
  spots: PulloverSpot[]
  visible: boolean
  drowsyCount: number
  loading: boolean
}

export function usePulloverSuggestion(
  driverState: DriverState,
  latitude: number | null,
  longitude: number | null,
  isRecording: boolean,
  onShow?: () => void,
) {
  const onShowRef = useRef(onShow)
  onShowRef.current = onShow
  const [state, setState] = useState<PulloverState>({
    spots: [],
    visible: false,
    drowsyCount: 0,
    loading: false,
  })

  const drowsyCountRef = useRef(0)
  const prevStateRef = useRef<DriverState>(driverState)
  const lastFetchRef = useRef(0)

  useEffect(() => {
    if (!isRecording) {
      drowsyCountRef.current = 0
      setState({ spots: [], visible: false, drowsyCount: 0, loading: false })
      return
    }

    if (driverState === prevStateRef.current) return
    const prev = prevStateRef.current
    prevStateRef.current = driverState

    if (prev !== "DROWSY" || driverState === "DROWSY") return

    drowsyCountRef.current += 1
    const count = drowsyCountRef.current
    setState((s) => ({ ...s, drowsyCount: count }))

    if (count < DROWSY_THRESHOLD) return

    if (!latitude || !longitude) return

    const now = Date.now()
    const shouldRefetch = now - lastFetchRef.current >= COOLDOWN_MS

    onShowRef.current?.()

    if (shouldRefetch) {
      lastFetchRef.current = now
      setState((s) => ({ ...s, loading: true, visible: true }))
      client
        .findSafePullover({ latitude, longitude })
        .then(({ spots }) => {
          setState((s) => ({
            ...s,
            spots: spots.length > 0 ? spots : s.spots,
            visible: true,
            loading: false,
          }))
        })
        .catch(() => {
          setState((s) => ({ ...s, visible: true, loading: false }))
        })
    } else {
      setState((s) => ({ ...s, visible: true }))
    }
  }, [driverState, latitude, longitude, isRecording])

  const dismiss = useCallback(() => {
    setState((s) => ({ ...s, visible: false }))
  }, [])

  return { ...state, dismiss }
}
