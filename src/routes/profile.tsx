// src/routes/profile.tsx
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export const Route = createFileRoute("/profile")({ component: ProfilePage });

function ProfilePage() {
  const [light, setLight] = useState(() =>
    document.documentElement.classList.contains("light")
  );

  useEffect(() => {
    const html = document.documentElement;
    if (light) {
      html.classList.add("light");
      html.classList.remove("dark");
    } else {
      html.classList.remove("light");
      html.classList.add("dark");
    }
  }, [light]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-4 pt-10 pb-32">
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            DashCam
          </p>
          <h1 className="mt-1 text-2xl font-semibold">Profile</h1>
        </header>

        {/* Theme toggle row */}
        <div className="flex items-center justify-between rounded-2xl bg-card border border-border px-5 py-4">
          <div className="flex items-center gap-3">
            {light ? (
              <Sun size={20} className="text-primary" />
            ) : (
              <Moon size={20} className="text-primary" />
            )}
            <div>
              <p className="text-sm font-semibold">
                {light ? "Light mode" : "Dark mode"}
              </p>
              <p className="text-xs text-muted-foreground">
                {light ? "White · Blue accent" : "Black · Yellow accent"}
              </p>
            </div>
          </div>

          {/* Toggle switch */}
          <button
            onClick={() => setLight((v) => !v)}
            className="relative h-7 w-12 overflow-hidden rounded-full transition-colors duration-300"
            style={{ backgroundColor: light ? "var(--primary)" : "#3f3f46" }}
            aria-label="Toggle theme"
          >
            <span
              className="absolute left-0 top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform duration-300"
              style={{ transform: light ? "translateX(22px)" : "translateX(2px)" }}
            />
          </button>
        </div>
      </div>
    </main>
  );
}
