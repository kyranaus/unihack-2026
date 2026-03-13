// src/hooks/useRecording.ts
import { useRef, useState, useCallback } from "react";
import type { RefObject } from "react";

export interface PendingRecording {
  blob: Blob;
  duration: number;
  mimeType: string;
}

function getSupportedMimeType(): string {
  if (typeof MediaRecorder === "undefined") return "";
  const types = ["video/mp4", "video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"];
  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) return type;
  }
  return "";
}

export function useRecording(streamRef: RefObject<MediaStream | null>) {
  const mrRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number>(0);
  const [pending, setPending] = useState<PendingRecording | null>(null);

  const start = useCallback(() => {
    const stream = streamRef.current;
    if (!stream || typeof MediaRecorder === "undefined") return;

    const mimeType = getSupportedMimeType();
    let mr: MediaRecorder;
    try {
      mr = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    } catch {
      try { mr = new MediaRecorder(stream); } catch { return; }
    }

    chunksRef.current = [];
    mr.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    mr.onstop = () => {
      const type = mr.mimeType || mimeType || "video/webm";
      const blob = new Blob(chunksRef.current, { type });
      const duration = Math.round((performance.now() - startTimeRef.current) / 1000);
      setPending({ blob, duration, mimeType: type });
    };

    mr.start(1000);
    mrRef.current = mr;
    startTimeRef.current = performance.now();
  }, [streamRef]);

  const stop = useCallback(() => {
    const mr = mrRef.current;
    if (mr && mr.state !== "inactive") mr.stop();
    mrRef.current = null;
  }, []);

  const clearPending = useCallback(() => setPending(null), []);

  return { start, stop, pending, clearPending };
}
