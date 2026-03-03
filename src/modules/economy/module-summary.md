# economy — Module Summary

## 1. Purpose / Responsibility

Full financial management for KSG Societeten: bank accounts, deposits (Stripe/bank/Vipps), product ordering sessions, live food/drink ordering, a gamified stock market (Socinomics), and debt-collection soft-wall.

## 2. Key Pages / Views

| Route                         | Component           | Purpose                                            |
| ----------------------------- | ------------------- | -------------------------------------------------- |
| `/economy`                    | `EconomyDashboard`  | Hub with shortcuts to all sub-features             |
| `/economy/me`                 | `MyEconomy`         | Personal balance, transactions, deposits           |
| `/economy/deposits/create`    | `CreateDeposit`     | Multi-step deposit wizard (Stripe / bank transfer) |
| `/economy/deposits`           | `Deposits`          | Admin: list + approve/reject deposits              |
| `/economy/soci-sessions`      | `SosiSessions`      | List + create product order sessions               |
| `/economy/soci-sessions/:id`  | `SociSessionDetail` | Session orders + add order form                    |
| `/economy/soci-sessions/live` | `SociOrderSession`  | Live food/drink ordering (Burgerliste/Stilletime)  |
| `/economy/socinomics`         | `Socinomics`        | Animated stock market ticker + price charts        |
| `/economy/socinomics-control` | `SocinomicsControl` | Admin: adjust prices, crash market                 |
| `/economy/debt-collection`    | `DebtCollection`    | Restricted view for users with negative balance    |

## 3. GraphQL Operations

**Queries**: `myBankAccount`, `allDeposits`, `allSociSessions`, `sociSession`, `allSociProducts`, `activeSociOrderSession`, `mySessionProductOrders`, `stockMarketProducts`, `lastMarketCrash`, `stockPriceHistory`, `myExpenditures`, `ongoingDepositIntent`

**Mutations**: `createDeposit`, `approveDeposit`, `invalidateDeposit`, `createSociSession`, `closeSociSession`, `placeProductOrder`, `undoProductOrder`, `createSociOrderSession`, `sociOrderSessionNextStatus`, `placeSociOrderSessionOrder`, `incrementProductGhostOrder`, `crashStockMarket`, `patchSociBankAccount`

## 4. Key Components

| Component                 | Purpose                                                   |
| ------------------------- | --------------------------------------------------------- |
| `AccountCard`             | Balance + card UUID with inline edit                      |
| `CreateDepositForm`       | Multi-step wizard (Stripe embedded / bank instructions)   |
| `DepositsTable`           | Admin paginated table with approve/reject actions         |
| `PlaceProductOrder`       | Add order to session form                                 |
| `SociOrderSession` folder | Live ordering: food/drink forms, orders tables, invite UI |
| `SociStockProduct`        | Animated stock ticker card per product                    |
| `SocinomicsControl`       | Admin price + crash control cards                         |

## 5. State Management

- **Apollo** — primary via `useQuery` + `useMutation`; custom mutation hooks (`useDepositMutations`, `useSociSessionMutations`, etc.)
- **Polling** — 10–30 s on sessions, deposits, stock market for near-realtime UX
- **Local** — form fields, modal state, Mantine Stepper step
- **Zustand** — `useMe()` for current user context
- `fetchPolicy: 'network-only'` on live session views

## 6. Notable Patterns

- **Session status machine**: CREATED → FOOD_ORDERING → DRINK_ORDERING → CLOSED via `sociOrderSessionNextStatus`
- **Stripe resume flow** — `ongoingDepositIntent` detects incomplete payment; wizard allows resume/cancel
- **Relay cursor pagination** on deposits + sessions with manual `fetchMore`
- **Stock market gamification** — animated CSS ticker; 10-min crash countdown banner
- **Debt-collection soft-wall** — negative-balance users redirected to `/economy/debt-collection`
- **`PermissionGate`** on approve/reject, create session, overcharge actions
