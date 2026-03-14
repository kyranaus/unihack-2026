// src/components/driver-monitor/CameraPicker.tsx
import { Camera, ChevronDown } from "lucide-react";
import { useState } from "react";
import type { CameraDevice } from "#/hooks/use-camera-devices";
import type { CameraMode } from "#/hooks/use-camera-mode";

export function CameraPicker({
	devices,
	driverDeviceId,
	roadDeviceId,
	onDriverChange,
	onRoadChange,
	cameraMode = "dual",
	activeCamera = "front",
}: {
	devices: CameraDevice[];
	driverDeviceId: string | null;
	roadDeviceId: string | null;
	onDriverChange: (deviceId: string) => void;
	onRoadChange: (deviceId: string) => void;
	cameraMode?: CameraMode;
	activeCamera?: "front" | "back";
}) {
	const [open, setOpen] = useState(false);
	const isSingle = cameraMode === "single";

	const showDriver = !isSingle || activeCamera === "front";
	const showRoad = !isSingle || activeCamera === "back";

	return (
		<div className="absolute right-4 top-4 z-30">
			<button
				type="button"
				onClick={() => setOpen((o) => !o)}
				className="flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm"
			>
				<Camera size={14} />
				{isSingle ? "Camera" : "Cameras"} {devices.length > 0 ? `(${devices.length})` : ""}
				<ChevronDown
					size={12}
					className={`transition-transform ${open ? "rotate-180" : ""}`}
				/>
			</button>

			{open && (
				<div className="mt-2 w-56 rounded-xl border border-white/10 bg-black/80 p-3 backdrop-blur-md">
					{devices.length === 0 ? (
						<p className="text-[10px] text-white/40">No cameras detected</p>
					) : (
						<>
							{showDriver && (
								<>
									<p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/40">
										Driver Camera
									</p>
									{devices.map((d) => (
										<button
											key={`driver-${d.deviceId}`}
											type="button"
											onClick={() => {
												onDriverChange(d.deviceId);
												setOpen(false);
											}}
											className={`mb-1 block w-full truncate rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors ${
												driverDeviceId === d.deviceId
													? "bg-white/20 font-semibold text-white"
													: "text-white/60 hover:bg-white/10 hover:text-white"
											}`}
										>
											{d.label}
										</button>
									))}
								</>
							)}

							{showDriver && showRoad && (
								<div className="my-2 border-t border-white/10" />
							)}

							{showRoad && (
								<>
									<p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/40">
										Road Camera
									</p>
									{devices.map((d) => (
										<button
											key={`road-${d.deviceId}`}
											type="button"
											onClick={() => {
												onRoadChange(d.deviceId);
												setOpen(false);
											}}
											className={`mb-1 block w-full truncate rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors ${
												roadDeviceId === d.deviceId
													? "bg-white/20 font-semibold text-white"
													: "text-white/60 hover:bg-white/10 hover:text-white"
											}`}
										>
											{d.label}
										</button>
									))}
								</>
							)}
						</>
					)}
				</div>
			)}
		</div>
	);
}
