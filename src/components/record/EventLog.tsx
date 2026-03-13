import { useEffect, useRef, useState } from "react"

type RoadEvent = {
  id: number
  time: string
  summary: string
  severity: "info" | "warning" | "critical"
}

const SEVERITY_STYLES = {
  info: "border-zinc-700 bg-zinc-900/80 text-zinc-300",
  warning: "border-amber-800/60 bg-amber-950/60 text-amber-200",
  critical: "border-red-800/60 bg-red-950/60 text-red-200",
} as const

const DEMO_SUMMARIES: { summary: string; severity: RoadEvent["severity"] }[] = [
  { summary: "Clear road ahead, steady speed ~50 km/h", severity: "info" },
  { summary: "Approaching intersection - traffic light detected", severity: "info" },
  { summary: "Vehicle ahead braking - following distance adequate", severity: "info" },
  { summary: "Lane change detected by adjacent vehicle", severity: "warning" },
  { summary: "Pedestrian near crossing on left side", severity: "warning" },
  { summary: "Sudden braking event - vehicle ahead stopped", severity: "critical" },
  { summary: "Roundabout entry - yielding to traffic", severity: "info" },
  { summary: "Construction zone - reduced speed detected", severity: "warning" },
  { summary: "Clear highway stretch, no hazards detected", severity: "info" },
  { summary: "Tailgating detected - vehicle behind too close", severity: "warning" },
]

function formatElapsed(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0")
  const s = (seconds % 60).toString().padStart(2, "0")
  return `${m}:${s}`
}

type EventLogProps = {
  elapsed: number
}

export function EventLog({ elapsed }: EventLogProps) {
  const [events, setEvents] = useState<RoadEvent[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)
  const nextIdRef = useRef(0)

  useEffect(() => {
    if (elapsed === 0) {
      setEvents([])
      nextIdRef.current = 0
      return
    }
    if (elapsed % 10 !== 0) return

    const demo = DEMO_SUMMARIES[nextIdRef.current % DEMO_SUMMARIES.length]
    const newEvent: RoadEvent = {
      id: nextIdRef.current,
      time: formatElapsed(elapsed),
      summary: demo.summary,
      severity: demo.severity,
    }

    nextIdRef.current += 1
    setEvents((prev) => [...prev.slice(-9), newEvent])
  }, [elapsed])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [events])

  if (events.length === 0) return null

  return (
    <div className="absolute inset-x-0 bottom-[96px] px-3 pb-2">
      <div
        ref={scrollRef}
        className="flex max-h-[180px] flex-col gap-1.5 overflow-y-auto scrollbar-none"
      >
        {events.map((event) => (
          <div
            key={event.id}
            className={`flex items-start gap-2 rounded-xl border px-3 py-2 backdrop-blur-sm ${SEVERITY_STYLES[event.severity]}`}
          >
            <span className="mt-0.5 shrink-0 font-mono text-[10px] text-zinc-500">
              {event.time}
            </span>
            <p className="text-xs leading-relaxed">{event.summary}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
