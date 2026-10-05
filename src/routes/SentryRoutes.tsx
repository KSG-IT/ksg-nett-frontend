import * as Sentry from '@sentry/react'
import { Routes } from 'react-router-dom'

// Use instead of <Routes> so Sentry names transactions by route pattern, not by URL.
export const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes)
