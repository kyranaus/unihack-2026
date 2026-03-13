type BottomNavButtonProps = {
  label: string
  children: React.ReactNode
}

function BottomNavButton({ label, children }: BottomNavButtonProps) {
  return (
    <button
      type="button"
      className="flex flex-col items-center gap-1 text-xs text-zinc-400"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-800 text-zinc-50">
        {children}
      </span>
      <span className="text-[10px] uppercase tracking-[0.16em]">{label}</span>
    </button>
  )
}

export function BottomNav() {
  return (
    <nav className="sticky bottom-0 left-0 right-0 mt-3">
      <div className="mx-auto flex max-w-md items-center justify-around rounded-2xl border border-zinc-800 bg-zinc-900/80 px-6 py-3 backdrop-blur">
        <BottomNavButton label="Camera">
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="3"
              y="7"
              width="18"
              height="12"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <path
              d="M9 7L10.2 5.4C10.52 4.96 11.04 4.7 11.6 4.7H12.4C12.96 4.7 13.48 4.96 13.8 5.4L15 7"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <circle
              cx="12"
              cy="13"
              r="3"
              stroke="currentColor"
              strokeWidth="1.6"
            />
          </svg>
        </BottomNavButton>

        <BottomNavButton label="Sessions">
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="4"
              y="3"
              width="14"
              height="18"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <path
              d="M8 7H14"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path
              d="M8 11H14"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path
              d="M8 15H12"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </BottomNavButton>

        <BottomNavButton label="Profile">
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="9"
              r="3.2"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <path
              d="M6 19C6.8 16.5 9.2 15 12 15C14.8 15 17.2 16.5 18 19"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </BottomNavButton>
      </div>
    </nav>
  )
}
