import { createFileRoute } from "@tanstack/react-router";
import DriverMonitor from "#/components/DriverMonitor";

export const Route = createFileRoute("/driver-monitor")({
  component: DriverMonitorPage,
});

function DriverMonitorPage() {
  return (
    // Full-screen page — no page-wrap, no header padding.
    // pb-24 clears the fixed bottom Navbar.
    <main className="relative min-h-screen w-full pb-24">
      <DriverMonitor />
    </main>
  );
}
