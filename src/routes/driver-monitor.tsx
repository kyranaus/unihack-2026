import { createFileRoute } from "@tanstack/react-router";
import DriverMonitor from "#/components/DriverMonitor";

export const Route = createFileRoute("/driver-monitor")({
  component: DriverMonitorPage,
});

function DriverMonitorPage() {
  return (
    // Full-screen page — no page-wrap, no header padding.
    // pb-24 clears the fixed bottom Navbar.
    <main className="relative h-dvh w-full pb-[88px]">
      <DriverMonitor />
    </main>
  );
}
