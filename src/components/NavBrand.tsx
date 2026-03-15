// src/components/NavBrand.tsx
import { useNavigate } from "@tanstack/react-router";

export function NavBrand() {
	const navigate = useNavigate();

	return (
		<button
			type="button"
			onClick={() => navigate({ to: "/driver-monitor" })}
			className="select-none text-left text-lg font-black tracking-tight transition-opacity hover:opacity-90 active:opacity-80"
			style={{ color: "var(--dashcam-yellow)" }}
			aria-label="BeeSafe – go to record"
		>
			Bee<span className="text-foreground">Safe</span>
		</button>
	);
}
