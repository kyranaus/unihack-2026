// src/components/home/BottomNav.tsx
import { Camera, FileText, User } from "lucide-react"
import { cn } from "#/lib/utils"

type BottomNavButtonProps = {
  label: string
  icon: React.ReactNode
  active?: boolean
}

function BottomNavButton({ label, icon, active }: BottomNavButtonProps) {
  return (
    <button
      type="button"
      className="flex flex-col items-center gap-1.5"
    >
      <span
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
          active
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground",
        )}
      >
        {icon}
      </span>
      <span
        className={cn(
          "text-[10px] font-medium uppercase tracking-widest transition-colors",
          active ? "text-primary" : "text-muted-foreground",
        )}
      >
        {label}
      </span>
    </button>
  )
}

export function BottomNav() {
  return (
    <nav className="sticky bottom-0 mt-3 pb-safe">
      <div className="flex items-center justify-around rounded-2xl border border-border bg-card/90 px-6 py-3 backdrop-blur">
        <BottomNavButton label="Camera" icon={<Camera className="h-5 w-5" />} active />
        <BottomNavButton label="Sessions" icon={<FileText className="h-5 w-5" />} />
        <BottomNavButton label="Profile" icon={<User className="h-5 w-5" />} />
      </div>
    </nav>
  )
}
