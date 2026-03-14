import { os } from "@orpc/server"
import * as z from "zod"
import { prisma } from "#/server/db"
import { analyseFrames, summariseDrive } from "#/server/ai/analyse-frames"

const cameraEnum = z.enum(["front", "back"])

export const startSession = os.input(z.object({})).handler(async () => {
  console.log("[BeeSafe] Starting new drive session...")
  const session = await prisma.driveSession.create({ data: {} })
  console.log("[BeeSafe] Session created:", session.id)
  return { sessionId: session.id }
})

export const analyseRoadFrames = os
  .input(
    z.object({
      sessionId: z.string(),
      elapsedSec: z.number().int(),
      frames: z.array(z.string()).min(1).max(5),
      camera: cameraEnum,
    })
  )
  .handler(async ({ input }) => {
    try {
      const result = await analyseFrames(input.frames)
      if (result.severity !== "info") {
        console.log(`[BeeSafe] AI (${input.camera} ${input.elapsedSec}s):`, result.severity, "-", result.summary)
      }

      const event = await prisma.driveEvent.create({
        data: {
          sessionId: input.sessionId,
          type: "road_analysis",
          camera: input.camera,
          elapsedSec: input.elapsedSec,
          summary: result.summary,
          severity: result.severity,
          metadata: { frameCount: input.frames.length },
        },
      })

      return { id: event.id, summary: result.summary, severity: result.severity }
    } catch (err) {
      console.error("[BeeSafe] analyseRoadFrames ERROR:", err)
      throw err
    }
  })

export const logDriverEvent = os
  .input(
    z.object({
      sessionId: z.string(),
      elapsedSec: z.number().int(),
      type: z.enum(["driver_state", "crash", "harsh_braking"]),
      summary: z.string(),
      severity: z.enum(["info", "warning", "critical"]),
      camera: cameraEnum,
      metadata: z.record(z.string(), z.unknown()).optional(),
    })
  )
  .handler(async ({ input }) => {
    try {
      if (input.severity !== "info") {
        console.log(`[BeeSafe] ${input.type} (${input.camera}): ${input.summary}`)
      }
      const event = await prisma.driveEvent.create({
        data: {
          sessionId: input.sessionId,
          type: input.type,
          camera: input.camera,
          elapsedSec: input.elapsedSec,
          summary: input.summary,
          severity: input.severity,
          metadata: input.metadata ?? {},
        },
      })

      return { id: event.id }
    } catch (err) {
      console.error("[BeeSafe] logDriverEvent ERROR:", err)
      throw err
    }
  })

function computeScore(
  events: { type: string; severity: string; metadata: unknown }[]
): number {
  let score = 100

  for (const e of events) {
    if (e.type === "driver_state") {
      const meta = e.metadata as Record<string, unknown>
      const state = meta?.state as string | undefined
      if (state === "DROWSY") score -= 5
      else if (state === "DISTRACTED") score -= 5
      else if (state === "ASLEEP") score -= 15
    } else if (e.type === "road_analysis") {
      if (e.severity === "warning") score -= 2
      else if (e.severity === "critical") score -= 8
    } else if (e.type === "crash") {
      score -= 20
    }
  }

  return Math.max(0, Math.min(100, score))
}

export const endSession = os
  .input(z.object({ sessionId: z.string() }))
  .handler(async ({ input }) => {
    const events = await prisma.driveEvent.findMany({
      where: { sessionId: input.sessionId },
      orderBy: { elapsedSec: "asc" },
    })

    let summary: string | null = null
    if (events.length > 0) {
      summary = await summariseDrive(
        events.map((e) => ({
          elapsedSec: e.elapsedSec,
          summary: e.summary,
          severity: e.severity,
          type: e.type,
        }))
      )
    }

    const score = computeScore(events)
    const cameras = [...new Set(events.map((e) => e.camera))]

    console.log(`[BeeSafe] Session ended: ${events.length} events, score=${score}, cameras=${cameras.join(",")}`)
    if (summary) console.log(`[BeeSafe] AI Summary: ${summary.slice(0, 100)}...`)

    await prisma.driveSession.update({
      where: { id: input.sessionId },
      data: { endedAt: new Date(), summary, score, cameras },
    })

    return { summary, score, cameras }
  })

export const getSession = os
  .input(z.object({ sessionId: z.string() }))
  .handler(async ({ input }) => {
    const session = await prisma.driveSession.findUniqueOrThrow({
      where: { id: input.sessionId },
      include: { events: { orderBy: { elapsedSec: "asc" } } },
    })

    return session
  })
