# featureFlags — Module Summary

## 1. Purpose / Responsibility

Admin interface for viewing and toggling runtime feature flags. Allows authorised users to enable/disable features across the application via GraphQL mutations with real-time UI synchronisation.

## 2. Key Pages / Views

| Route            | Component      | Description                                    |
| ---------------- | -------------- | ---------------------------------------------- |
| `/feature-flags` | `FeatureFlags` | Table of all flags with inline toggle switches |

Protected by `PERMISSIONS.featureFlags.view.featureFlag`.

## 3. GraphQL Operations

**Queries**

- `AllFeatureFlags` — fetches `id`, `name`, `enabled`, `description` for all flags

**Mutations**

- `ToggleFeatureFlag(id)` — flips enabled state; triggers refetch of `AllFeatureFlags`

## 4. Key Components

| Component      | Purpose                                                                                |
| -------------- | -------------------------------------------------------------------------------------- |
| `FeatureFlags` | Main view: Mantine `Table` with Name / Description / Enabled columns; `Switch` per row |

## 5. State Management

- **Apollo** — `useQuery` for fetching; `useFeatureFlagMutations()` custom hook wraps the toggle mutation
- No local state — entirely GraphQL-driven; mutation triggers automatic refetch

## 6. Notable Patterns

- **`useFeatureFlagMutations()` hook** extracts mutation logic for reusability
- **Lazy-loaded** at the route level for bundle splitting
- **Full-page loading/error** states via shared `FullContentLoader` / `FullPageError` components
- **Permission-gated** via `RestrictedRoute` wrapper
