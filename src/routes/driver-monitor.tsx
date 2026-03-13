import { createFileRoute } from "@tanstack/react-router";
import DriverMonitor from "#/components/DriverMonitor";

export const Route = createFileRoute("/driver-monitor")({
  component: DriverMonitorPage,
});

function DriverMonitorPage() {
  return (
    <main className="page-wrap px-4 pb-8 pt-8">
      <div className="mb-6 text-center rise-in">
        <p className="island-kicker mb-2">Real-Time Detection</p>
        <h1 className="display-title text-3xl font-bold tracking-tight text-[var(--sea-ink)] sm:text-4xl">
          Driver Monitor
        </h1>
        <p className="mx-auto mt-2 max-w-lg text-sm text-[var(--sea-ink-soft)]">
          Browser-based drowsiness and distraction detection using your webcam.
          All processing happens locally — no data leaves your device.
        </p>
      </div>
      <DriverMonitor />
    </main>
  );
}
