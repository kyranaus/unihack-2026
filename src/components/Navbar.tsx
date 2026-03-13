// src/components/Navbar.tsx
import { Clock, Home, User, Video } from "lucide-react";
import { useState } from "react";

const tabs = [
  { id: "home", label: "Home", icon: Home },
  { id: "record", label: "Record", icon: Video },
  { id: "replay", label: "Replay", icon: Clock },
  { id: "profile", label: "Profile", icon: User },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function Navbar() {
  const [active, setActive] = useState<TabId>("home");

  const activeIndex = tabs.findIndex((t) => t.id === active);
  const leftPercent = 12.5 + activeIndex * 25;

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-6 px-4 pointer-events-none z-50">
      {/* Pill bar */}
      <div
        className="relative flex items-center w-full max-w-sm pointer-events-auto"
        style={{ height: 56, backgroundColor: "#1a1a1a", borderRadius: 999 }}
      >
        {/* Inactive tab icons */}
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
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

        {/* Active floating icon */}
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
            const Icon = tabs[activeIndex].icon;
            return (
              <>
                <Icon size={24} color="#1a1a1a" strokeWidth={2} />
                <span
                  className="text-xs font-semibold mt-0.5"
                  style={{ color: "#1a1a1a", lineHeight: 1 }}
                >
                  {tabs[activeIndex].label}
                </span>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
