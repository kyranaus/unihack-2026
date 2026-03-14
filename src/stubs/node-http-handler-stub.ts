// Stub for @smithy/node-http-handler in Cloudflare Workers.
// node-http-handler uses node:http/node:https which are unavailable in Workers.
// The PollyClient is configured with FetchHttpHandler so NodeHttpHandler is never called.

export class NodeHttpHandler {
  static create() { return new NodeHttpHandler() }
  async handle(): Promise<never> { throw new Error("NodeHttpHandler is not available in Cloudflare Workers") }
  destroy(): void {}
  updateHttpClientConfig(): void {}
  httpHandlerConfigs(): Record<string, unknown> { return {} }
}

// streamCollector is imported by @smithy/util-stream — provide a fetch-based fallback
export async function streamCollector(stream: ReadableStream | Blob): Promise<Uint8Array> {
  if (stream instanceof Blob) {
    return new Uint8Array(await stream.arrayBuffer())
  }
  const reader = (stream as ReadableStream).getReader()
  const chunks: Uint8Array[] = []
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    if (value) chunks.push(value)
  }
  const total = chunks.reduce((n, c) => n + c.length, 0)
  const result = new Uint8Array(total)
  let offset = 0
  for (const chunk of chunks) {
    result.set(chunk, offset)
    offset += chunk.length
  }
  return result
}

export const DEFAULT_REQUEST_TIMEOUT = 0
