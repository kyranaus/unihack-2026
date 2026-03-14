// src/hooks/use-traffic-detection.ts
import { useEffect, useRef, useState, useCallback } from "react";
import { loadYoloModel, runDetection, type Detection } from "#/lib/traffic-detection";

interface Options {
  /** Target detection interval in ms (default 150 → ~6.7 fps) */
  intervalMs?: number;
  /** Confidence threshold 0–1 (default 0.45) */
  confThresh?: number;
}

interface UseTrafficDetectionResult {
  detections: Detection[];
  modelReady: boolean;
  modelLoading: boolean;
}

export function useTrafficDetection(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  enabled: boolean,
  options: Options = {},
): UseTrafficDetectionResult {
  const { intervalMs = 150, confThresh = 0.45 } = options;

  const [modelReady, setModelReady] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const [detections, setDetections] = useState<Detection[]>([]);

  const sessionRef = useRef<unknown>(null);
  const rafRef = useRef<number>(0);
  const lastRunRef = useRef<number>(0);
  const runningRef = useRef(false);
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  // Load the model once
  useEffect(() => {
    if (!enabled || sessionRef.current) return;
    setModelLoading(true);
    loadYoloModel()
      .then((sess) => {
        sessionRef.current = sess;
        setModelReady(true);
        setModelLoading(false);
      })
      .catch((err) => {
        console.error("[useTrafficDetection] model load failed:", err);
        setModelLoading(false);
      });
  }, [enabled]);

  const detect = useCallback(async () => {
    const video = videoRef.current;
    const session = sessionRef.current;
    if (!video || !session || video.readyState < 2 || video.paused || document.hidden) return;

    try {
      const dets = await runDetection(session, video, confThresh);
      setDetections(dets);
    } catch (err) {
      console.warn("[useTrafficDetection] detection error:", err);
    }
  }, [videoRef, confThresh]);

  // Detection loop
  useEffect(() => {
    if (!enabled || !modelReady) {
      setDetections([]);
      return;
    }

    let cancelled = false;

    const loop = (now: number) => {
      if (cancelled) return;
      if (!runningRef.current && now - lastRunRef.current >= intervalMs) {
        lastRunRef.current = now;
        runningRef.current = true;
        detect().finally(() => { runningRef.current = false; });
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
    };
  }, [enabled, modelReady, intervalMs, detect]);

  // Clear detections when disabled
  useEffect(() => {
    if (!enabled) setDetections([]);
  }, [enabled]);

  return { detections, modelReady, modelLoading };
}
