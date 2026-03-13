// src/components/Navbar.tsx
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Home, Video, PlaySquare, User } from "lucide-react";
import { InteractiveMenu, type InteractiveMenuItem } from "./ui/modern-mobile-menu";

const navItems: InteractiveMenuItem[] = [
  { label: "home",    icon: Home },
  { label: "record",  icon: Video },
  { label: "replays", icon: PlaySquare },
  { label: "profile", icon: User },
];

const routes = ["/", "/driver-monitor", "/replay", "/profile"] as const;

export function Navbar() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const activeIndex = Math.max(0, routes.indexOf(pathname as (typeof routes)[number]));

  const handleItemClick = (index: number) => {
    navigate({ to: routes[index] as "/" });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-6 px-4 pointer-events-none z-50">
      <div className="pointer-events-auto w-full max-w-sm">
        <InteractiveMenu
          items={navItems}
          activeIndex={activeIndex}
          onItemClick={handleItemClick}
          accentColor="var(--dashcam-yellow)"
        />
      </div>
    </div>
  );
}
