# Mantine v6 → v7 Migration Plan

## Current State

### Already done (committed in `d8e79bc` — WIP MANTINE UPGRADE)

- ✅ Package versions bumped (`@mantine/*` to v7.x, added `@mantine/emotion`)
- ✅ CSS bundle imports added to `src/index.tsx` (`@mantine/core/styles.css`, etc.)
- ✅ `createTheme()` wrapper used in `src/theme.ts`
- ✅ `emotionTransform` + `MantineEmotionProvider` set up in `src/containers/Root.tsx`
- ✅ `src/emotion.d.ts` created for TypeScript augmentation of `sx`/`styles` props
- ✅ AppShell migration: `Navbar` → `AppShell.Navbar`, `AppShell.Header`, `AppShell.Main`
- ✅ `createStyles` moved from `@mantine/core` → `@mantine/emotion` in most files (~65 files)
- ✅ `Notifications` moved inside `MantineEmotionProvider`

### In working tree (uncommitted)

- 🔄 `src/modules/economy/components/MyDeposits.tsx` — `color` → `c`, `align` → `ta`
- 🔄 `src/modules/economy/views/MyEconomy.tsx` — removed unused `useMantineTheme` import
- 🔄 `src/modules/economy/views/DebtCollection.tsx` — minor text fix
- 🔄 `src/modules/summaries/views/Summaries.tsx` — `color` → `c`, `fw`, `position` → `justify`, `leftIcon` → `leftSection`, `icon` → `leftSection`

---

## Remaining Changes

### 1. `createStyles` still imported from `@mantine/core`

Change import to `@mantine/emotion`.

| File                                                            |
| --------------------------------------------------------------- |
| `src/components/Select/InternalGroupSelect.tsx`                 |
| `src/modules/barTab/components/BarTabSummary/BarTabSummary.tsx` |

---

### 2. `Group position=` → `Group justify=`

The `position` prop was removed. Mapping:

| v6                  | v7                        |
| ------------------- | ------------------------- |
| `position="apart"`  | `justify="space-between"` |
| `position="right"`  | `justify="flex-end"`      |
| `position="center"` | `justify="center"`        |
| `position="left"`   | `justify="flex-start"`    |

**`position="apart"` occurrences (~45):**

- `src/modules/forum/views/ForumDashboard.tsx`
- `src/modules/quotes/views/PopularQuotes.tsx`
- `src/modules/quotes/views/CreateQuote.tsx`
- `src/modules/quotes/views/ReviewQuotes.tsx` (×2)
- `src/modules/economy/views/Deposits.tsx`
- `src/modules/economy/views/SociSessions.tsx`
- `src/modules/economy/views/PrintWorkingToday.tsx`
- `src/modules/economy/views/SociSessionDetail.tsx`
- `src/modules/economy/views/SociOrderSession.tsx`
- `src/modules/economy/components/MyExpenditures.tsx`
- `src/modules/economy/components/SociStockProduct.tsx`
- `src/modules/economy/components/DepositForm/CreateDepositForm.tsx`
- `src/modules/schedules/views/MyUpcomingShifts.tsx`
- `src/modules/schedules/views/ScheduleTemplates.tsx`
- `src/modules/schedules/views/ScheduleDetails.tsx` (×2)
- `src/modules/schedules/views/AllMyShifts.tsx`
- `src/modules/schedules/views/Schedules.tsx`
- `src/modules/schedules/views/ScheduleTemplateDetails.tsx`
- `src/modules/schedules/components/ScheduleDetails/ShiftDayWeekCard.tsx`
- `src/modules/schedules/components/ScheduleDetails/ShiftCardModal.tsx`
- `src/modules/schedules/components/ScheduleDetails/ShiftSlot.tsx` (×3)
- `src/modules/schedules/components/ScheduleDetails/ShiftCardSlot.tsx` (×2)
- `src/modules/schedules/components/ScheduleDetails/ShiftCard.tsx` (×3)
- `src/modules/schedules/components/ScheduleTemplateDetails/ShiftTemplateAccordionItem.tsx` (×2)
- `src/modules/schedules/components/ScheduleTemplateDetails/ShiftTemplateAccordion.tsx`
- `src/modules/admissions/views/ApplicantsOverview.tsx`
- `src/modules/admissions/views/InternalGroupDiscussion.tsx`
- `src/modules/admissions/views/InternalGroupApplicants.tsx`
- `src/modules/admissions/views/AdmissionDashboard.tsx`
- `src/modules/admissions/views/DiscussionDashboard.tsx`
- `src/modules/admissions/views/InterviewsOverview.tsx`
- `src/modules/admissions/views/MyInterviews.tsx`
- `src/modules/admissions/components/ConfigureAdmission/InterviewLocationAvailabilityCard.tsx`
- `src/modules/admissions/components/AssignInterview/AssignInterviewModal.tsx`
- `src/modules/organization/views/InternalGroupDetail.tsx`
- `src/modules/organization/views/ManageInternalGroup.tsx`
- `src/modules/organization/components/UserManagement/UserManagementAddUser.tsx`
- `src/modules/organization/components/InternalGroupDetail/InternalGroupUserHighlights.tsx`
- `src/modules/users/views/UserTypeDetail.tsx`
- `src/modules/users/components/UserEditForm/UserEditForm.tsx`
- `src/modules/barTab/components/BarTabDashboaard/RegisterProductOrders.tsx`

