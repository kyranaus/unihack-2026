import { defineNitroConfig } from "nitro/config";
import { resolve } from "path";

export default defineNitroConfig({
    compatibilityDate: "2025-01-01",
    preset: "cloudflare_module",
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
    },
    // @smithy/node-http-handler imports node:http/node:https which are
    // unavailable in Cloudflare Workers. We alias it to a stub since the
    // PollyClient is configured with FetchHttpHandler and never uses it.
    alias: {
      "@smithy/node-http-handler": resolve("./src/stubs/node-http-handler-stub.ts"),
    },
})
