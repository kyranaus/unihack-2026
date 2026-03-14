// src/hooks/use-camera.ts
import { useCallback, useEffect, useRef, useState } from "react";

type CameraSource =
	| { facingMode: "user" | "environment" }
	| { deviceId: string };

export function useCamera(
	source: CameraSource,
	enabled = true,
	onTrackEnded?: () => void,
) {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [stream, setStream] = useState<MediaStream | null>(null);
	const [isReady, setIsReady] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const onTrackEndedRef = useRef(onTrackEnded);
	onTrackEndedRef.current = onTrackEnded;

	const deviceId = "deviceId" in source ? source.deviceId : undefined;
	const facingMode = "facingMode" in source ? source.facingMode : undefined;

	useEffect(() => {
		if (!enabled) {
			setStream(null);
			setIsReady(false);
			return;
		}

		if (typeof navigator === "undefined") {
			setError("Camera is only available in a browser environment.");
			setStream(null);
			setIsReady(false);
			return;
		}

		if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
			const secure =
				typeof window !== "undefined" ? window.isSecureContext : true;
			if (!secure) {
				setError(
					"Camera access requires HTTPS or localhost. Open this app over https:// to use the camera.",
				);
			} else {
				setError("Camera access is not supported in this browser or device.");
			}
			setStream(null);
			setIsReady(false);
			return;
		}
		let disposed = false;
		let currentStream: MediaStream | null = null;

		async function init() {
			setError(null);
			setIsReady(false);
			try {
				const videoConstraint = deviceId
					? {
							deviceId: { exact: deviceId },
							width: { ideal: 1280 },
							height: { ideal: 720 },
						}
					: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } };

				currentStream = await navigator.mediaDevices.getUserMedia({
					video: videoConstraint,
				});
				if (disposed) {
					for (const t of currentStream.getTracks()) t.stop();
					return;
				}

				const video = videoRef.current;
				if (!video) return;
				video.srcObject = currentStream;
				await video.play();

				if (!disposed) {
					setStream(currentStream);
					setIsReady(true);

					for (const track of currentStream.getTracks()) {
						track.onended = () => {
							if (!disposed) onTrackEndedRef.current?.();
						};
					}
				}
			} catch (err) {
				if (!disposed) {
					if (err && typeof err === "object" && "name" in err) {
						const name = String((err as DOMException).name);
						if (name === "NotFoundError" || name === "OverconstrainedError") {
							setError(
								"No camera was found. Connect a camera or use a device with a camera.",
							);
						} else if (
							name === "NotAllowedError" ||
							name === "SecurityError"
						) {
							const secure =
								typeof window !== "undefined"
									? window.isSecureContext
									: true;
							if (!secure) {
								setError(
									"Camera access is blocked because this page is not served over HTTPS. Use https:// or localhost.",
								);
							} else {
								setError(
									"Camera permission was denied. Allow camera access in your browser settings.",
								);
							}
						} else {
							setError(
								err instanceof Error
									? err.message
									: "Camera unavailable. Please check your device and permissions.",
							);
						}
					} else {
						setError(
							"Camera unavailable. Please check your device and permissions.",
						);
					}
				}
			}
		}

		init();

		return () => {
			disposed = true;
			if (currentStream) {
				for (const t of currentStream.getTracks()) t.stop();
			}
		};
	}, [deviceId, facingMode, enabled]);

	const stopStream = useCallback(() => {
		if (stream) {
			for (const t of stream.getTracks()) t.stop();
		}
		setStream(null);
		setIsReady(false);
	}, [stream]);

	return { videoRef, stream, isReady, error, stopStream };
}
