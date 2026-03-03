# login — Module Summary

## 1. Purpose / Responsibility

Handles authentication (login, password reset, password change). Manages JWT token storage, user state initialisation, and post-login navigation.

## 2. Key Pages / Views

| Route              | Component                 | Purpose                                                        |
| ------------------ | ------------------------- | -------------------------------------------------------------- |
| `/login`           | `Login`                   | Username + password form; supports token-from-query-string SSO |
| `/forgot-password` | `ForgotPassword`          | Sends password reset email                                     |
| `/reset-password`  | `ChangePasswordWithToken` | Confirms reset with token from email URL                       |

## 3. GraphQL Operations

**Queries**

- `IS_LOGGED_IN_QUERY` — validates current session

**Mutations**

- `LOGIN_MUTATION` — returns JWT token + full user profile
- `RESET_MY_PASSWORD_MUTATION` — initiates reset email
- `RESET_PASSWORD_BY_TOKEN_MUTATION` — validates token + new password; returns new login JWT

## 4. Key Components / Hooks

| Item                           | Purpose                                                                                      |
| ------------------------------ | -------------------------------------------------------------------------------------------- |
| `Login`                        | react-hook-form + Yup; handles query-string token extraction; resets Apollo store on success |
| `ForgotPassword`               | Single-field form; shows confirmation after submission                                       |
| `ChangePasswordWithToken`      | Dual-password fields with matching validation; auto-redirects on success                     |
| `useJwtTokenFromQueryString()` | Extracts + decodes Base64 JWT from URL; calculates expiry                                    |
| `useLoginMutations()`          | Wraps all three mutations with loading states                                                |

## 5. State Management

- **localStorage** — `setLoginToken()` / `getLoginToken()` under key `'login-token'`
- **Zustand** — `setUser()` + `setToken()` store profile and token globally
- **Apollo** — `client.resetStore()` on login forces re-fetch with new auth headers

### Auth flow

1. Credentials submitted → `LOGIN_MUTATION`
2. Token + profile → localStorage + Zustand
3. Apollo store reset → `window.location.reload()` reinitialises app

## 6. Notable Patterns

- **SSO via query string** — token in URL extracted, stored, redirects to `/dashboard`
- **Dual token storage** — localStorage (persistence) + Zustand (runtime)
- **Full page reload** after login/reset ensures clean auth context across all queries
- **Password reset never stores requests in DB** — uses time-limited JWT sent by email