**`position="right"` occurrences (~20):**

- `src/modules/schedules/components/ScheduleDetails/ApplyScheduleTemplateModal.tsx`
- `src/modules/schedules/components/ScheduleDetails/ScheduleSettingsModal.tsx`
- `src/modules/schedules/components/ScheduleTemplateDetails/AddShiftTemplateModal.tsx`
- `src/modules/schedules/components/ScheduleTemplates/CreateScheduleTemplateModal.tsx`
- `src/modules/economy/components/SociStockProduct.tsx`
- `src/modules/economy/components/SociStockProductControlCard.tsx`
- `src/modules/economy/components/SociSessions/CreateSociSessionModal.tsx`
- `src/modules/economy/components/SociOrderSession/InviteUsersModalButton.tsx`
- `src/modules/barTab/components/BarTabSummary/BarTabSummary.tsx`
- `src/modules/barTab/components/CreateAndSendInvoices/CreateAndSendInvoices.tsx`
- `src/modules/barTab/components/BarTabCustomers/UpdateCustomerModal.tsx`
- `src/modules/admissions/views/InterviewsOverview.tsx`
- `src/modules/admissions/components/EditInterview/LockInterviewModal.tsx`
- `src/modules/admissions/components/EditInterview/ApplicantDidNotShowModal.tsx`
- `src/modules/admissions/components/AssignInterview/AssignInterviewModal.tsx`
- `src/modules/admissions/components/ApplicantPortal/RegisterInformationForm/RegisterInformationForm.tsx`
- `src/modules/users/views/UserTypes.tsx`
- `src/modules/users/views/UserTypeDetail.tsx`
- `src/modules/users/components/UserTypeDetail/AddUserToUserTypeModal.tsx`

**`position="center"` occurrences:**

- `src/modules/quotes/views/ReviewQuotes.tsx`
- `src/modules/admissions/views/InterviewsOverview.tsx`

---

### 3. `leftIcon` / `rightIcon` → `leftSection` / `rightSection` on Button

~35 occurrences across:

