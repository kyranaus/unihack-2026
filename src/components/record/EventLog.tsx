import { useEffect, useRef } from "react"

export type RoadEvent = {
  id: string
  time: string
  summary: string
  severity: "info" | "warning" | "critical"
  analysing?: boolean
}

const SEVERITY_STYLES = {
  info: "border-zinc-700 bg-zinc-900/80 text-zinc-300",
  warning: "border-amber-800/60 bg-amber-950/60 text-amber-200",
  critical: "border-red-800/60 bg-red-950/60 text-red-200",
} as const

type EventLogProps = {
  events: RoadEvent[]
}

export function EventLog({ events }: EventLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

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
            <p className="text-xs leading-relaxed">
              {event.analysing ? (
                <span className="animate-pulse text-zinc-500">Analysing road...</span>
              ) : (
                event.summary
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
