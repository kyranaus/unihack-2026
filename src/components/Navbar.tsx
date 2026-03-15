// src/components/Navbar.tsx
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Home, Video, PlaySquare, User, Trophy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NavBrand } from "./NavBrand";
import { InteractiveMenu, type InteractiveMenuItem } from "./ui/modern-mobile-menu";

const navItems: InteractiveMenuItem[] = [
  { label: "home",    icon: Home },
  { label: "record",  icon: Video },
  { label: "replays", icon: PlaySquare },
  { label: "rank",    icon: Trophy },
  { label: "profile", icon: User },
];

const desktopItems = [
  { label: "Home",    icon: Home,       route: "/" },
  { label: "Record",  icon: Video,      route: "/driver-monitor" },
  { label: "Replays", icon: PlaySquare, route: "/replay" },
  { label: "Rank",    icon: Trophy,     route: "/leaderboard" },
  { label: "Profile", icon: User,       route: "/profile" },
] as const;

const routes = ["/", "/driver-monitor", "/replay", "/leaderboard", "/profile"] as const;

const HIDE_DELAY_MS = 3000;

export function Navbar() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [visible, setVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeIndex = Math.max(0, routes.indexOf(pathname as (typeof routes)[number]));

  const showNav = () => {
    setVisible(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setVisible(false), HIDE_DELAY_MS);
  };

  useEffect(() => {
    // Start the initial hide timer
    timerRef.current = setTimeout(() => setVisible(false), HIDE_DELAY_MS);

    const handleInteraction = () => showNav();
    window.addEventListener("touchstart", handleInteraction, { passive: true });
    window.addEventListener("mousemove", handleInteraction, { passive: true });
    window.addEventListener("scroll", handleInteraction, { passive: true });

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      window.removeEventListener("touchstart", handleInteraction);
      window.removeEventListener("mousemove", handleInteraction);
      window.removeEventListener("scroll", handleInteraction);
    };
  }, []);

  const handleItemClick = (index: number) => {
    navigate({ to: routes[index] as "/" });
  };

  return (
    <>
      {/* Top navbar */}
      <header
        className={`flex fixed top-0 left-0 right-0 z-50 items-center justify-between min-h-16 px-8 py-3 border-b border-border bg-background/80 backdrop-blur-md transition-transform duration-300 ${visible ? "translate-y-0" : "-translate-y-full"}`}
      >
        <NavBrand />

        {/* Nav links — hidden on mobile */}
        <nav className="hidden md:flex items-center gap-1">
          {desktopItems.map(({ label, icon: Icon, route }) => {
            const active = pathname === route;
            return (
              <button
                key={route}
                type="button"
                onClick={() => navigate({ to: route as "/" })}
                className="cursor-pointer flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors"
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
        <div
          className={`fixed bottom-0 left-0 right-0 h-32 pointer-events-none z-40 bg-gradient-to-t from-background to-transparent transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
        />

        <div
          className={`fixed bottom-0 left-0 right-0 flex justify-center px-4 pointer-events-none z-50 transition-transform duration-300 ${visible ? "translate-y-0" : "translate-y-full"}`}
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
