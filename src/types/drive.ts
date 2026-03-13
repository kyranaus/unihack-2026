// src/types/drive.ts
export type DriveEvents = {
  eyesClosed:         { count: number; totalSecs: number; longestSecs: number }
  eyesOffRoad:        { count: number; totalSecs: number }
  phoneUse:           { count: number; totalSecs: number }
  yawning:            { count: number }
  tailgating:         { count: number; totalSecs: number }
  speeding:           { count: number; peakKmhOver: number; totalSecs: number }
  harshBraking:       { count: number; maxG: number }
  harshAcceleration:  { count: number; maxG: number }
  harshTakeoff:       { count: number; maxG: number }
  smoothBraking:      { count: number }
  smoothAcceleration: { count: number }
  smoothTakeoff:      { count: number }
}

export type DriveReport = {
  durationMinutes: number
  focusStreakMinutes: number
  events: DriveEvents
}
