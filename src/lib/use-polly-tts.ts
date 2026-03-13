import { useState, useRef, useCallback } from "react"

type TTSStatus = "idle" | "loading" | "playing" | "error"

export function usePollyTTS() {
  const [status, setStatus] = useState<TTSStatus>("idle")
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const objectUrlRef = useRef<string | null>(null)

  const cleanup = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }
  }, [])

  const speak = useCallback(
    async (text: string) => {
      cleanup()
      setStatus("loading")

      try {
        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        })

        if (!res.ok) {
          throw new Error(`TTS request failed: ${res.status}`)
        }

        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        objectUrlRef.current = url

        const audio = new Audio(url)
        audioRef.current = audio

        audio.addEventListener("ended", () => setStatus("idle"))
        audio.addEventListener("error", () => setStatus("error"))

        setStatus("playing")
        await audio.play()
      } catch (err) {
        console.error("Polly TTS error:", err)
        setStatus("error")
      }
    },
    [cleanup],
  )

  const stop = useCallback(() => {
    cleanup()
    setStatus("idle")
  }, [cleanup])

  return { speak, stop, status }
}
