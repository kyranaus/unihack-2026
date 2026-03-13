import { useCallback, useEffect, useRef, useState } from "react"

type CameraStatus = "idle" | "requesting" | "active" | "error"

export function useBackCamera() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [status, setStatus] = useState<CameraStatus>("idle")
  const [error, setError] = useState<string | null>(null)

  const startCamera = useCallback(async () => {
    setStatus("requesting")
    setError(null)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      })

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }

      setStatus("active")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Camera access denied"
      setError(message)
      setStatus("error")
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) {
        track.stop()
      }
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setStatus("idle")
  }, [])

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        for (const track of streamRef.current.getTracks()) {
          track.stop()
        }
      }
    }
  }, [])

  return { videoRef, status, error, startCamera, stopCamera }
}
