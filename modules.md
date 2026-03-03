# KSG-Nett Frontend — Module Index

React + TypeScript SPA. Tech stack: React 18, Apollo Client, Zustand, Mantine 7, Tiptap, React Router 6, Vite.

## Feature Modules (`src/modules/`)

| Module                                                     | Summary                                                                                                                                                                     |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [admissions](src/modules/admissions/module-summary.md)     | Full recruitment pipeline UI: public applicant portal (token-based), interview scheduling/evaluation grid, group discussion/allocation dashboards, and configuration wizard |
| [barTab](src/modules/barTab/module-summary.md)             | Bar Service Fee (BSF) order registration, per-customer debt tracking, invoice generation, PDF creation, and email delivery                                                  |
| [chat](src/modules/chat/module-summary.md)                 | Placeholder module — chat is served as a Django-rendered page via Channels WebSocket, not a React component                                                                 |
| [dashboard](src/modules/dashboard/module-summary.md)       | Personalised home page with upcoming shifts, recent quotes, transactions, outstanding balances, and feature-flag-gated shortcuts; 10 s auto-refresh                         |
| [economy](src/modules/economy/module-summary.md)           | Bank accounts, deposits (Stripe/bank/Vipps), product order sessions, live food/drink ordering, and a gamified stock market (Socinomics)                                     |
| [featureFlags](src/modules/featureFlags/module-summary.md) | Admin interface for toggling runtime feature flags via GraphQL mutations                                                                                                    |
| [forum](src/modules/forum/module-summary.md)               | Discussion board scaffold (thread list + detail UI) — early development, no live data integration yet                                                                       |
| [handbook](src/modules/handbook/module-summary.md)         | Document management with CRUD, Tiptap rich text editing, audit metadata, and role-based access control                                                                      |
| [header](src/modules/header/module-summary.md)             | Global header user-search component with debounced GraphQL queries and profile navigation                                                                                   |
| [login](src/modules/login/module-summary.md)               | JWT authentication: login, password reset, SSO token handling; dual localStorage + Zustand token persistence                                                                |
| [organization](src/modules/organization/module-summary.md) | Internal groups, interest groups, user memberships (multi-status types), and featured member highlights                                                                     |
| [quotes](src/modules/quotes/module-summary.md)             | Community quote submission, approval, and voting with full-text search, semester rankings, and admin moderation                                                             |
| [schedules](src/modules/schedules/module-summary.md)       | Shift planning across venues: template-driven scheduling, role-based slot assignment, multi-location display modes, and personal shift tracking                             |
| [summaries](src/modules/summaries/module-summary.md)       | Meeting minutes CRUD with rich HTML editor, multi-user search, and group-based organisation                                                                                 |
| [users](src/modules/users/module-summary.md)               | User profiles, personal settings, permission groups (UserTypes), and auth lifecycle (migration wizard, first-time login)                                                    |

## Shared Infrastructure (`src/`)

| Area                                           | Summary                                                                                                                |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| [components](src/components/module-summary.md) | Reusable UI building blocks: PermissionGate, RichTextEditor, CardTable, Breadcrumbs, domain-specific Select components |
| [routes](src/routes/module-summary.md)         | SPA route orchestration with lazy loading, permission gating, and conditional auth flow prioritisation                 |
| [store](src/store/module-summary.md)           | Zustand global state: authenticated user, JWT token (localStorage-synced), sidebar toggle                              |
| [util](src/util/module-summary.md)             | Auth helpers, PERMISSIONS tree, date-fns (Norwegian locale), mobile hooks, `usePermissions`, `useMe`, `useDebounce`    |
