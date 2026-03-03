# store — Module Summary

## 1. Purpose / Responsibility

Centralised global state via Zustand. Minimal by design — holds only auth state and sidebar UI state that must be shared across unrelated parts of the component tree.

## 2. Key Exports

| Export                                      | Purpose                                                                            |
| ------------------------------------------- | ---------------------------------------------------------------------------------- |
| `useStore`                                  | Zustand store hook                                                                 |
| `store.user` / `setUser()`                  | Authenticated `UserNode` (id, names, email, balance, permissions, allergies, etc.) |
| `store.token` / `setToken()`                | JWT string; `setToken` also writes to `localStorage`                               |
| `store.sidebarOpen` / `toggleSidebarOpen()` | Mobile sidebar open/close                                                          |
| `UserPlaceholder`                           | Default empty `UserNode` (all fields null/defaults)                                |
| `LOGIN_TOKEN_KEY`                           | localStorage key constant: `'login-token'`                                         |

## 3. Notable Patterns

- **localStorage sync** — `setToken()` persists to localStorage; `getLoginToken()` / `setLoginToken()` in `util/auth.ts` are the localStorage helpers
- **Selector subscriptions** — `useStore(state => state.user)` avoids full re-render on unrelated state changes
- **Consumed via thin hooks** — `useMe()`, `useSidebar()`, `usePermissions()` in `util/hooks` wrap `useStore` for ergonomics
