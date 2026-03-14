// src/hooks/use-camera-devices.ts
import { useEffect, useState } from "react";

export type CameraDevice = {
	deviceId: string;
	label: string;
};

export function useCameraDevices() {
	const [devices, setDevices] = useState<CameraDevice[]>([]);

	useEffect(() => {
		let disposed = false;

		async function enumerate() {
			try {
				const all = await navigator.mediaDevices.enumerateDevices();
				if (disposed) return;
				setDevices(
					all
						.filter((d) => d.kind === "videoinput")
						.map((d, i) => ({
							deviceId: d.deviceId,
							label: d.label || `Camera ${i + 1}`,
						})),
				);
			} catch {
				/* permissions not yet granted — devices populate after first getUserMedia */
			}
		}

		if (
			typeof navigator === "undefined" ||
			!navigator.mediaDevices ||
			!navigator.mediaDevices.enumerateDevices
		) {
			return;
		}

		const mediaDevices = navigator.mediaDevices;

		enumerate();

		mediaDevices.addEventListener("devicechange", enumerate);

		return () => {
			disposed = true;
			mediaDevices.removeEventListener("devicechange", enumerate);
		};
	}, []);

	return devices;
}
