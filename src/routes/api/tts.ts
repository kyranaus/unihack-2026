import { createFileRoute } from "@tanstack/react-router"
import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly"
import { FetchHttpHandler } from "@smithy/fetch-http-handler"

const polly = new PollyClient({
  region: process.env.AWS_REGION ?? "ap-southeast-2",
  // FetchHttpHandler uses the Web Fetch API instead of node:http,
  // which is required for Cloudflare Workers compatibility.
  requestHandler: new FetchHttpHandler(),
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

async function handle({ request }: { request: Request }) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 })
  }

  const body = (await request.json()) as { text?: string }
  const text = body.text?.trim()

  if (!text || text.length > 3000) {
    return new Response("Invalid or too-long text", { status: 400 })
  }

  const command = new SynthesizeSpeechCommand({
    Text: text,
    OutputFormat: "mp3",
    VoiceId: "Joanna",
    Engine: "neural",
  })

  const result = await polly.send(command)

  if (!result.AudioStream) {
    return new Response("Polly returned no audio", { status: 502 })
  }

  const audioBytes = await result.AudioStream.transformToByteArray()

  return new Response(audioBytes, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Content-Length": String(audioBytes.length),
    },
  })
}

export const Route = createFileRoute("/api/tts")({
  server: {
    handlers: {
      POST: handle,
    },
  },
})
