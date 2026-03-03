# routes — Module Summary

## 1. Purpose / Responsibility

SPA routing orchestration: authentication gates, permission-based access control, lazy-loaded view components, and conditional routing logic (debt-collection, migration wizard, first-time login).

## 2. Key Components

| Component         | Purpose                                                                                                         |
| ----------------- | --------------------------------------------------------------------------------------------------------------- |
| `AppRoutes`       | Root: fires `ME_QUERY`; redirects to debt/migration/registration before normal routes; sets Sentry user context |
| `PublicRoutes`    | Unauthenticated routes: Login, ForgotPassword, ResetPassword, ApplicantPortal                                   |
| `PrivateRoutes`   | Full authenticated route tree (20+ top-level + nested routes)                                                   |
| `MainContent`     | Layout wrapper with `<Outlet />` for nested routes                                                              |
| `RestrictedRoute` | Wraps route with permission check; renders `FullPageRestricted` on deny                                         |

## 3. Route Priority Order

1. Debt collection (`/economy/debt-collection`) — negative balance
2. Migration wizard (`/migration-wizard`) — legacy users on first login
3. First-time login (`/registration`) — `firstTimeLogin` flag
4. Normal private routes

## 4. Notable Patterns

- **`React.lazy()`** on every view for code-splitting
- **`Suspense` + `FullContentLoader`** as fallback during lazy load
- **`RestrictedRoute`** uses `PERMISSIONS` constants from `util/permissions.ts`
- **Sentry** `setUser()` called in `AppRoutes` for session tracking
- Routes map 1-to-1 with feature modules in `src/modules/`
