// src/routes/api/tts.ts
import { createFileRoute } from "@tanstack/react-router"

const REGION = process.env.AWS_REGION ?? "ap-southeast-2"
const SERVICE = "polly"

async function hmacSHA256(key: ArrayBuffer | Uint8Array<ArrayBuffer>, data: string): Promise<ArrayBuffer> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw", key, { name: "HMAC", hash: "SHA-256" }, false, ["sign"],
  )
  return crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(data) as Uint8Array<ArrayBuffer>)
}

async function sha256(data: string | Uint8Array<ArrayBuffer>): Promise<string> {
  const buf: Uint8Array<ArrayBuffer> = typeof data === "string" ? new TextEncoder().encode(data) as Uint8Array<ArrayBuffer> : data
  const hash = await crypto.subtle.digest("SHA-256", buf)
  return hex(hash)
}

function hex(buf: ArrayBuffer): string {
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("")
}

async function signingKey(secretKey: string, date: string): Promise<ArrayBuffer> {
  let key: ArrayBuffer = await hmacSHA256(new TextEncoder().encode(`AWS4${secretKey}`) as Uint8Array<ArrayBuffer>, date)
  for (const part of [REGION, SERVICE, "aws4_request"]) {
    key = await hmacSHA256(key, part)
  }
  return key
}

async function signRequest(method: string, url: URL, body: string, accessKeyId: string, secretAccessKey: string) {
  const now = new Date()
  const date = now.toISOString().replace(/[-:]/g, "").slice(0, 8)
  const amzDate = `${date}T${now.toISOString().replace(/[-:]/g, "").slice(9, 15)}Z`

  const headers: Record<string, string> = {
    "content-type": "application/json",
    host: url.host,
    "x-amz-date": amzDate,
  }

  const signedHeaderKeys = Object.keys(headers).sort()
  const signedHeaders = signedHeaderKeys.join(";")
  const canonicalHeaders = signedHeaderKeys.map(k => `${k}:${headers[k]}\n`).join("")
  const payloadHash = await sha256(body)

  const canonicalRequest = [
    method, url.pathname, "", canonicalHeaders, signedHeaders, payloadHash,
  ].join("\n")

  const scope = `${date}/${REGION}/${SERVICE}/aws4_request`
  const stringToSign = ["AWS4-HMAC-SHA256", amzDate, scope, await sha256(canonicalRequest)].join("\n")

  const key = await signingKey(secretAccessKey, date)
  const signature = hex(await hmacSHA256(key, stringToSign))

  headers["authorization"] =
    `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`

  return headers
}

async function handle({ request }: { request: Request }) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 })
  }

  const accessKeyId = process.env.AWS_ACCESS_KEY_ID
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
  if (!accessKeyId || !secretAccessKey) {
    return new Response(JSON.stringify({ error: "AWS credentials not configured" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    })
  }

  const reqBody = (await request.json()) as { text?: string }
  const text = reqBody.text?.trim()

  if (!text || text.length > 3000) {
    return new Response("Invalid or too-long text", { status: 400 })
  }

  try {
    const pollyUrl = new URL(`https://${SERVICE}.${REGION}.amazonaws.com/v1/speech`)
    const body = JSON.stringify({
      Text: text,
      OutputFormat: "mp3",
      VoiceId: "Joanna",
      Engine: "neural",
    })

    const headers = await signRequest("POST", pollyUrl, body, accessKeyId, secretAccessKey)
    const res = await fetch(pollyUrl.toString(), { method: "POST", headers, body })

    if (!res.ok) {
      const errText = await res.text()
      console.error("Polly API error:", res.status, errText)
      return new Response(JSON.stringify({ error: "TTS failed" }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      })
    }

    const audioBytes = new Uint8Array(await res.arrayBuffer()) as Uint8Array<ArrayBuffer>

    return new Response(audioBytes, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": String(audioBytes.length),
      },
    })
  } catch (err) {
    console.error("TTS error:", err instanceof Error ? err.message : err)
    return new Response(JSON.stringify({ error: "TTS failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

export const Route = createFileRoute("/api/tts")({
  server: {
    handlers: {
      POST: handle,
    },
  },
})
