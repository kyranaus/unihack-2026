// src/hooks/use-camera-mode.ts
import { useCallback, useEffect, useState } from "react";

export type CameraMode = "dual" | "single";

function detectIOS(): boolean {
	if (typeof navigator === "undefined") return false;
	return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

/**
 * Determines whether the device supports simultaneous dual camera streams.
 * iOS WebKit kills the first getUserMedia stream when a second one opens,
 * so we default to "single" on iOS. On other platforms we start as "dual"
 * and expose `downgradeToSingle()` so callers can fall back if the second
 * stream kills the first.
 */
export function useCameraMode() {
	const isIOS = detectIOS();
	const [mode, setMode] = useState<CameraMode>(isIOS ? "single" : "dual");

	useEffect(() => {
		if (isIOS) setMode("single");
	}, [isIOS]);

	const downgradeToSingle = useCallback(() => {
		setMode("single");
	}, []);

	return { mode, isIOS, downgradeToSingle };
}
