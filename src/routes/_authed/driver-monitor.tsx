// src/routes/_authed/driver-monitor.tsx
import { createFileRoute } from "@tanstack/react-router";
import RecordView from "#/components/RecordView";

export const Route = createFileRoute("/_authed/driver-monitor")({
  component: () => <RecordView />,
});