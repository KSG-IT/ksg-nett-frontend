# util — Module Summary

## 1. Purpose / Responsibility

Collection of utility functions and custom hooks for auth, permissions, date formatting, parsing, responsive design, and GraphQL integration helpers. Used across all feature modules.

## 2. Key Exports

### Auth (`auth.ts`)

`getLoginToken()`, `setLoginToken()`, `removeLoginToken()`, `hasSavedLoginToken()` — localStorage JWT management

### Permissions (`permissions.ts`)

`PERMISSIONS` — exhaustive tree of all backend permission strings (admissions, economy, handbook, quotes, users, organization, schedules, forum, feature flags, bar_tab)

### Parsing (`parsing.ts`)

`numberWithSpaces()`, `capitalizeFirstLetter()`, `booleanToRadio()` / `radioToBoolean()`

### Date (`date-fns/*.ts`)

`format()`, `formatDistance()`, `formatDistanceToNow()` — date-fns wrappers with Norwegian (`nb`) locale

### Mobile (`isMobile.ts`)

`useMobile()` (768 px), `useViewport()`, `useRenderMobile()` (450 px)

### Custom Hooks (`hooks/`)

| Hook                        | Purpose                                                                                   |
| --------------------------- | ----------------------------------------------------------------------------------------- |
| `useDebounce(value, delay)` | Debounce input (default 500 ms)                                                           |
| `useMe()`                   | Current user from Zustand store                                                           |
| `usePermissions()`          | `hasPermissions()`, `hasPermissionsOrMe()`, `hasPermissionsAndMe()`, `useProfileAccess()` |
| `useQueryParameter(key)`    | Parse URL query string                                                                    |
| `useSidebar()`              | Sidebar open state + toggle                                                               |
| `useCurrencyFormatter()`    | Norwegian NOK `Intl.NumberFormat`                                                         |
| `useIsMobile()`             | Mantine media query at 768 px                                                             |

### Constants (`consts.ts`)

`DEFAULT_PAGINATION_SIZE = 50`, `FILE_SIZE`, `Z_INDEX`

### Environment (`env.ts`)

`BASE_URL`, `MEDIA_URL`, `API_URL` from Vite env vars

## 3. Tech Stack (from `package.json`)

React 18, TypeScript 4, Vite 3, Apollo Client 3.7, Zustand 4, React Hook Form 7 + Yup 0.32, Mantine 7.11, Tiptap 2, date-fns 2.21, React Router 6, Stripe React/JS, Recharts 2, Sentry 7
