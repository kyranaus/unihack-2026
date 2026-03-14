import { os } from "@orpc/server"
import * as z from "zod"
import { Prisma } from "#/generated/prisma/client.js"
import { prisma } from "#/server/db"
import { analyseFrames, summariseDrive } from "#/server/ai/analyse-frames"
import { auth } from "#/server/auth"
import { getRequestHeaders } from "@tanstack/react-start/server"
import {
  getUploadUrl,
  getDownloadUrl,
  videoKey,
  initiateMultipartUpload,
  getPartUploadUrl,
  completeMultipartUpload,
  abortMultipartUpload,
  getObjectBuffer,
} from "#/server/s3"
import { storeHashOnChain, getHashFromChain, sha256Hex, BASE_SEPOLIA_EXPLORER } from "#/server/blockchain"

const cameraEnum = z.enum(["front", "back"])

async function getCurrentUserId(): Promise<string | null> {
  try {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })
    return session?.user?.id ?? null
  } catch {
    return null
  }
}

export const startSession = os.input(z.object({})).handler(async () => {
  const userId = await getCurrentUserId()
  console.log("[BeeSafe] Starting new drive session...")
  const session = await prisma.driveSession.create({
    data: { userId },
  })
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
          metadata: (input.metadata ?? {}) as Prisma.InputJsonObject,
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
      if (state === "DROWSY") score -= 8
      else if (state === "DISTRACTED") score -= 6
      else if (state === "ASLEEP") score -= 25
    } else if (e.type === "road_analysis") {
      if (e.severity === "warning") score -= 3
      else if (e.severity === "critical") score -= 12
    } else if (e.type === "crash") {
      score -= 80
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

    // Only assign a driver score when driver monitoring was active (at least one
    // driver_state event logged). Road-only sessions have no face detection and
    // should not receive a score.
    const hasDriverEvents = events.some((e) => e.type === "driver_state")
    const score = hasDriverEvents ? computeScore(events) : null

    let summary: string | null = null
    if (events.length > 0) {
      summary = await summariseDrive(
        events.map((e) => ({
          elapsedSec: e.elapsedSec,
          summary: e.summary,
          severity: e.severity,
          type: e.type,
        })),
        score ?? 0
      )
    }
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

export const getProfileStats = os.input(z.object({})).handler(async () => {
  const userId = await getCurrentUserId()
  if (!userId) {
    return {
      totalDrives: 0,
      avgScore: 0,
      totalHours: 0,
      recentDrives: [],
      scoreTrend: 0,
    }
  }

  const sessions = await prisma.driveSession.findMany({
    where: { userId, endedAt: { not: null } },
    orderBy: { startedAt: "desc" },
    include: { events: true },
  })

  const totalDrives = sessions.length
  const avgScore = sessions.length > 0
    ? Math.round(sessions.reduce((sum, s) => sum + (s.score ?? 0), 0) / sessions.length)
    : 0

  const totalHours = sessions.reduce((sum, s) => {
    if (!s.endedAt) return sum
    const durationMs = s.endedAt.getTime() - s.startedAt.getTime()
    return sum + durationMs / (1000 * 60 * 60)
  }, 0)

  const recentDrives = sessions.slice(0, 5).map((s) => ({
    id: s.id,
    startedAt: s.startedAt,
    endedAt: s.endedAt,
    score: s.score ?? 0,
    duration: s.endedAt
      ? Math.round((s.endedAt.getTime() - s.startedAt.getTime()) / 1000)
      : 0,
  }))

  const previousAvgScore = sessions.length > 5
    ? Math.round(sessions.slice(5, 10).reduce((sum, s) => sum + (s.score ?? 0), 0) / Math.min(5, sessions.length - 5))
    : avgScore
  const scoreTrend = avgScore - previousAvgScore

  return {
    totalDrives,
    avgScore,
    totalHours: Math.round(totalHours * 10) / 10,
    recentDrives,
    scoreTrend,
  }
})

export const getLeaderboard = os.input(z.object({})).handler(async () => {
  const sessions = await prisma.driveSession.findMany({
    where: { endedAt: { not: null }, score: { not: null } },
    select: {
      userId: true,
      startedAt: true,
      endedAt: true,
      score: true,
      user: { select: { name: true } },
    },
  })

  // Only sessions longer than 30 seconds
  const validSessions = sessions.filter((s) => {
    if (!s.endedAt) return false
    return s.endedAt.getTime() - s.startedAt.getTime() >= 30_000
  })

  const userMap = new Map<string, { name: string; scores: number[] }>()
  for (const s of validSessions) {
    const key = s.userId ?? "anonymous"
    if (!userMap.has(key)) {
      userMap.set(key, { name: s.user?.name ?? "Anonymous", scores: [] })
    }
    userMap.get(key)!.scores.push(s.score!)
  }

  const entries = Array.from(userMap.entries())
    .map(([userId, { name, scores }]) => ({
      userId,
      name,
      avgScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      totalDrives: scores.length,
    }))
    .sort((a, b) => b.avgScore - a.avgScore)

  return { entries }
})

export const getVideoUploadUrl = os
  .input(
    z.object({
      sessionId: z.string(),
      camera: cameraEnum,
      contentType: z.string(),
    }),
  )
  .handler(async ({ input }) => {
    const { url, key } = await getUploadUrl(
      input.sessionId,
      input.camera,
      input.contentType,
    )
    await prisma.driveSession.update({
      where: { id: input.sessionId },
      data: { videoKey: key },
    })
    return { uploadUrl: url, key }
  })

export const getVideoDownloadUrl = os
  .input(z.object({ key: z.string() }))
  .handler(async ({ input }) => {
    const url = await getDownloadUrl(input.key)
    return { url }
  })

export const listDriveSessions = os.input(z.object({})).handler(async () => {
  const userId = await getCurrentUserId()
  if (!userId) return { sessions: [] }

  const sessions = await prisma.driveSession.findMany({
    where: { userId, endedAt: { not: null } },
    orderBy: { startedAt: "desc" },
    select: {
      id: true,
      startedAt: true,
      endedAt: true,
      score: true,
      summary: true,
      cameras: true,
      videoKey: true,
      txHash: true,
    },
    take: 20,
  })

  return { sessions }
})

export const initVideoUpload = os
  .input(
    z.object({
      sessionId: z.string(),
      camera: cameraEnum,
      contentType: z.string(),
    }),
  )
  .handler(async ({ input }) => {
    try {
      const key = videoKey(input.sessionId, input.camera)
      const uploadId = await initiateMultipartUpload(key, input.contentType)
      await prisma.driveSession.update({
        where: { id: input.sessionId },
        data: { videoKey: key },
      })
      return { uploadId, key }
    } catch (err) {
      console.error("[BeeSafe] initVideoUpload ERROR:", err)
      throw err
    }
  })

export const getPartUrl = os
  .input(
    z.object({
      key: z.string(),
      uploadId: z.string(),
      partNumber: z.number().int().min(1),
    }),
  )
  .handler(async ({ input }) => {
    try {
      const url = await getPartUploadUrl(input.key, input.uploadId, input.partNumber)
      return { url }
    } catch (err) {
      console.error("[BeeSafe] getPartUrl ERROR:", err)
      throw err
    }
  })

export const completeVideoUpload = os
  .input(
    z.object({
      key: z.string(),
      uploadId: z.string(),
      parts: z.array(
        z.object({
          ETag: z.string(),
          PartNumber: z.number().int(),
        }),
      ),
    }),
  )
  .handler(async ({ input }) => {
    try {
      await completeMultipartUpload(input.key, input.uploadId, input.parts)
      return { success: true }
    } catch (err) {
      console.error("[BeeSafe] completeVideoUpload ERROR:", err)
      throw err
    }
  })

export const abortVideoUpload = os
  .input(z.object({ key: z.string(), uploadId: z.string() }))
  .handler(async ({ input }) => {
    await abortMultipartUpload(input.key, input.uploadId)
    return { success: true }
  })

export const storeVideoHash = os
  .input(z.object({ sessionId: z.string() }))
  .handler(async ({ input }) => {
    try {
      const session = await prisma.driveSession.findUniqueOrThrow({ where: { id: input.sessionId } })
      if (!session.videoKey) throw new Error("No video uploaded for this session")

      console.log(`[BeeSafe] Downloading S3 object to hash: ${session.videoKey}`)
      const buf = await getObjectBuffer(session.videoKey)
      const videoHash = sha256Hex(buf)
      console.log(`[BeeSafe] SHA-256: ${videoHash.slice(0, 16)}... (${buf.length} bytes)`)

      console.log(`[BeeSafe] Storing hash on Base Sepolia...`)
      const txHash = await storeHashOnChain(videoHash)
      console.log(`[BeeSafe] Blockchain tx: ${txHash}`)

      await prisma.driveSession.update({
        where: { id: input.sessionId },
        data: { videoHash, txHash },
      })
      return { txHash, explorerUrl: `${BASE_SEPOLIA_EXPLORER}/${txHash}` }
    } catch (err) {
      console.error(`[BeeSafe] Blockchain ERROR:`, err)
      throw err
    }
  })

export const verifyVideoHash = os
  .input(z.object({ sessionId: z.string() }))
  .handler(async ({ input }) => {
    const session = await prisma.driveSession.findUniqueOrThrow({
      where: { id: input.sessionId },
    })
    if (!session.txHash || !session.videoKey) {
      return { verified: false, reason: "no_blockchain_record" as const }
    }
    const buf = await getObjectBuffer(session.videoKey)
    const currentHash = sha256Hex(buf)
    const chainHash = await getHashFromChain(session.txHash)
    const verified = chainHash === currentHash
    console.log(`[BeeSafe] Verify: chain=${chainHash.slice(0, 16)} current=${currentHash.slice(0, 16)} match=${verified}`)
    return { verified, txHash: session.txHash, explorerUrl: `${BASE_SEPOLIA_EXPLORER}/${session.txHash}` }
  })