- `src/components/SyncButton/SyncButton.tsx`
- `src/modules/forum/views/ForumDashboard.tsx`
- `src/modules/economy/views/Deposits.tsx`
- `src/modules/economy/views/SociSessions.tsx`
- `src/modules/economy/views/SociOrderSession.tsx`
- `src/modules/economy/views/PrintWorkingToday.tsx`
- `src/modules/schedules/views/ScheduleTemplates.tsx`
- `src/modules/schedules/views/ScheduleDetails.tsx`
- `src/modules/schedules/views/ScheduleTemplateDetails.tsx`
- `src/modules/schedules/components/ScheduleDetails/CreateShiftPopover.tsx`
- `src/modules/schedules/components/ScheduleDetails/CreateShiftDrawer.tsx`
- `src/modules/schedules/components/ScheduleTemplateDetails/ShiftTemplateAccordionItem.tsx`
- `src/modules/admissions/views/CloseAdmission.tsx`
- `src/modules/admissions/views/AdmissionDashboard.tsx`
- `src/modules/admissions/views/MyInterviews.tsx`
- `src/modules/admissions/components/AssignInterview/AssignInterviewModal.tsx`
- `src/modules/admissions/components/ApplicantsOverview/UploadAdmissionCSVModal.tsx`
- `src/modules/admissions/components/ApplicantsOverview/AddApplicantsArea.tsx`
- `src/modules/admissions/components/ApplicantsOverview/DeleteApplicantModal.tsx`
- `src/modules/admissions/components/ConfigureAdmission/ConfigureInterviewTemplate.tsx`
- `src/modules/admissions/components/ConfigureAdmission/InterviewOverview.tsx`
- `src/modules/admissions/components/ApplicantPortal/SetPriorities.tsx`
- `src/modules/admissions/components/ApplicantPortal/ReSendApplicantTokenForm.tsx`
- `src/modules/barTab/components/CreateAndSendInvoices/CreateAndSendInvoices.tsx`
- `src/modules/barTab/components/CreateAndSendInvoices/InvoiceTable.tsx`

---

### 4. Text / Badge props

#### 4a. `color=` → `c=`

~35 occurrences across:

- `src/containers/NavBarMeSection.tsx`
- `src/components/WhatsNewNotification/WhatsNewNotification.tsx`
- `src/modules/dashboard/components/TransactionCard.tsx` (×2)
- `src/modules/dashboard/components/FutureShifts.tsx` (×3)
- `src/modules/dashboard/components/RecentQuotes.tsx`
- `src/modules/economy/views/MyEconomy.tsx`
- `src/modules/economy/components/AccountCard.tsx`
- `src/modules/admissions/components/ApplicantDetails/PersonalDetailsCard.tsx`
- `src/modules/organization/components/InternalGroupDetail/InternalGroupUserHighlights.tsx`
- `src/modules/organization/components/UserManagement/UserManagementTable.tsx`
- `src/modules/users/components/UserHistory.tsx`
- `src/modules/users/components/IconWithData.tsx`
- `src/modules/summaries/components/SummaryForm/CustomInputLabel.tsx`
- `src/modules/admissions/components/ApplicantDetails/ApplicantCommentCard.tsx`
- `src/modules/schedules/components/UserShiftCard.tsx`
- `src/modules/admissions/components/ApplicantPortal/components/ApplicationSummary.tsx` (×2)
- `src/modules/schedules/components/ScheduleDetails/ShiftCardSlot.tsx` (×2)
- `src/modules/schedules/components/ScheduleDetails/ShiftCard.tsx`
- `src/modules/quotes/views/ReviewQuotes.tsx` (×3)
- `src/modules/schedules/components/ScheduleDetails/ShiftCardModal.tsx`
- `src/modules/schedules/components/ScheduleDetails/ShiftSlot.tsx` (×2)
- `src/modules/quotes/components/QuoteCard.tsx`

#### 4b. `weight=` → `fw=`

~30 occurrences across:

