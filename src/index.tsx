import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'
import 'fontsource-roboto'
import React from 'react'
import { createRoot } from 'react-dom/client'
import Root from './containers/Root'
import './index.css'
import reportWebVitals from './reportWebVitals'
import '@mantine/core/styles.css'
import '@mantine/tiptap/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/notifications/styles.css'

Sentry.init({
  dsn: 'https://30278c22042e4403a9fbbe081d5fe999@o487192.ingest.sentry.io/6110504',
  integrations: [new BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
  environment: import.meta.env.VITE_APP_NODE_ENV,
  enabled:
    import.meta.env.VITE_APP_NODE_ENV === 'production' ||
    import.meta.env.VITE_APP_NODE_ENV === 'development',
})

const container = document.getElementById('root')
const root = createRoot(container!) // createRoot(container!) if you use TypeScript

root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
