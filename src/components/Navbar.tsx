// src/components/Navbar.tsx
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Home, Video, PlaySquare, User, Trophy } from "lucide-react";
import { InteractiveMenu, type InteractiveMenuItem } from "./ui/modern-mobile-menu";

const navItems: InteractiveMenuItem[] = [
  { label: "home",        icon: Home },
  { label: "record",      icon: Video },
  { label: "replays",     icon: PlaySquare },
  { label: "rank", icon: Trophy },
  { label: "profile",     icon: User },
];

const desktopItems = [
  { label: "Home",        icon: Home,       route: "/" },
  { label: "Record",      icon: Video,      route: "/driver-monitor" },
  { label: "Replays",     icon: PlaySquare, route: "/replay" },
  { label: "Rank",        icon: Trophy,     route: "/leaderboard" },
  { label: "Profile",     icon: User,       route: "/profile" },
] as const;

const routes = ["/", "/driver-monitor", "/replay", "/leaderboard", "/profile"] as const;

export function Navbar() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const activeIndex = Math.max(0, routes.indexOf(pathname as (typeof routes)[number]));

  const handleItemClick = (index: number) => {
    navigate({ to: routes[index] as "/" });
  };

  return (
    <>
      {/* ── Desktop top navbar (md+) ── */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 z-50 items-center justify-between px-8 py-3 border-b border-border bg-background/80 backdrop-blur-md">
        {/* Brand */}
        <span className="text-lg font-black tracking-tight" style={{ color: "var(--dashcam-yellow)" }}>
          Bee<span className="text-foreground">Safe</span>
        </span>

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          {desktopItems.map(({ label, icon: Icon, route }) => {
            const active = pathname === route;
            return (
              <button
                key={route}
                onClick={() => navigate({ to: route as "/" })}
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors"
                style={active
                  ? { color: "var(--dashcam-yellow)", backgroundColor: "rgba(234,179,8,0.1)" }
                  : { color: "var(--muted-foreground)" }
                }
              >
                <Icon size={15} />
                {label}
              </button>
            );
          })}
        </nav>
      </header>

      {/* ── Mobile bottom nav (below md) ── */}
      <div className="md:hidden">
        {/* Gradient fade */}
        <div className="fixed bottom-0 left-0 right-0 h-32 pointer-events-none z-40 bg-gradient-to-t from-background to-transparent" />

        <div
          className="fixed bottom-0 left-0 right-0 flex justify-center px-4 pointer-events-none z-50"
          style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
        >
          <div className="pointer-events-auto w-full max-w-sm rounded-full shadow-[0_0_20px_rgba(0,0,0,0.3)] ring-1 ring-white/10">
            <InteractiveMenu
              items={navItems}
              activeIndex={activeIndex}
              onItemClick={handleItemClick}
              accentColor="#eab308"
            />
          </div>
        </div>
      </div>
    </>
  );
}
