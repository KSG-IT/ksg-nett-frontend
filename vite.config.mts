import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
import { defineConfig } from 'vite'
dotenv.config()

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    port: Number(process.env.VITE_PORT) || 3000,
  },
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
  },
  build: {
    sourcemap: true,
  },
})
