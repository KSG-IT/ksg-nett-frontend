# components — Module Summary

## 1. Purpose / Responsibility

Shared, reusable UI building blocks used across all feature modules. Each component lives in its own folder with an `index.ts` barrel export.

## 2. Key Exports

| Component                                           | Purpose                                                            |
| --------------------------------------------------- | ------------------------------------------------------------------ |
| `PermissionGate`                                    | Conditionally renders children based on user permission checks     |
| `RichTextEditor`                                    | Tiptap wrapper (StarterKit + Link) for HTML content creation       |
| `MessageBox`                                        | Alert component with variants: info / warning / danger / success   |
| `FullPageComponents`                                | Full-screen states: 404, empty, error, permission-restricted       |
| `Loading.FullContentLoader`                         | Centered spinner for page-level loading                            |
| `Breadcrumbs`                                       | Mantine + React Router breadcrumb trail                            |
| `CardTable`                                         | Paper-wrapped table with optional compact mode + horizontal scroll |
| `InfoPopover`                                       | Hover-triggered info icon tooltip                                  |
| `ShortcutCard / ShortcutCardGrid`                   | Icon-text navigation cards in responsive grid                      |
| `SyncButton`                                        | Refresh button with loading state                                  |
| `WhatsNewNotification`                              | Changelog modal gated by localStorage date key                     |
| `UserSelect / UserMultiSelect`                      | Async user dropdown from GraphQL                                   |
| `InternalGroupSelect / InternalGroupPositionSelect` | Organisation group dropdowns                                       |
| `DaySelect`                                         | Weekday selector (Norwegian labels)                                |

## 3. Notable Patterns

- All components use **Mantine UI** primitives + `createStyles` / Emotion
- **`PermissionGate`** is the single source of truth for permission-based UI gating
- **Select components** fire Apollo queries internally — callers get pure controlled inputs
- **Barrel exports** (`index.ts`) in every subfolder for clean import paths
