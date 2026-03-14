// src/routes/_authed/emergency.tsx
import { createFileRoute } from "@tanstack/react-router"
import { useState, useEffect, useRef } from "react"
import { usePollyTTS } from "#/lib/use-polly-tts"

export const Route = createFileRoute("/_authed/emergency")({ component: Emergency })

type CrashLocation = {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  heading: number | null;
  speedKmh: number | null;
}

function formatLocation(location: CrashLocation | null): string {
  if (!location || location.latitude === null || location.longitude === null) {
    return "location unavailable";
  }
  
  // Format coordinates for emergency services
  const lat = location.latitude.toFixed(6);
  const lng = location.longitude.toFixed(6);
  const latDir = location.latitude >= 0 ? "N" : "S";
  const lngDir = location.longitude >= 0 ? "E" : "W";
  
  let locationStr = `coordinates ${Math.abs(location.latitude).toFixed(6)} degrees ${latDir}, ${Math.abs(location.longitude).toFixed(6)} degrees ${lngDir}`;
  
  if (location.accuracy !== null && location.accuracy < 100) {
    locationStr += `, accurate to ${Math.round(location.accuracy)} meters`;
  }
  
  return locationStr;
}

function useTypewriter(text: string, enabled: boolean, speed = 80) {
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
  const { user } = Route.useRouteContext()
  const [showNotification, setShowNotification] = useState(false)
  const [countdown, setCountdown] = useState(10)
  const [isCalling, setIsCalling] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [crashLocation, setCrashLocation] = useState<CrashLocation | null>(null)
  const [address, setAddress] = useState<string | null>(null)
  const [addressLoading, setAddressLoading] = useState(false)

  const { speak, stop: stopTTS, status: ttsStatus } = usePollyTTS()

  const userName = user.name || "John Smith"
  const locationStr = address || formatLocation(crashLocation)
  const emergencyMessage = `Hi, my name is ${userName}. I have been in an accident on the road at ${locationStr} and require emergency assistance.`
  const typedText = useTypewriter(emergencyMessage, isCalling, 80)

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

  // Auto-start when launched from crash detection flow.
  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const fromCrash = window.sessionStorage.getItem("dashcam.crashTriggered")
      const locationData = window.sessionStorage.getItem("dashcam.crashLocation")
      
      if (locationData) {
        try {
          const parsedLocation = JSON.parse(locationData) as CrashLocation
          setCrashLocation(parsedLocation)
          window.sessionStorage.removeItem("dashcam.crashLocation")
        } catch {
          // invalid JSON, ignore
        }
      }
      
      if (fromCrash === "1") {
        window.sessionStorage.removeItem("dashcam.crashTriggered")
        setShowNotification(true)
        setCountdown(10)
        setIsCalling(false)
      }
    } catch {
      // ignore storage errors
    }
  }, [])
  
  // Capture current location if not already set (for manual trigger or fallback)
  useEffect(() => {
    if (crashLocation !== null) return
    if (typeof window === "undefined" || !("geolocation" in navigator)) return
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCrashLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          heading: position.coords.heading,
          speedKmh: position.coords.speed ? position.coords.speed * 3.6 : null,
        })
      },
      (error) => {
        console.warn("Failed to get location:", error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  }, [crashLocation])
  
  // Reverse geocode coordinates to address using LocationIQ
  useEffect(() => {
    if (!crashLocation || crashLocation.latitude === null || crashLocation.longitude === null) return
    if (address !== null || addressLoading) return
    
    setAddressLoading(true)
    
    const lat = crashLocation.latitude
    const lng = crashLocation.longitude
    const apiKey = "pk.4e2f3069f3ec234e4efc2e6a1fe35caa"
    
    fetch(`https://us1.locationiq.com/v1/reverse?key=${apiKey}&lat=${lat}&lon=${lng}&format=json`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(data => {
        // Build a natural address for emergency services
        const parts: string[] = []
        
        // Street address (most specific)
        if (data.road) {
          if (data.house_number) {
            parts.push(`${data.house_number} ${data.road}`)
          } else {
            parts.push(data.road)
          }
        }
        
        // Suburb/locality
        if (data.suburb) parts.push(data.suburb)
        else if (data.quarter) parts.push(data.quarter)
        else if (data.neighbourhood) parts.push(data.neighbourhood)
        
        // City
        if (data.city) parts.push(data.city)
        else if (data.town) parts.push(data.town)
        else if (data.village) parts.push(data.village)
        
        // State
        if (data.state) parts.push(data.state)
        
        // Postcode
        if (data.postcode) parts.push(data.postcode)
        
        if (parts.length > 0) {
          setAddress(parts.join(", "))
        } else {
          // Fallback to display_name if available
          setAddress(data.display_name || formatLocation(crashLocation))
        }
        
        setAddressLoading(false)
      })
      .catch(err => {
        console.warn("Reverse geocoding failed:", err)
        setAddress(formatLocation(crashLocation))
        setAddressLoading(false)
      })
  }, [crashLocation, address, addressLoading])

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
              
              {crashLocation && crashLocation.latitude !== null && crashLocation.longitude !== null && (
                <div className="mt-4 pt-4 border-t border-zinc-800">
                  <p className="text-xs font-semibold text-zinc-500 mb-2">Location Details</p>
                  
                  {addressLoading && (
                    <div className="flex items-center gap-2 text-xs text-zinc-400 mb-2">
                      <span className="inline-block h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                      Looking up address...
                    </div>
                  )}
                  
                  {address && !addressLoading && (
                    <div className="text-sm text-zinc-300 mb-3">
                      {address}
                    </div>
                  )}
                  
                  <div className="font-mono text-xs text-zinc-500 space-y-1">
                    <div>Lat: {crashLocation.latitude.toFixed(6)}</div>
                    <div>Lng: {crashLocation.longitude.toFixed(6)}</div>
                    {crashLocation.accuracy !== null && (
                      <div>Accuracy: ±{Math.round(crashLocation.accuracy)}m</div>
                    )}
                  </div>
                  <a
                    href={`https://www.google.com/maps?q=${crashLocation.latitude},${crashLocation.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-xs text-blue-400 hover:text-blue-300 underline"
                  >
                    View on Google Maps
                  </a>
                </div>
              )}
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
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-4 px-4 pointer-events-none">
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
