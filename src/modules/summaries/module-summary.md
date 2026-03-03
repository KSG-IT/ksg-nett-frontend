# summaries — Module Summary

## 1. Purpose / Responsibility

Meeting minutes (referater) management for KSG internal groups. Full CRUD with rich HTML editing, participant tracking, reporter attribution, full-text search, and group-based organisation.

## 2. Key Pages / Views

| Route                   | Component       | Purpose                              |
| ----------------------- | --------------- | ------------------------------------ |
| `/summaries`            | `Summaries`     | List with search + cursor pagination |
| `/summaries/create`     | `CreateSummary` | New summary form (permission-gated)  |
| `/summaries/:summaryId` | `SummaryDetail` | View / edit with toggle              |

## 3. GraphQL Operations

**Queries**

- `ALL_SUMMARIES` — relay cursor pagination; `q` full-text search; 30 s poll
- `SUMMARY_QUERY` — single summary with full content + participants; 30 s poll

**Mutations**

- `CREATE_SUMMARY_MUTATION` — `{ contents, participants[], reporter, internalGroup?, title?, date }`
- `PATCH_SUMMARY` — same fields; refetches both list and detail queries

## 4. Key Components / Hooks

| Item                    | Purpose                                                                  |
| ----------------------- | ------------------------------------------------------------------------ |
| `Summary`               | Read-only display: type badge, reporter, participants, HTML content      |
| `SummaryForm`           | Create/edit form (group select, participants, reporter, date, rich text) |
| `useSummaryLogic`       | Yup validation + Tiptap editor setup via react-hook-form                 |
| `useSummaryFormAPI`     | Mutation orchestration, navigation, notifications                        |
| `getSummaryTypeLabel()` | Maps `SummaryType` enum → Norwegian label                                |

**12 summary types**: DRIFT, BARSJEF, DAGLIGHALLEN, STYRET, SPRITBARSJEF, HOVMESTER, KAFEANSVARLIG, SOUSCHEF, ARRANGEMENT, OKONOMI, KIT, ANNET

## 5. State Management

- **Apollo** — `cache-and-network` on list; `refetchQueries` after mutations
- **react-hook-form + Yup** — `onSubmit` validation; title required only when group = "ANNET"
- **Local** — search debounce; edit-mode toggle; `useMe()` for default reporter
- **`UserThumbnail` / `UserMultiSelect`** for participant display/selection

## 6. Notable Patterns

- **Two-hook composition**: `useSummaryLogic` (form + editor) + `useSummaryFormAPI` (API + nav) keep `SummaryForm` thin
- **Tiptap** (StarterKit + Link); content rendered via `dangerouslySetInnerHTML`
- **Shallow vs. full types** — list uses abbreviated `SummaryNode` (no `contents`); detail fetches full
- **`PermissionGate`** on create button and edit icon
- Cursor pagination with manual `fetchMore` merge ("Hent fler" button)
