# header — Module Summary

## 1. Purpose / Responsibility

Provides the global header user-search component. Enables quick navigation to any user profile through a searchable dropdown with debounced GraphQL queries and visual user thumbnails.

## 2. Key Pages / Views

No dedicated pages. The `UserSearch` component is embedded in the main application layout header and navigates to `/users/{userId}` on selection.

## 3. GraphQL Operations

**Queries**

- `SEARCHBAR_USERS_QUERY` (`searchbarUsers(searchString)`) — lazy query returning `id`, `cleanFullName`, `profileImage`, `initials` for matching users (max 10)

## 4. Key Components

| Component           | Purpose                                                                                     |
| ------------------- | ------------------------------------------------------------------------------------------- |
| `UserSearch`        | React Select dropdown with debounced search; custom `Option` renderer shows `UserThumbnail` |
| `DropdownIndicator` | Custom search icon indicator for the Select                                                 |

## 5. State Management

- **Local** — `userQuery` (input text), `selected` (chosen option) via `useState`
- **Apollo** — `useLazyQuery` fires only on debounced input change (not on mount)
- **`useDebounce`** hook (500 ms) throttles GraphQL calls while typing

## 6. Notable Patterns

- **`useLazyQuery`** instead of `useQuery` — avoids firing on mount
- **Debounced input** minimises API calls during fast typing
- **`useNavigate`** for programmatic routing on user selection
- **z-index 9000** ensures dropdown renders above all page content
- **Responsive width** — 300 px default, 100 % on `xs` breakpoint
