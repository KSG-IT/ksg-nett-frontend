import { sentryVitePlugin } from '@sentry/vite-plugin'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
import builtins from 'rollup-plugin-node-builtins'
import globals from 'rollup-plugin-node-globals'
import nodePolyfills from 'rollup-plugin-polyfill-node'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
dotenv.config()

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), ,],
  esbuild: {
    // https://github.com/vitejs/vite/issues/8644#issuecomment-1159308803
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
  },
  server: {
    port: Number(process.env.VITE_PORT) || 3000,
  },
  define: {
    'process.env': {},
  },
  build: {
    rollupOptions: {
      plugins: [nodePolyfills(), builtins(), globals()],
    },
  },
})
