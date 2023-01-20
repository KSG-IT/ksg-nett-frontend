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
  plugins: [
    react(),
    tsconfigPaths(),
    sentryVitePlugin({
      org: 'ksg-it',
      project: 'ksg-nett-frontend',

      // Specify the directory containing build artifacts
      include: './dist',

      // Auth tokens can be obtained from https://sentry.io/settings/account/api/auth-tokens/
      // and needs the `project:releases` and `org:read` scopes
      authToken:
        '23e586cab9934603851ce6b8f98ff65f19199197a35b47bbbb9046044602535b',

      // Optionally uncomment the line below to override automatic release name detection
      // release: process.env.RELEASE,
    }),
  ],
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
    sourcemap: true,
    rollupOptions: {
      plugins: [nodePolyfills(), builtins(), globals()],
    },
  },
})
