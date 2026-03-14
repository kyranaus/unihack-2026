// src/routes/driver-monitor.tsx
import { createFileRoute } from "@tanstack/react-router";
import DriverMonitor from "#/components/driver-monitor/DriverMonitor";

export const Route = createFileRoute("/driver-monitor")({
  component: () => <DriverMonitor />,
});