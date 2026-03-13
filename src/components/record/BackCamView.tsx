import { useEffect, useState } from "react"
import { useBackCamera } from "#/hooks/useBackCamera"
import { EventLog } from "./EventLog"

export function BackCamView() {
  const { videoRef, status, error, startCamera, stopCamera } = useBackCamera()
  const [isRecording, setIsRecording] = useState(false)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    startCamera()
    return () => stopCamera()
  }, [startCamera, stopCamera])

  useEffect(() => {
    if (!isRecording) return
    const interval = setInterval(() => setElapsed((s) => s + 1), 1000)
    return () => clearInterval(interval)
  }, [isRecording])

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false)
      setElapsed(0)
    } else {
      setIsRecording(true)
    }
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0")
    const s = (seconds % 60).toString().padStart(2, "0")
    return `${m}:${s}`
  }

  return (
    <div className="relative flex h-full w-full flex-col">
      {/* Camera feed */}
      <div className="relative flex-1 overflow-hidden bg-zinc-950">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="h-full w-full object-cover"
        />

        {status === "requesting" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-600 border-t-white" />
              <p className="text-sm text-zinc-400">Accessing camera...</p>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <div className="flex flex-col items-center gap-3 px-8 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20">
                <svg className="h-6 w-6 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M15 9L9 15M9 9L15 15" strokeLinecap="round" />
                </svg>
              </div>
              <p className="text-sm text-zinc-300">Camera unavailable</p>
              <p className="text-xs text-zinc-500">{error}</p>
              <button
                type="button"
                onClick={() => startCamera()}
                className="mt-2 rounded-lg bg-zinc-800 px-4 py-2 text-xs font-medium text-zinc-200"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Top bar overlay */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent px-4 pb-8 pt-4">
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${isRecording ? "animate-pulse bg-red-500" : "bg-zinc-500"}`} />
            <span className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-300">
              {isRecording ? "Recording" : "Road Cam"}
            </span>
          </div>
          {isRecording && (
            <span className="font-mono text-sm font-semibold text-white">
              {formatTime(elapsed)}
            </span>
          )}
        </div>
      </div>

      {/* Event log overlay */}
      {isRecording && <EventLog elapsed={elapsed} />}

      {/* Bottom controls */}
      <div className="flex items-center justify-center bg-black px-4 py-6">
        <button
          type="button"
          onClick={toggleRecording}
          disabled={status !== "active"}
          className="group relative flex h-[72px] w-[72px] items-center justify-center rounded-full border-[3px] border-zinc-600 transition-all disabled:opacity-40"
        >
          <span
            className={`block transition-all ${
              isRecording
                ? "h-6 w-6 rounded-md bg-red-500"
                : "h-14 w-14 rounded-full bg-red-500 group-hover:scale-95"
            }`}
          />
        </button>
      </div>
    </div>
  )
}
