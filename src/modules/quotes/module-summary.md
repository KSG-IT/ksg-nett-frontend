# quotes — Module Summary

## 1. Purpose / Responsibility

Community quote submission, voting, and moderation system. Users can submit quotes (pending approval), upvote approved quotes, and admins can review/approve/invalidate submissions. Includes semester-aware popularity rankings.

## 2. Key Pages / Views

| Route             | Component       | Purpose                                                 |
| ----------------- | --------------- | ------------------------------------------------------- |
| `/quotes`         | `QuotesList`    | Approved quotes with full-text search + infinite scroll |
| `/quotes/create`  | `CreateQuote`   | Submit new quote with text, context, tagged users       |
| `/quotes/review`  | `ReviewQuotes`  | Admin moderation of pending submissions                 |
| `/quotes/popular` | `PopularQuotes` | Top-10 by semester and all-time                         |

## 3. GraphQL Operations

**Queries**

- `APPROVED_QUOTES_QUERY` — relay cursor pagination with search (`q`)
- `PENDING_QUOTES_QUERY` — all unapproved quotes
- `POPULAR_QUOTES_QUERY` — top quotes + current semester shorthand

**Mutations**

- `CREATE_QUOTE` — submit for approval
- `APPROVE_QUOTE_MUTATION` — admin approves
- `INVALIDATE_QUOTE_MUTATION` — admin rejects approved quote
- `DELETE_QUOTE` — hard delete
- `PATCH_QUOTE` — edit text/context/tags
- `CREATE_QUOTE_VOTE` / `DELETE_USER_QUOTE_VOTE` — upvote / remove vote

## 4. Key Components

| Component             | Purpose                                                                      |
| --------------------- | ---------------------------------------------------------------------------- |
| `QuoteCard`           | Single quote with text, context, tags, vote count, upvote button, admin menu |
| `QuoteGrid`           | Responsive 2-col grid; cursor pagination + "Load More"                       |
| `QuotesTabs`          | Tab nav (Popular / All / Create) with pending-count badge                    |
| `PendingQuotesButton` | Nav button with dynamic pending count                                        |

## 5. State Management

- **Apollo** — `useQuery` + `useMutation` + `refetchQueries` after mutations
- **Zustand** — `me.upvotedQuoteIds[]` tracks user's upvotes globally
- **Local** — `upvoted` / `voteSum` in `QuoteCard` for optimistic UI; debounced search (200 ms) in list view
- **Polling** — 30 s on `QuoteGrid` and `PopularQuotes`

## 6. Notable Patterns

- **Optimistic vote updates** — local state updates immediately, then refetch confirms
- **Relay cursor pagination** with manual `fetchMore` merge
- **`PermissionGate`** on approve, invalidate, and delete actions
- **`modals.openConfirmModal()`** before quote submission
- **Semester splitting** — popular view divides current semester vs. all-time
