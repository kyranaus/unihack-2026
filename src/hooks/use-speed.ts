import { useEffect, useState } from "react";

type SpeedState = {
	speedKmh: number | null;
	hasPermission: boolean | null;
	error: string | null;
};

export function useSpeed() {
	const [state, setState] = useState<SpeedState>({
		speedKmh: null,
		hasPermission: null,
		error: null,
	});

	useEffect(() => {
		if (typeof window === "undefined" || !("geolocation" in navigator)) {
			setState((prev) => ({
				...prev,
				error: "Geolocation is not available on this device.",
			}));
			return;
		}

		const watchId = navigator.geolocation.watchPosition(
			(position) => {
				const speedMs = position.coords.speed;
				const speedKmh =
					typeof speedMs === "number" && !Number.isNaN(speedMs)
						? Math.max(0, speedMs * 3.6)
						: null;

				setState({
					speedKmh,
					hasPermission: true,
					error: null,
				});
			},
			(error) => {
				setState((prev) => ({
					...prev,
					hasPermission:
						error.code === error.PERMISSION_DENIED ? false : prev.hasPermission,
					error: error.message,
				}));
			},
			{
				enableHighAccuracy: true,
				maximumAge: 1000,
				timeout: 5000,
			},
		);

		return () => {
			navigator.geolocation.clearWatch(watchId);
		};
	}, []);

	return state;
}

