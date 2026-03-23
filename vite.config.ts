import fs from 'node:fs'
import { defineConfig, type Plugin } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { cloudflare } from "@cloudflare/vite-plugin";
import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const BUILD_HASH = process.env.CF_PAGES_COMMIT_SHA ?? Date.now().toString(36)

function versionFile(): Plugin {
  return {
    name: 'version-file',
    buildStart() {
      fs.writeFileSync('public/version.json', JSON.stringify({ hash: BUILD_HASH }))
    },
  }
}

const config = defineConfig({
  define: {
    __BUILD_HASH__: JSON.stringify(BUILD_HASH),
  },
  server: {
    allowedHosts: true,
  },
  plugins: [
    versionFile(),
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    devtools(),
    tsconfigPaths({ projects: ['./tsconfig.json'] }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
