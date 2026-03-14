import { useCallback, useEffect, useRef, useState } from "react"
import { useBackCamera } from "#/hooks/useBackCamera"
import { useFrameCapture } from "#/hooks/useFrameCapture"
import { EventLog, type RoadEvent } from "./EventLog"
import { client } from "#/server/orpc/client"
import { driveSessionStore } from "#/hooks/useDriveSession"

export function BackCamView() {
  const { videoRef, status, error, startCamera, stopCamera } = useBackCamera()
  const [isRecording, setIsRecording] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [events, setEvents] = useState<RoadEvent[]>([])
  const [driveSummary, setDriveSummary] = useState<string | null>(null)
  const [ending, setEnding] = useState(false)
  const sessionIdRef = useRef<string | null>(null)
  const elapsedRef = useRef(0)

  useEffect(() => {
    startCamera()
    return () => stopCamera()
  }, [startCamera, stopCamera])

  useEffect(() => {
    if (!isRecording) return
    const interval = setInterval(() => {
      setElapsed((s) => {
        elapsedRef.current = s + 1
        return s + 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [isRecording])

  const handleBatchReady = useCallback(async (frames: string[]) => {
    const sessionId = sessionIdRef.current
    if (!sessionId) return

    const tempId = `pending-${Date.now()}`
    const time = formatTime(elapsedRef.current)

    setEvents((prev) => [
      ...prev.slice(-9),
      { id: tempId, time, summary: "", severity: "info", analysing: true },
    ])

    try {
      const result = await client.analyseRoadFrames({
        sessionId,
        elapsedSec: elapsedRef.current,
        frames,
        camera: "back",
      })

      setEvents((prev) =>
        prev.map((e) =>
          e.id === tempId
            ? { ...e, id: result.id, summary: result.summary, severity: result.severity, analysing: false }
            : e
        )
      )
    } catch (err) {
      console.error("Frame analysis failed:", err)
      setEvents((prev) =>
        prev.map((e) =>
          e.id === tempId
            ? { ...e, summary: "Analysis unavailable", analysing: false }
            : e
        )
      )
    }
  }, [])

  useFrameCapture(videoRef, isRecording, handleBatchReady)

  const startRecording = async () => {
    try {
      const { sessionId } = await client.startSession({})
      sessionIdRef.current = sessionId
      driveSessionStore.setState(() => ({ sessionId, startedAt: Date.now() }))
      setEvents([])
      setDriveSummary(null)
      setElapsed(0)
      elapsedRef.current = 0
      setIsRecording(true)
    } catch (err) {
      console.error("Failed to start session:", err)
    }
  }

  const stopRecording = async () => {
    setIsRecording(false)
    const sessionId = sessionIdRef.current
    if (!sessionId) return

    setEnding(true)
    try {
      const { summary } = await client.endSession({ sessionId })
      setDriveSummary(summary)
    } catch (err) {
      console.error("Failed to end session:", err)
    } finally {
      setEnding(false)
      sessionIdRef.current = null
      driveSessionStore.setState(() => ({ sessionId: null, startedAt: null }))
    }
  }

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  return (
    <div className="relative flex h-full w-full flex-col">
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

        <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent px-4 pb-8 pt-[max(1rem,env(safe-area-inset-top))]">
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

      {isRecording && <EventLog events={events} />}

      {/* Drive summary overlay */}
      {driveSummary && !isRecording && (
        <div className="absolute inset-x-4 top-20 z-20 rounded-2xl border border-border bg-card/95 p-4 backdrop-blur-sm">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Drive Summary
          </p>
          <p className="text-sm leading-relaxed text-card-foreground">{driveSummary}</p>
          <button
            type="button"
            onClick={() => setDriveSummary(null)}
            className="mt-3 w-full rounded-lg bg-secondary py-2 text-xs font-medium text-secondary-foreground"
          >
            Dismiss
          </button>
        </div>
      )}

      {ending && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-foreground" />
            <p className="text-sm text-muted-foreground">Generating drive summary...</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center bg-background px-4 py-6">
        <button
          type="button"
          onClick={toggleRecording}
          disabled={status !== "active" || ending}
          className="group relative flex h-[72px] w-[72px] items-center justify-center rounded-full border-[3px] border-border transition-all disabled:opacity-40"
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

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0")
  const s = (seconds % 60).toString().padStart(2, "0")
  return `${m}:${s}`
}
