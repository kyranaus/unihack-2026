// src/components/Navbar.tsx
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Clock, Home, User, Video } from "lucide-react";

const tabs = [
  { id: "home", label: "Home", icon: Home, to: "/" },
  { id: "record", label: "Record", icon: Video, to: "/record" },
  { id: "replay", label: "Replay", icon: Clock, to: "/replay" },
  { id: "profile", label: "Profile", icon: User, to: "/profile" },
] as const;

export function Navbar() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const activeIndex = tabs.findIndex((t) => t.to === pathname) ?? 0;
  const safeIndex = activeIndex === -1 ? 0 : activeIndex;
  const leftPercent = 12.5 + safeIndex * 25;

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-6 px-4 pointer-events-none z-50">
      <div
        className="relative flex items-center w-full max-w-sm pointer-events-auto"
        style={{ height: 56, backgroundColor: "#1a1a1a", borderRadius: 999 }}
      >
        {tabs.map((tab, i) => {
          const Icon = tab.icon;
          const isActive = i === safeIndex;
          return (
            <button
              key={tab.id}
              onClick={() => navigate({ to: tab.to as "/" })}
              className="flex-1 flex items-center justify-center"
              style={{ height: "100%" }}
              aria-label={tab.label}
            >
              {!isActive && (
                <Icon size={22} color="#6b7280" strokeWidth={1.5} />
              )}
            </button>
          );
        })}

        <div
          className="absolute flex flex-col items-center justify-center transition-all duration-300"
          style={{
            left: `${leftPercent}%`,
            transform: "translateX(-50%) translateY(-30%)",
            width: 64,
            height: 64,
            backgroundColor: "#EAB308",
            borderRadius: 999,
            pointerEvents: "none",
          }}
        >
          {(() => {
            const Icon = tabs[safeIndex].icon;
            return (
              <>
                <Icon size={24} color="#1a1a1a" strokeWidth={2} />
                <span
                  className="text-xs font-semibold mt-0.5"
                  style={{ color: "#1a1a1a", lineHeight: 1 }}
                >
                  {tabs[safeIndex].label}
                </span>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
