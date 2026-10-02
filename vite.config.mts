import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
import { defineConfig, Plugin } from 'vite'
dotenv.config()

// One id per build. The app compares its own id with /version.json to find
// out that a new version is deployed (src/util/version.ts).
const BUILD_ID = process.env.GITHUB_SHA || `local-${Date.now()}`

function versionFile(): Plugin {
  return {
    name: 'version-file',
    apply: 'build',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'version.json',
        source: JSON.stringify({ buildId: BUILD_ID }),
      })
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), versionFile()],
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    port: Number(process.env.VITE_PORT) || 3000,
  },
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
    BUILD_ID: JSON.stringify(BUILD_ID),
  },
  build: {
    sourcemap: true,
  },
})
