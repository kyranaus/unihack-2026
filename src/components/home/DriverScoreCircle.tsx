type DriverScoreCircleProps = {
  score: number
}

export function DriverScoreCircle({ score }: DriverScoreCircleProps) {
  const clamped = Math.min(100, Math.max(0, score))
  const size = 176
  const strokeWidth = 12
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = (clamped / 100) * circumference

  return (
    <div className="relative flex h-44 w-44 items-center justify-center md:h-48 md:w-48">
      <svg
        width={size}
        height={size}
        className="-rotate-90 text-zinc-800"
        aria-hidden="true"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
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
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-3xl font-semibold">
          {clamped}
          <span className="text-base text-zinc-400">/100</span>
        </div>
        <p className="mt-1 text-xs uppercase tracking-[0.16em] text-zinc-500">
          Driver score
        </p>
      </div>
    </div>
  )
}
