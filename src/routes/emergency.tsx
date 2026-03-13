import { createFileRoute } from "@tanstack/react-router"
import { useState, useEffect, useRef } from "react"
import { usePollyTTS } from "#/lib/use-polly-tts"

export const Route = createFileRoute("/emergency")({ component: Emergency })

const DEMO_NAME = "John Smith"
const DEMO_LOCATION = "Princes Highway, near exit 42"

function useTypewriter(text: string, enabled: boolean, speed = 60) {
  const [displayed, setDisplayed] = useState("")
  const indexRef = useRef(0)

  useEffect(() => {
    if (!enabled) {
      setDisplayed("")
      indexRef.current = 0
      return
    }

    const interval = setInterval(() => {
      if (indexRef.current < text.length) {
        indexRef.current++
        setDisplayed(text.slice(0, indexRef.current))
      } else {
        clearInterval(interval)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, enabled, speed])

  return displayed
}

function Emergency() {
  const [showNotification, setShowNotification] = useState(false)
  const [countdown, setCountdown] = useState(10)
  const [isCalling, setIsCalling] = useState(false)
  const [callDuration, setCallDuration] = useState(0)

  const { speak, stop: stopTTS, status: ttsStatus } = usePollyTTS()

  const emergencyMessage = `Hi, my name is ${DEMO_NAME}. I have been in an accident on the road at ${DEMO_LOCATION} and require emergency assistance.`
  const typedText = useTypewriter(emergencyMessage, isCalling, 60)

  useEffect(() => {
    if (showNotification && countdown > 0 && !isCalling) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (showNotification && countdown === 0 && !isCalling) {
      setIsCalling(true)
      setCallDuration(0)
    }
  }, [showNotification, countdown, isCalling])

  useEffect(() => {
    if (isCalling) {
      speak(emergencyMessage)
    } else {
      stopTTS()
    }
  }, [isCalling])

  useEffect(() => {
    if (!isCalling) return
    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [isCalling])

  const triggerEmergency = () => {
    setShowNotification(true)
    setCountdown(10)
    setIsCalling(false)
  }

  const dismissNotification = () => {
    stopTTS()
    setShowNotification(false)
    setCountdown(10)
    setIsCalling(false)
    setCallDuration(0)
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4">
        {isCalling ? (
          <div className="flex w-full flex-col items-center gap-6">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-green-400">Connected to 000</p>
            <p className="text-2xl font-mono tabular-nums text-white">
              {String(Math.floor(callDuration / 60)).padStart(2, "0")}:{String(callDuration % 60).padStart(2, "0")}
            </p>

            <div className="w-full rounded-xl bg-zinc-900 border border-zinc-800 p-5">
              <p className="text-base leading-relaxed text-white">
                {typedText}
                <span className="inline-block w-0.5 h-5 bg-white ml-0.5 align-middle animate-pulse" />
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs text-zinc-400">
                {ttsStatus === "loading" && (
                  <>
                    <span className="inline-block h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
                    Generating speech...
                  </>
                )}
                {ttsStatus === "playing" && (
                  <>
                    <span className="inline-block h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                    Speaking to operator
                  </>
                )}
                {ttsStatus === "error" && (
                  <>
                    <span className="inline-block h-2 w-2 rounded-full bg-red-400" />
                    Voice unavailable — text sent
                  </>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={dismissNotification}
              className="mt-4 rounded-full bg-red-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700"
            >
              End Call
            </button>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={triggerEmergency}
              className="rounded-lg bg-red-600 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-red-700 active:bg-red-800"
            >
              Trigger Emergency
            </button>
            <p className="mt-4 text-sm text-zinc-500 text-center">
              Click to simulate accident detection
            </p>
          </>
        )}
      </div>

      {showNotification && !isCalling && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-4 px-4 pointer-events-none">
          <div className="w-full max-w-sm pointer-events-auto animate-in slide-in-from-top duration-300">
            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl overflow-hidden">
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center animate-pulse">
                      <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">
                      🚨 Accident Detected
                    </p>
                    <p className="text-sm text-zinc-400 mt-1">
                      Calling 000 in {countdown}...
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={dismissNotification}
                    className="flex-shrink-0 text-zinc-400 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={dismissNotification}
                  className="mt-3 w-full rounded-lg bg-zinc-800 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700"
                >
                  I'm Okay - Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
