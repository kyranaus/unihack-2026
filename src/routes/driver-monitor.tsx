// src/routes/driver-monitor.tsx
import { createFileRoute } from "@tanstack/react-router";
import RecordView from "#/components/RecordView";

export const Route = createFileRoute("/driver-monitor")({
  component: () => <RecordView />,
});
