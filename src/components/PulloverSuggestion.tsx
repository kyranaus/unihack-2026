// src/components/PulloverSuggestion.tsx
import { MapPin, X, Navigation } from "lucide-react"
import type { PulloverSpot } from "#/server/overpass"

type Props = {
  spots: PulloverSpot[]
  visible: boolean
  onDismiss: () => void
}

export function PulloverSuggestion({ spots, visible, onDismiss }: Props) {
  if (!visible || spots.length === 0) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-80 animate-in slide-in-from-bottom duration-300 px-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="rounded-2xl border border-primary/30 bg-background/95 shadow-xl backdrop-blur-md">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
              <MapPin size={16} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Time to pull over</p>
              <p className="text-[11px] text-muted-foreground">
                You've dozed off multiple times — here are safe spots to pull over nearby
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onDismiss}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground/10 text-foreground/60 transition-colors hover:bg-foreground/20"
          >
            <X size={14} />
          </button>
        </div>

        {/* Spots list */}
        <div className="flex flex-col gap-2 px-4 pb-4 pt-1">
          {spots.map((spot, i) => (
            <button
              key={`${spot.lat}-${spot.lon}`}
              type="button"
              onClick={() => {
                window.open(
                  `https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lon}&travelmode=driving`,
                  "_blank",
                )
              }}
              className="flex items-center gap-3 rounded-xl bg-card p-3 text-left transition-colors active:bg-accent"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                {i + 1}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">
                  {spot.name}
                </p>
                <p className="text-[11px] font-medium text-primary">
                  {spot.distanceLabel}
                </p>
                {spot.address && (
                  <p className="text-[11px] text-muted-foreground">{spot.address}</p>
                )}
              </div>
              <Navigation size={14} className="shrink-0 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
