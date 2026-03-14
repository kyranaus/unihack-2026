import { r as reactExports } from "../_libs/react.mjs";
import { S as Store } from "../_libs/tanstack__store.mjs";
const CAPTURE_INTERVAL_MS = 1e3;
const SEND_INTERVAL_MS = 1e3;
const CHANGE_THRESHOLD = 5;
const MAX_FRAMES_PER_BATCH = 4;
const DIFF_WIDTH = 80;
const DIFF_HEIGHT = 45;
function useFrameCapture(videoRef, isRecording, onBatchReady) {
  const keyFramesRef = reactExports.useRef([]);
  const prevPixelsRef = reactExports.useRef(null);
  const captureCanvasRef = reactExports.useRef(null);
  const diffCanvasRef = reactExports.useRef(null);
  const callbackRef = reactExports.useRef(onBatchReady);
  const sendTimerRef = reactExports.useRef(null);
  callbackRef.current = onBatchReady;
  const getCaptureCanvas = reactExports.useCallback(() => {
    if (!captureCanvasRef.current) {
      captureCanvasRef.current = document.createElement("canvas");
      captureCanvasRef.current.width = 384;
      captureCanvasRef.current.height = 216;
    }
    return captureCanvasRef.current;
  }, []);
  const getDiffCanvas = reactExports.useCallback(() => {
    if (!diffCanvasRef.current) {
      diffCanvasRef.current = document.createElement("canvas");
      diffCanvasRef.current.width = DIFF_WIDTH;
      diffCanvasRef.current.height = DIFF_HEIGHT;
    }
    return diffCanvasRef.current;
  }, []);
  const computeChangeScore = reactExports.useCallback(
    (video) => {
      const canvas = getDiffCanvas();
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return 999;
      ctx.drawImage(video, 0, 0, DIFF_WIDTH, DIFF_HEIGHT);
      const currentPixels = ctx.getImageData(0, 0, DIFF_WIDTH, DIFF_HEIGHT).data;
      const prev = prevPixelsRef.current;
      if (!prev) {
        prevPixelsRef.current = new Uint8ClampedArray(currentPixels);
        return 999;
      }
      let totalDiff = 0;
      const pixelCount = DIFF_WIDTH * DIFF_HEIGHT;
      for (let i = 0; i < currentPixels.length; i += 4) {
        totalDiff += Math.abs(currentPixels[i] - prev[i]) + Math.abs(currentPixels[i + 1] - prev[i + 1]) + Math.abs(currentPixels[i + 2] - prev[i + 2]);
      }
      prevPixelsRef.current = new Uint8ClampedArray(currentPixels);
      return totalDiff / (pixelCount * 3);
    },
    [getDiffCanvas]
  );
  const captureFrame = reactExports.useCallback(
    (video) => {
      const canvas = getCaptureCanvas();
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      ctx.drawImage(video, 0, 0, 384, 216);
      return canvas.toDataURL("image/jpeg", 0.45).split(",")[1];
    },
    [getCaptureCanvas]
  );
  const flushBatch = reactExports.useCallback(() => {
    const frames = keyFramesRef.current;
    if (frames.length === 0) return;
    keyFramesRef.current = [];
    callbackRef.current(frames.slice(0, MAX_FRAMES_PER_BATCH));
  }, []);
  reactExports.useEffect(() => {
    if (!isRecording) {
      keyFramesRef.current = [];
      prevPixelsRef.current = null;
      if (sendTimerRef.current) clearInterval(sendTimerRef.current);
      sendTimerRef.current = null;
      return;
    }
    let isFirstFrame = true;
    const captureInterval = setInterval(() => {
      const video = videoRef.current;
      if (!video || video.readyState < 2) return;
      const changeScore = computeChangeScore(video);
      if (isFirstFrame || changeScore >= CHANGE_THRESHOLD) {
        const frame = captureFrame(video);
        if (frame) {
          keyFramesRef.current.push(frame);
          if (keyFramesRef.current.length > MAX_FRAMES_PER_BATCH) {
            keyFramesRef.current = keyFramesRef.current.slice(-MAX_FRAMES_PER_BATCH);
          }
        }
        isFirstFrame = false;
      }
    }, CAPTURE_INTERVAL_MS);
    sendTimerRef.current = setInterval(flushBatch, SEND_INTERVAL_MS);
    return () => {
      clearInterval(captureInterval);
      if (sendTimerRef.current) clearInterval(sendTimerRef.current);
    };
  }, [isRecording, videoRef, computeChangeScore, captureFrame, flushBatch]);
}
const driveSessionStore = new Store({
  sessionId: null,
  startedAt: null
});
function getActiveSession() {
  const state = driveSessionStore.state;
  if (!state.sessionId || !state.startedAt) return null;
  return {
    sessionId: state.sessionId,
    elapsedSec: Math.floor((Date.now() - state.startedAt) / 1e3)
  };
}
export {
  driveSessionStore as d,
  getActiveSession as g,
  useFrameCapture as u
};