- `src/modules/economy/components/MyExpenditures.tsx` (×2)
- `src/modules/economy/components/DepositForm/CreateDepositForm.tsx` (×2)
- `src/modules/schedules/components/ScheduleDetails/ShiftDayWeekCard.tsx`
- `src/modules/schedules/components/UserShiftCard.tsx`
- `src/modules/dashboard/components/TransactionCard.tsx` (×2)
- `src/modules/dashboard/components/FutureShifts.tsx`
- `src/modules/dashboard/components/RecentQuotes.tsx`
- `src/modules/schedules/components/ScheduleDetails/ShiftCard.tsx`
- `src/modules/admissions/components/EditInterview/LockInterviewModal.tsx`
- `src/modules/admissions/views/InternalGroupDiscussion.tsx`
- `src/modules/admissions/components/EditInterview/ApplicantPrioritiesField.tsx`
- `src/modules/organization/components/InternalGroupDetail/InternalGroupUserHighlights.tsx`
- `src/modules/admissions/components/EditInterview/ApplicantDidNotShowModal.tsx`
- `src/modules/schedules/components/ScheduleTemplateDetails/ShiftTemplateAccordion.tsx` (×4)
- `src/modules/organization/components/UserManagement/UserManagementTable.tsx` (×2)
- `src/modules/admissions/components/AssignInterview/AssignInterviewModal.tsx`
- `src/modules/summaries/components/SummaryForm/CustomInputLabel.tsx`
- `src/modules/admissions/components/ApplicantDetails/InterviewDetails.tsx` (×3)
- `src/modules/admissions/components/ApplicantDetails/PersonalDetailsCard.tsx`
- `src/modules/users/components/UserHistory.tsx`
- `src/modules/admissions/components/ApplicantPortal/components/ApplicationSummary.tsx` (×2)

#### 4c. `align=` → `ta=`

- `src/modules/login/views/Login.tsx`
- `src/modules/dashboard/components/TransactionCard.tsx` (×2)
- `src/modules/dashboard/components/FutureShifts.tsx`
- `src/modules/schedules/components/UserShiftCard.tsx`

#### 4d. `transform=` → `tt=`

- `src/modules/dashboard/components/FutureShifts.tsx`
- `src/modules/schedules/components/ScheduleDetails/ShiftDayWeekCard.tsx`
- `src/modules/quotes/views/CreateQuote.tsx`
- `src/modules/schedules/components/ScheduleDetails/ShiftCardSlot.tsx`

---

### 5. `spacing=` → `gap=` on Group / Stack / SimpleGrid / Avatar.Group

~50+ occurrences across:

- `src/components/FullPageComponents/FullPageError.tsx`
- `src/components/FullPageComponents/FullPageRestricted.tsx`
- `src/components/FullPageComponents/FullPage404.tsx`
- `src/components/FullPageComponents/FullPageEmpty.tsx`
- `src/components/ShortcutCard/ShortcutCardGrid.tsx`
- `src/modules/quotes/views/CreateQuote.tsx` (×2)
- `src/modules/quotes/views/ReviewQuotes.tsx` (×3 — incl. `Avatar.Group`)
- `src/modules/quotes/components/QuoteCard.tsx` (Avatar.Group)
- `src/modules/economy/views/MyEconomy.tsx`
- `src/modules/economy/views/SocinomicsControl.tsx`
- `src/modules/economy/components/SociStockProduct.tsx` (×2)
- `src/modules/economy/components/DepositForm/CreateDepositForm.tsx` (×3)
- `src/modules/economy/components/SociSessions/PlaceProductOrder.tsx`
- `src/modules/summaries/views/CreateSummary.tsx`
- `src/modules/summaries/views/Summaries.tsx` (Avatar.Group)
- `src/modules/schedules/views/MyUpcomingShifts.tsx`
- `src/modules/schedules/components/UserShiftCard.tsx` (×3)
- `src/modules/schedules/components/ScheduleDetails/ShiftCardSlot.tsx`
- `src/modules/schedules/components/ScheduleDetails/WeekController.tsx`
- `src/modules/schedules/components/ScheduleDetails/ShiftCardModal.tsx` (×2)
- `src/modules/schedules/components/ScheduleDetails/ShiftSlot.tsx` (×7)
- `src/modules/organization/components/InternalGroupDetail/InternalGroupInfo.tsx`
- `src/modules/organization/components/InternalGroupDetail/InternalGroupUserHighlights.tsx` (×2)
- `src/modules/users/components/UserQuotes.tsx`
- `src/modules/users/components/NewbieCards.tsx`
- `src/modules/forum/views/ForumThread.tsx`
- `src/modules/handbook/views/CreateDocument.tsx`
- `src/modules/admissions/views/ApplicantDetails.tsx`
- `src/modules/admissions/components/AssignInterview/AssignInterviewModal.tsx`
- `src/modules/admissions/components/ApplicantDetails/PersonalDetailsCard.tsx` (×8)
- `src/modules/admissions/components/ApplicantPortal/SetPriorities.tsx`
- `src/modules/admissions/components/ApplicantPortal/components/ApplicationSummary.tsx`
- `src/modules/admissions/components/ApplicantDetails/ApplicantCommentCard.tsx`

