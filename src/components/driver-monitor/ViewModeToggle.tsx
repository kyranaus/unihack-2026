// src/components/driver-monitor/ViewModeToggle.tsx
import { RefreshCw } from "lucide-react";

export type ViewMode = "road" | "face";

export function ViewModeToggle({
	mode,
	onToggle,
}: {
	mode: ViewMode;
	onToggle: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onToggle}
			className="absolute right-4 top-14 z-20 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-all active:scale-95"
		>
			<RefreshCw size={12} />
			{mode === "road" ? "Road View" : "Face View"}
		</button>
	);
}
