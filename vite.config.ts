import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import tsconfigPaths from 'vite-tsconfig-paths'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

// Cloudflare Workers doesn't support node:http/node:https — stub them so
// @smithy/node-http-handler loads without crashing. The PollyClient is
// configured to use FetchHttpHandler so these stubs are never called.
const workerNodeStub = {
  name: 'stub-node-http-for-workers',
  resolveId(id: string) {
    if (id === 'node:http' || id === 'node:https') return '\0cf-stub'
  },
  load(id: string) {
    if (id === '\0cf-stub') {
      return `
        export const request = () => {};
        export const get = () => {};
        export const Agent = class {};
        export const globalAgent = {};
        export default {};
      `
    }
  },
}

const config = defineConfig({
  plugins: [
    devtools(),
    nitro({ rollupConfig: { external: [/^@sentry\//], plugins: [workerNodeStub] } }),
    tsconfigPaths({ projects: ['./tsconfig.json'] }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
