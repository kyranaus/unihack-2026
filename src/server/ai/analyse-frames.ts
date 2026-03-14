import OpenAI from "openai"

const SYSTEM_PROMPT = `You are a dashcam safety AI analysing camera frames from a vehicle.
The camera may face the driver OR the road. Describe what you see in ONE specific sentence.

For driver-facing frames, be specific about what the driver is doing:
- Looking at phone, eating, drinking, talking to passenger, eyes closed, yawning, head drooping, hands off wheel, reaching for something, etc.

For road-facing frames, describe road events:
- Vehicle braking ahead, pedestrian crossing, traffic light, lane change, tailgating, construction zone, etc.

Classify severity:
- "info" = alert driver, clear road, normal conditions
- "warning" = phone use, mild distraction, vehicle braking ahead, pedestrian near road
- "critical" = eyes closed >2s, head drooping, collision risk, obstacle in road

If nothing notable: "Driver alert, normal conditions"

Respond in JSON only: { "summary": "...", "severity": "info" | "warning" | "critical" }`

let client: OpenAI | null = null

function getClient() {
  if (!client) {
    client = new OpenAI({
      baseURL: process.env.VLLM_API!,
      apiKey: process.env.VLLM_API_KEY!,
    })
  }
  return client
}

export async function analyseFrames(
  base64Frames: string[]
): Promise<{ summary: string; severity: "info" | "warning" | "critical" }> {
  const imageContent: OpenAI.Chat.ChatCompletionContentPart[] = base64Frames.map(
    (frame) => ({
      type: "image_url" as const,
      image_url: { url: `data:image/jpeg;base64,${frame}` },
    })
  )

  const response = await getClient().chat.completions.create({
    model: "Qwen/Qwen2.5-VL-7B-Instruct-AWQ",
    max_tokens: 150,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: [
          ...imageContent,
          { type: "text", text: "Analyse these sequential dashcam frames." },
        ],
      },
    ],
  })

  const text = response.choices[0]?.message?.content ?? ""

  try {
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()
    const parsed = JSON.parse(cleaned)
    return {
      summary: parsed.summary ?? "Unable to analyse frames",
      severity: ["info", "warning", "critical"].includes(parsed.severity)
        ? parsed.severity
        : "info",
    }
  } catch {
    return { summary: text.slice(0, 200), severity: "info" }
  }
}

export async function summariseDrive(
  events: { elapsedSec: number; summary: string; severity: string; type: string }[],
  score?: number | null
): Promise<string> {
  const eventList = events
    .map((e) => `[${Math.floor(e.elapsedSec / 60)}:${String(e.elapsedSec % 60).padStart(2, "0")}] (${e.type}/${e.severity}) ${e.summary}`)
    .join("\n")

  const scoreContext = score != null
    ? `The session score is ${score}/100. `
    : ""

  const response = await getClient().chat.completions.create({
    model: "Qwen/Qwen2.5-VL-7B-Instruct-AWQ",
    max_tokens: 500,
    messages: [
      {
        role: "system",
        content: `You summarise a driving session from event logs. Output 4-6 bullet points, one per line. Each line must start with "+" (positive/good) or "-" (negative/bad), followed by a space, then a short statement of 3-8 words. The ratio of negatives to positives must match the score: score <50 = 4-5 negatives 1 positive, score 50-70 = 3 negatives 2 positives, score 70-85 = 2 negatives 3 positives, score >85 = 1 negative 4+ positives. Be brutally honest — do not soften negatives with words like "intermittently" or "somewhat". Examples: "+ No drowsiness detected", "- Looked away from road often", "- Hard braking multiple times", "+ Maintained consistent speed". Output only the bullet lines, nothing else.`,
      },
      {
        role: "user",
        content: `${scoreContext}Here are the events from this drive:\n\n${eventList}\n\nSummarise this drive.`,
      },
    ],
  })

  return response.choices[0]?.message?.content ?? "Unable to generate summary."
}
