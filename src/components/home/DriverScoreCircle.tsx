// src/components/home/DriverScoreCircle.tsx
type DriverScoreCircleProps = {
  score: number
}

function scoreGradientColors(score: number): [string, string] {
  if (score >= 70) return ["#4ade80", "#16a34a"] // green
  if (score >= 40) return ["#facc15", "#eab308"] // yellow
  return ["#f87171", "#dc2626"]                  // red
}

export function DriverScoreCircle({ score }: DriverScoreCircleProps) {
  const clamped = Math.min(100, Math.max(0, score))
  const size = 76
  const strokeWidth = 7
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = (clamped / 100) * circumference
  const [colorStart, colorEnd] = scoreGradientColors(clamped)

  return (
    <div className="relative flex h-[76px] w-[76px] items-center justify-center">
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--border)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#scoreGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={colorStart} />
            <stop offset="100%" stopColor={colorEnd} />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <span className="text-lg font-bold tabular-nums text-foreground">{clamped}</span>
        <span className="text-[9px] text-muted-foreground">/100</span>
      </div>
    </div>
  )
}
