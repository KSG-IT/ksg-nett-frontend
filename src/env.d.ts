/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_API_URL: string
  readonly VITE_NODE_ENV: 'local' | 'development' | 'staging' | 'production'
  readonly VITE_PORT: string
  readonly VITE_PHONE: string
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare const APP_VERSION: string
