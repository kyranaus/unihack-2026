// src/hooks/use-media-recorder.ts
import { useCallback, useEffect, useRef, useState } from "react";
import { getSupportedMimeType } from "#/lib/media-utils";

interface Options {
  onChunk?: (chunk: Blob) => void;
}

export function useMediaRecorder(stream: MediaStream | null, options?: Options) {
	const [isRecording, setIsRecording] = useState(false);
	const [duration, setDuration] = useState(0);
	const recorderRef = useRef<MediaRecorder | null>(null);
	const chunksRef = useRef<Blob[]>([]);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const onChunkRef = useRef(options?.onChunk);
	onChunkRef.current = options?.onChunk;

	const startRecording = useCallback(() => {
		if (!stream || recorderRef.current?.state === "recording") return;

		chunksRef.current = [];
		const mimeType = getSupportedMimeType();
		const recorder = new MediaRecorder(
			stream,
			mimeType ? { mimeType } : undefined,
		);

		recorder.ondataavailable = (e) => {
			if (e.data.size > 0) {
				chunksRef.current.push(e.data);
				onChunkRef.current?.(e.data);
			}
		};

		recorder.start(1000);
		recorderRef.current = recorder;
		setIsRecording(true);
		setDuration(0);

		intervalRef.current = setInterval(() => {
			setDuration((d) => d + 1);
		}, 1000);
	}, [stream]);

	const stopRecording = useCallback((): Promise<Blob | null> => {
		return new Promise((resolve) => {
			const recorder = recorderRef.current;
			if (!recorder || recorder.state === "inactive") {
				resolve(null);
				return;
			}

			recorder.onstop = () => {
				if (chunksRef.current.length === 0) {
					resolve(null);
					return;
				}
				const blob = new Blob(chunksRef.current, {
					type: recorder.mimeType || "video/webm",
				});
				chunksRef.current = [];
				resolve(blob);
			};

			recorder.stop();
			setIsRecording(false);
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		});
	}, []);

	useEffect(() => {
		return () => {
			if (recorderRef.current?.state === "recording") {
				recorderRef.current.stop();
			}
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, []);

	return { isRecording, duration, startRecording, stopRecording };
}
