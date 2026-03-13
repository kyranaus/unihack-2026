import { useState, useEffect, useRef } from "react"
import { PhoneSimulation } from "./PhoneSimulation"

export function EmergencyDetectionTest() {
  const [isEmergency, setIsEmergency] = useState(false)
  const [countdown, setCountdown] = useState(10)
  const [isCalling, setIsCalling] = useState(false)
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isEmergency && countdown > 0) {
      countdownIntervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (countdownIntervalRef.current) {
              clearInterval(countdownIntervalRef.current)
            }
            setIsCalling(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => {
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current)
        }
      }
    }
  }, [isEmergency, countdown])

  const handleTriggerEmergency = () => {
    setIsEmergency(true)
    setCountdown(10)
    setIsCalling(false)
  }

  const handleDismiss = () => {
    setIsEmergency(false)
    setCountdown(10)
    setIsCalling(false)
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current)
    }
  }

  const handleEndCall = () => {
    setIsCalling(false)
    setIsEmergency(false)
    setCountdown(10)
  }

  if (isCalling) {
    return <PhoneSimulation onEndCall={handleEndCall} />
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      {!isEmergency ? (
        <div className="flex flex-col items-center gap-6">
          <div className="rounded-full bg-red-500/10 p-8">
            <svg
              className="h-24 w-24 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <div className="text-center">
            <h2 className="text-xl font-semibold">Emergency Detection Test</h2>
            <p className="mt-2 text-sm text-zinc-400">
              Click the button below to simulate a crash detection
            </p>
          </div>

          <button
            type="button"
            onClick={handleTriggerEmergency}
            className="rounded-lg bg-red-600 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-red-700 active:bg-red-800"
          >
            Trigger Emergency
          </button>
        </div>
      ) : (
        <div className="flex w-full flex-col items-center gap-6">
          <div className="animate-pulse rounded-full bg-red-500/20 p-8">
            <svg
              className="h-24 w-24 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-500">
              EMERGENCY DETECTED
            </h2>
            <p className="mt-3 text-lg text-white">Calling 000 in</p>
            <div className="mt-4 text-7xl font-bold tabular-nums text-red-500">
              {countdown}
            </div>
            <p className="mt-4 text-sm text-zinc-400">
              Dismiss if you are okay
            </p>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            className="mt-4 w-full rounded-lg bg-zinc-800 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-zinc-700 active:bg-zinc-600"
          >
            I'm Okay - Dismiss
          </button>

          <div className="mt-2 rounded-lg bg-zinc-900 p-4">
            <p className="text-xs text-zinc-500">
              This is a test. No actual emergency call will be made.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