---

### 6. `noWrap` → `wrap="nowrap"` on Group

- `src/modules/economy/components/SociStockProduct.tsx` (×3)
- `src/modules/schedules/components/UserShiftCard.tsx`
- `src/modules/schedules/components/ScheduleDetails/ShiftSlot.tsx`

---

### 7. `useMantineTheme` — evaluate and replace where needed

In v7 `theme.colorScheme` is gone. Remaining usages that may reference it or use theme values
that should be CSS variables:

| File                                                  | Notes                                 |
| ----------------------------------------------------- | ------------------------------------- |
| `src/containers/MainLayout.tsx`                       | Check if `theme.colorScheme` is used  |
| `src/modules/economy/components/SociStockProduct.tsx` | Uses theme for colors                 |
| `src/modules/summaries/views/SummaryDetail.tsx`       | Check usage                           |
| `src/modules/handbook/components/DocumentStack.tsx`   | Check usage                           |
| `src/modules/quotes/components/QuoteCard.tsx`         | Check usage                           |
| `src/modules/users/components/UserHistory.tsx`        | Uses `theme.colors.brand` in `color=` |
| `src/modules/schedules/components/UserShiftCard.tsx`  | Check usage                           |
| `src/modules/dashboard/Dashboard.tsx`                 | Check usage                           |

If usage is just `theme.colors.X` in a `style=` prop, replace with CSS variable (`var(--mantine-color-X-Y)`).
If usage was `theme.colorScheme`, replace with `light-dark()` CSS function or `useMantineColorScheme`.

---

### 8. `TransferList` — removed in v7

Already handled: `src/modules/users/components/AllergyTransferList.tsx` has the old component commented out with a TODO.
**Action:** Implement replacement using `Combobox` or a custom dual-list pattern per [Mantine TransferList guide](https://mantine.dev/combobox/?e=TransferList).

---

### 9. `getGradient` — API changed

In v7 `getGradient` takes a theme argument. Verify current usage compiles correctly:

- `src/modules/economy/components/AccountCard.tsx` — `getGradient({...}, theme)` in `createStyles`
- `src/modules/economy/views/MyEconomy.tsx` — `getGradient({ from: 'cyan.8', to: 'cyan.4' }, theme)`

---

## Suggested Order of Attack

Work file-by-file top-to-bottom, committing by module. Changes within each file are mechanical:

1. **Quick wins (2 files):** Fix remaining `createStyles` imports from `@mantine/core`
2. **Commit unstaged working tree** (MyDeposits, MyEconomy, DebtCollection, Summaries)
3. **Text props sweep** — `color`→`c`, `weight`→`fw`, `align`→`ta`, `transform`→`tt` (affects ~25 files, all mechanical)
4. **Group position sweep** — `position="apart/right/center"` → `justify=` (affects ~40 files)
5. **spacing → gap sweep** — Group, Stack, SimpleGrid, Avatar.Group (affects ~35 files)
6. **noWrap → wrap="nowrap"** (6 occurrences, 3 files)
7. **leftIcon/rightIcon → leftSection/rightSection** (~25 files)
8. **useMantineTheme audit** — check and clean up each usage (8 files)
9. **AllergyTransferList** — implement Combobox-based replacement
10. **getGradient** — verify compiled output; adjust if TS errors

---

## Notes

- This project uses `@mantine/emotion` as its styling strategy (not CSS modules). All `createStyles` stays but must come from `@mantine/emotion`.
- `sx` and `styles` props continue to work via the `emotion.d.ts` augmentation.
- `React.VFC` is deprecated in React 18 (unrelated to Mantine) — 30 files use it. Can be addressed separately.
