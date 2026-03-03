# users — Module Summary

## 1. Purpose / Responsibility

User profile management, personal settings, permission group (UserType) administration, and authentication lifecycle flows (migration wizard and first-time login).

## 2. Key Pages / Views

| Route                   | Component         | Purpose                                                     |
| ----------------------- | ----------------- | ----------------------------------------------------------- |
| `/users/me`             | `MySettings`      | Own settings: notifications, allergies, about-me            |
| `/users/:userId`        | `UserProfile`     | Public profile: edit modal, quote tags, membership timeline |
| `/users/newbies`        | `Newbies`         | Gallery of recent members                                   |
| `/users/user-types`     | `UserTypes`       | Admin table of permission groups                            |
| `/users/user-types/:id` | `UserTypeDetail`  | Members list + audit changelog (30 s poll)                  |
| `/migration-wizard`     | `MigrationWizard` | First-login data collection for legacy users                |
| `/registration`         | `FirstTimeLogin`  | Required "about me" submission on first login               |

## 3. GraphQL Operations

**Queries**: `ME_QUERY`, `USER_QUERY`, `ALL_ACTIVE_USERS_LIST_QUERY`, `ALL_USER_TYPES_QUERY`, `USER_TYPE_DETAIL_QUERY`, `MY_SETTINGS_QUERY`, `NEWBIES_QUERY`

**Mutations**: `PATCH_USER`, `UPDATE_MY_INFO`, `ADD/REMOVE_USER_TO_USER_TYPE`, `UPDATE_ABOUT_ME`, `UPDATE_MY_ALLERGIES`, `UPDATE_MY_EMAIL_NOTIFICATIONS`

## 4. Key Components / Hooks

| Item                                    | Purpose                                                      |
| --------------------------------------- | ------------------------------------------------------------ |
| `UserDetails`                           | Profile card (email, phone, address, study, DOB, about-me)   |
| `UserEditForm`                          | Modal profile editor — `useUserEditLogic` + `useUserEditAPI` |
| `MyEmailSettings`                       | Notification preference toggles                              |
| `UserHistory`                           | Timeline of group positions and memberships                  |
| `UserThumbnail`                         | Reusable avatar linking to profile with tooltip              |
| `UserTypeDetail/AddUserToUserTypeModal` | Add user to permission group via `UserSelect`                |
| `useUserMutations()`                    | Batched mutation hooks                                       |

## 5. State Management

- **Apollo** — queries with `refetchQueries` after mutations; 30 s poll on `UserTypeDetail`
- **react-hook-form + Yup** — profile and wizard forms with image size validation (max 1 MB)
- **Local** — modal open/close, dirty flags for allergies

## 6. Notable Patterns

- **Two-hook pattern**: `useUserEditLogic` (form + validation) + `useUserEditAPI` (mutations + navigation)
- **About-me one-time edit** — confirmation dialog; `canRewriteAboutMe` flag bypasses gate
- **Audit changelog** on UserType assignments (ADD/REMOVE with actor + timestamp)
- **Migration wizard** reads `legacyWorkHistory` to prompt cleanup on first login
- **`UserThumbnail`** is the most reused cross-module component in the codebase
