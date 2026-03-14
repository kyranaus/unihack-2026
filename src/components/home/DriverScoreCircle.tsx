// src/components/home/DriverScoreCircle.tsx
type DriverScoreCircleProps = {
  score: number
  size?: number
}

function scoreGradientColors(score: number): [string, string] {
  if (score >= 70) return ["#4ade80", "#16a34a"]
  if (score >= 40) return ["#facc15", "#eab308"]
  return ["#f87171", "#dc2626"]
}

export function DriverScoreCircle({ score, size = 76 }: DriverScoreCircleProps) {
  const clamped = Math.min(100, Math.max(0, score))
  const strokeWidth = Math.max(6, size * 0.07)
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = (clamped / 100) * circumference
  const [colorStart, colorEnd] = scoreGradientColors(clamped)

  const fontSize = Math.round(size * 0.22)
  const subSize = Math.round(size * 0.1)

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--border)"
          strokeWidth={strokeWidth}
          fill="none"
        />
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
        <span style={{ fontSize }} className="font-bold tabular-nums text-foreground">{clamped}</span>
        <span style={{ fontSize: subSize }} className="text-muted-foreground">/100</span>
      </div>
    </div>
  )
}
