# barTab — Module Summary

## 1. Purpose / Responsibility

Bar Service Fee (BSF) management: order registration during bar sessions, per-customer debt tracking, invoice generation, PDF creation, and email delivery to inter-group customers.

## 2. Key Pages / Views

| Route                | Component         | Purpose                                  |
| -------------------- | ----------------- | ---------------------------------------- |
| `/bar-tab`           | `BarTabDashboard` | Active tab workflow (status-driven)      |
| `/bar-tab/customers` | `BarTabCustomers` | Browse/manage registered customer groups |
| `/bar-tab/previous`  | `PreviousBarTabs` | Cursor-paginated history of closed tabs  |

Protected by `PERMISSIONS.barTab.view.barTab` / `barTabCustomer`.

## 3. GraphQL Operations

**Queries**: `ACTIVE_BAR_TAB_QUERY`, `SHALLOW_ALL_CUSTOMERS_QUERY`, `SHALLOW_ALL_PRODUCTS_QUERY`, `BAR_TAB_SUMMARY_DATA_QUERY`, `ACTIVE_BAR_TAB_INVOICES_QUERY`, `PREVIOUS_BAR_TABS_QUERY`

**Mutations**: `CREATE_BAR_TAB`, `CREATE_BAR_TAB_ORDER`, `DELETE_BAR_TAB_ORDER`, `LOCK_BAR_TAB`, `GENERATE_PDF`, `CREATE_INVOICES`, `DELETE_ACTIVE_BAR_TAB_PDFS`, `SEND_BAR_TAB_INVOICE_EMAIL`, `FINALIZE_BAR_TAB`

## 4. Key Components

| Component                                      | Purpose                                                          |
| ---------------------------------------------- | ---------------------------------------------------------------- |
| `ActiveBarTabController`                       | State-machine router: shows different UI per tab status          |
| `RegisterProductOrders`                        | Order entry form (customer, name, product, quantity, away, type) |
| `BarTabSummaryTable`                           | Per-customer breakdown (they owe / we owe / net)                 |
| `CreateAndSendInvoices`                        | PDF generation + email dispatch per customer                     |
| `InvoiceTable`                                 | Invoice list with PDF download + email send buttons              |
| `BarTabProductSelect` / `BarTabCustomerSelect` | Reusable typed Select dropdowns                                  |

## 5. State Management

- **Apollo** — all data via `useQuery`; mutations use `refetchQueries` (no manual cache writes)
- **Local** — form fields in `RegisterProductOrders`; `useMemo` for unique name autocomplete list
- **`@mantine/notifications`** — success/error toasts on mutation callbacks

## 6. Notable Patterns

- **Status machine**: OPEN → LOCKED → UNDER_REVIEW → REVIEWED; `ActiveBarTabController` gates UI by status
- **"BSF er ferdig" disabled** until all invoices emailed (checked via `useMemo`)
- **Shallow vs. deep queries** — dropdowns use lightweight queries; summary uses pre-aggregated backend data
- **BONG orders** auto-clear the name field on submit (anonymous round)
- **Cursor pagination** on `PreviousBarTabs` via `fetchMore` + `updateQuery`
- `UpdateCustomerModal` exists but is not yet wired to a mutation (WIP)
