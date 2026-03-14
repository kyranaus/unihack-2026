import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
function usePollyTTS() {
  const [status, setStatus] = reactExports.useState("idle");
  const audioRef = reactExports.useRef(null);
  const objectUrlRef = reactExports.useRef(null);
  const cleanup = reactExports.useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }, []);
  const speak = reactExports.useCallback(
    async (text) => {
      cleanup();
      setStatus("loading");
      try {
        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text })
        });
        if (!res.ok) {
          throw new Error(`TTS request failed: ${res.status}`);
        }
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        objectUrlRef.current = url;
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.addEventListener("ended", () => setStatus("idle"));
        audio.addEventListener("error", () => setStatus("error"));
        setStatus("playing");
        await audio.play();
      } catch (err) {
        console.error("Polly TTS error:", err);
        setStatus("error");
      }
    },
    [cleanup]
  );
  const stop = reactExports.useCallback(() => {
    cleanup();
    setStatus("idle");
  }, [cleanup]);
  return { speak, stop, status };
}
const DEMO_NAME = "John Smith";
const DEMO_LOCATION = "Princes Highway, near exit 42";
function useTypewriter(text, enabled, speed = 80) {
  const [displayed, setDisplayed] = reactExports.useState("");
  const indexRef = reactExports.useRef(0);
  reactExports.useEffect(() => {
    if (!enabled) {
      setDisplayed("");
      indexRef.current = 0;
      return;
    }
    const interval = setInterval(() => {
      if (indexRef.current < text.length) {
        indexRef.current++;
        setDisplayed(text.slice(0, indexRef.current));
      } else {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, enabled, speed]);
  return displayed;
}
function Emergency() {
  const [showNotification, setShowNotification] = reactExports.useState(false);
  const [countdown, setCountdown] = reactExports.useState(10);
  const [isCalling, setIsCalling] = reactExports.useState(false);
  const [callDuration, setCallDuration] = reactExports.useState(0);
  const {
    speak,
    stop: stopTTS,
    status: ttsStatus
  } = usePollyTTS();
  const emergencyMessage = `Hi, my name is ${DEMO_NAME}. I have been in an accident on the road at ${DEMO_LOCATION} and require emergency assistance.`;
  const typedText = useTypewriter(emergencyMessage, isCalling, 80);
  reactExports.useEffect(() => {
    if (showNotification && countdown > 0 && !isCalling) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1e3);
      return () => clearTimeout(timer);
    } else if (showNotification && countdown === 0 && !isCalling) {
      setIsCalling(true);
      setCallDuration(0);
    }
  }, [showNotification, countdown, isCalling]);
  reactExports.useEffect(() => {
    if (isCalling) {
      speak(emergencyMessage);
    } else {
      stopTTS();
    }
  }, [isCalling]);
  reactExports.useEffect(() => {
    if (!isCalling) return;
    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1e3);
    return () => clearInterval(interval);
  }, [isCalling]);
  reactExports.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const fromCrash = window.sessionStorage.getItem("dashcam.crashTriggered");
      if (fromCrash === "1") {
        window.sessionStorage.removeItem("dashcam.crashTriggered");
        setShowNotification(true);
        setCountdown(10);
        setIsCalling(false);
      }
    } catch {
    }
  }, []);
  const triggerEmergency = () => {
    setShowNotification(true);
    setCountdown(10);
    setIsCalling(false);
  };
  const dismissNotification = () => {
    stopTTS();
    setShowNotification(false);
    setCountdown(10);
    setIsCalling(false);
    setCallDuration(0);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "min-h-screen bg-black text-white", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4", children: isCalling ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex w-full flex-col items-center gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-6 h-6 text-green-500", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-green-400", children: "Connected to 000" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-2xl font-mono tabular-nums text-white", children: [
        String(Math.floor(callDuration / 60)).padStart(2, "0"),
        ":",
        String(callDuration % 60).padStart(2, "0")
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full rounded-xl bg-zinc-900 border border-zinc-800 p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-base leading-relaxed text-white", children: [
          typedText,
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block w-0.5 h-5 bg-white ml-0.5 align-middle animate-pulse" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center gap-2 text-xs text-zinc-400", children: [
          ttsStatus === "loading" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block h-2 w-2 rounded-full bg-yellow-400 animate-pulse" }),
            "Generating speech..."
          ] }),
          ttsStatus === "playing" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block h-2 w-2 rounded-full bg-green-400 animate-pulse" }),
            "Speaking to operator"
          ] }),
          ttsStatus === "error" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block h-2 w-2 rounded-full bg-red-400" }),
            "Voice unavailable — text sent"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: dismissNotification, className: "mt-4 rounded-full bg-red-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700", children: "End Call" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: triggerEmergency, className: "rounded-lg bg-red-600 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-red-700 active:bg-red-800", children: "Trigger Emergency" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm text-zinc-500 text-center", children: "Click to simulate accident detection" })
    ] }) }),
    showNotification && !isCalling && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-start justify-center pt-4 px-4 pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full max-w-sm pointer-events-auto animate-in slide-in-from-top duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center animate-pulse", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-6 h-6 text-red-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" }) }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-white", children: "🚨 Accident Detected" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-zinc-400 mt-1", children: [
            "Calling 000 in ",
            countdown,
            "..."
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: dismissNotification, className: "flex-shrink-0 text-zinc-400 hover:text-white transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: dismissNotification, className: "mt-3 w-full rounded-lg bg-zinc-800 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700", children: "I'm Okay - Dismiss" })
    ] }) }) }) })
  ] });
}
export {
  Emergency as component
};
