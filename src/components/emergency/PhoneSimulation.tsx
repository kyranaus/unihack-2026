import { useState, useEffect } from "react"

interface PhoneSimulationProps {
  onEndCall: () => void
}

export function PhoneSimulation({ onEndCall }: PhoneSimulationProps) {
  const [callDuration, setCallDuration] = useState(0)
  const [isRinging, setIsRinging] = useState(true)

  useEffect(() => {
    const ringTimeout = setTimeout(() => {
      setIsRinging(false)
    }, 3000)

    return () => clearTimeout(ringTimeout)
  }, [])

  useEffect(() => {
    if (!isRinging) {
      const interval = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [isRinging])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-between py-8">
      <div className="flex flex-col items-center gap-8">
        <div className="text-center">
          <p className="text-sm font-medium text-zinc-400">
            {isRinging ? "Calling..." : "Connected"}
          </p>
          <h1 className="mt-2 text-3xl font-bold">000</h1>
          <p className="mt-1 text-sm text-zinc-500">Emergency Services</p>
        </div>

        <div className={`rounded-full bg-red-500/20 p-12 ${isRinging ? "animate-pulse" : ""}`}>
          <svg
            className="h-32 w-32 text-red-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
          </svg>
        </div>

        {!isRinging && (
          <div className="text-center">
            <p className="text-2xl font-mono tabular-nums text-white">
              {formatDuration(callDuration)}
            </p>
            <p className="mt-2 text-xs text-zinc-500">Call in progress</p>
          </div>
        )}

        {isRinging && (
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-1">
              <div className="h-2 w-2 animate-bounce rounded-full bg-red-500 [animation-delay:0ms]" />
              <div className="h-2 w-2 animate-bounce rounded-full bg-red-500 [animation-delay:150ms]" />
              <div className="h-2 w-2 animate-bounce rounded-full bg-red-500 [animation-delay:300ms]" />
            </div>
            <p className="text-sm text-zinc-400">Connecting to emergency services</p>
          </div>
        )}
      </div>

      <div className="flex w-full flex-col gap-4">
        <button
          type="button"
          onClick={onEndCall}
          className="mt-4 flex items-center justify-center gap-2 rounded-full bg-red-600 py-4 text-lg font-semibold text-white transition-colors hover:bg-red-700 active:bg-red-800"
        >
          <svg
            className="h-6 w-6"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z" />
          </svg>
          End Call
        </button>

        <div className="mt-2 rounded-lg bg-zinc-900 p-3 text-center">
          <p className="text-xs text-zinc-500">
            This is a simulation. No actual call is being made.
          </p>
        </div>
      </div>
    </div>
  )
}
