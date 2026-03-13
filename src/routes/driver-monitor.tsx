// src/routes/driver-monitor.tsx
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import DriverMonitor from "#/components/DriverMonitor";

export const Route = createFileRoute("/driver-monitor")({
  component: DriverMonitorPage,
});

function DriverMonitorPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [recSeconds, setRecSeconds] = useState(0);
  const [activeCamera, setActiveCamera] = useState<"front" | "back">("front");

  useEffect(() => {
    if (!isRecording) { setRecSeconds(0); return; }
    const id = setInterval(() => setRecSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [isRecording]);

  const recMins = Math.floor(recSeconds / 60).toString().padStart(2, "0");
  const recSecs = (recSeconds % 60).toString().padStart(2, "0");

  return (
    <div className="flex h-dvh flex-col bg-black pb-[88px]">
      {/* Title */}
      <div
        className="flex flex-none items-center justify-center pb-2"
        style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
      >
        <span className="text-base font-bold tracking-wide text-white">Record</span>
      </div>

      {/* Video window */}
      <div className="relative mx-3 min-h-0 flex-1 overflow-hidden rounded-2xl bg-zinc-950">
        <DriverMonitor />

        {/* REC indicator — overlays the status badge top-left when recording */}
        {isRecording && (
          <div className="absolute left-3 top-3 z-30 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 backdrop-blur-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
            <span className="font-mono text-xs font-bold text-white">
              REC {recMins}:{recSecs}
            </span>
          </div>
        )}

        {/* Switch camera — bottom-right */}
        <button
          type="button"
          onClick={() => setActiveCamera((c) => (c === "front" ? "back" : "front"))}
          className="absolute bottom-3 right-3 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-transform active:scale-95"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-none flex-col items-center gap-3 py-4">
        {/* Record button */}
        <button
          type="button"
          onClick={() => setIsRecording((r) => !r)}
          className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white transition-transform active:scale-95"
        >
          <span
            className={`block bg-red-500 transition-all ${
              isRecording
                ? "animate-pulse h-7 w-7 rounded-md"
                : "h-10 w-10 rounded-full"
            }`}
          />
        </button>

        {/* Front · Back toggle */}
        <div className="flex items-center rounded-full bg-white/10 p-0.5">
          {(["front", "back"] as const).map((cam) => (
            <button
              key={cam}
              type="button"
              onClick={() => setActiveCamera(cam)}
              className={`rounded-full px-4 py-1 text-xs font-semibold capitalize transition-colors ${
                activeCamera === cam ? "bg-white text-black" : "text-white/60"
              }`}
            >
              {cam}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}