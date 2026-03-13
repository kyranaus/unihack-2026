// src/components/home/DriverScoreCircle.tsx
type DriverScoreCircleProps = {
  score: number
}

export function DriverScoreCircle({ score }: DriverScoreCircleProps) {
  const clamped = Math.min(100, Math.max(0, score))
  const size = 192
  const strokeWidth = 14
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = (clamped / 100) * circumference

  return (
    <div className="relative flex h-48 w-48 items-center justify-center">
      <svg
        width={size}
        height={size}
        className="-rotate-90"
        aria-hidden="true"
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--border)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress — yellow gradient */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#dashcamYellow)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
        />
        <defs>
          <linearGradient id="dashcamYellow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-4xl font-bold tabular-nums text-foreground">
          {clamped}
          <span className="text-lg font-normal text-muted-foreground">/100</span>
        </div>
        <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Driver score
        </p>
      </div>
    </div>
  )
}
