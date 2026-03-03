# dashboard — Module Summary

## 1. Purpose / Responsibility

Serves as the main home/landing page for authenticated users, displaying a personalised overview of upcoming shifts, recent quotes, transaction history, outstanding balances (wanted list), and quick-action shortcuts.

## 2. Key Pages / Views

| Route        | Component   | Description                                  |
| ------------ | ----------- | -------------------------------------------- |
| `/dashboard` | `Dashboard` | Primary landing page; grid layout of widgets |

## 3. GraphQL Operations

**Queries**

- `DASHBOARD_DATA_QUERY` — single query fetching:
  - `dashboardData.wantedList` — users with outstanding balances
  - `dashboardData.lastQuotes` — most recent quotes
  - `dashboardData.myUpcomingShifts` — authenticated user's upcoming shifts (role, location, times)
  - `dashboardData.sociOrderSession` — active order session ID (if any)
  - `dashboardData.showNewbies` — feature flag
  - `dashboardData.showStockMarketShortcut` — feature flag

## 4. Key Components

| Component         | Purpose                                                                                            |
| ----------------- | -------------------------------------------------------------------------------------------------- |
| `Dashboard`       | Root layout; orchestrates grid/stack; polls at 10 s intervals                                      |
| `ShortcutCards`   | Dynamic nav card grid; static + feature-flag-gated shortcuts (Newbies, Stock Market, Soci Session) |
| `FutureShifts`    | Scrollable list of upcoming shifts linking to `/schedules/me`                                      |
| `RecentQuotes`    | 2-column responsive grid of recent quotes (uses `QuoteCard` from quotes module)                    |
| `TransactionCard` | Tabular last-transactions list (name, quantity, amount, timestamp)                                 |
| `WantedList`      | Users with outstanding balances using `UserThumbnail` components                                   |

## 5. State Management

- **Apollo** — `useQuery(DASHBOARD_DATA_QUERY, { pollInterval: 10_000 })` for automatic refresh
- **Zustand** — reads `user` and `lastTransactions` from global store
- **React Router** — `useNavigate` + `Link` for routing

## 6. Notable Patterns

- **10 s polling** keeps dashboard data fresh without manual refresh
- **Feature flags** from backend control shortcut visibility at runtime
- **Permission gate** on summary-creation shortcut via `PERMISSIONS.summaries.add.summary`
- **`useMemo`** on shortcut list to avoid recalculation on every render
- **Responsive Mantine Grid** with breakpoints (`xl: 5, lg: 6, sm: 6`); max width 1600 px
- **`useMediaQuery`** hook adjusts layout for screens > 1500 px
