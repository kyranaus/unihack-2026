import { useEffect, useRef, useCallback, useState } from "react"

const G_THRESHOLD = 3.0
const COOLDOWN_MS = 10000

export function useCollisionDetection(
  enabled: boolean,
  onCollision: (gForce: number) => void
) {
  const [supported, setSupported] = useState(true)
  const lastTriggerRef = useRef(0)
  const callbackRef = useRef(onCollision)
  callbackRef.current = onCollision

  const handleMotion = useCallback((event: DeviceMotionEvent) => {
    const acc = event.accelerationIncludingGravity
    if (!acc || acc.x == null || acc.y == null || acc.z == null) return

    const g = Math.sqrt(acc.x ** 2 + acc.y ** 2 + acc.z ** 2) / 9.81
    const netG = Math.abs(g - 1.0)

    if (netG >= G_THRESHOLD) {
      const now = Date.now()
      if (now - lastTriggerRef.current < COOLDOWN_MS) return
      lastTriggerRef.current = now
      callbackRef.current(netG)
    }
  }, [])

  useEffect(() => {
    if (!enabled) return

    if (typeof DeviceMotionEvent === "undefined") {
      setSupported(false)
      return
    }

    const requestPermission = async () => {
      if ("requestPermission" in DeviceMotionEvent &&
          typeof (DeviceMotionEvent as any).requestPermission === "function") {
        try {
          const result = await (DeviceMotionEvent as any).requestPermission()
          if (result !== "granted") {
            setSupported(false)
            return
          }
        } catch {
          setSupported(false)
          return
        }
      }

      window.addEventListener("devicemotion", handleMotion)
    }

    requestPermission()

    return () => {
      window.removeEventListener("devicemotion", handleMotion)
    }
  }, [enabled, handleMotion])

  return { supported }
}
