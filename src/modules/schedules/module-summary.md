# schedules — Module Summary

## 1. Purpose / Responsibility

Shift planning and roster management: shift creation, template-driven recurring schedules, slot-to-user assignments by role, multi-location display modes, and personal shift tracking.

## 2. Key Pages / Views

| Route                      | Component                 | Purpose                                                 |
| -------------------------- | ------------------------- | ------------------------------------------------------- |
| `/schedules/me`            | `MyUpcomingShifts`        | User's upcoming shifts + iCal export link               |
| `/schedules/me/history`    | `AllMyShifts`             | Full personal shift history                             |
| `/schedules`               | `Schedules`               | All schedule index                                      |
| `/schedules/:id`           | `ScheduleDetails`         | Master editor: week nav, shift creation, template apply |
| `/schedules/templates`     | `ScheduleTemplates`       | Template index                                          |
| `/schedules/templates/:id` | `ScheduleTemplateDetails` | Template pattern builder                                |
| `/schedules/all-shifts`    | `AllShifts`               | Date-based search across all schedules                  |

## 3. GraphQL Operations

**Queries**: `MY_UPCOMING_SHIFTS`, `ALL_MY_SHIFTS`, `ALL_SCHEDULES`, `SCHEDULE_QUERY`, `NORMALIZED_SHIFTS_FROM_RANGE_QUERY` (polymorphic: `ShiftDayWeek | ShiftLocationWeek`), `ALL_SCHEDULE_TEMPLATES`, `SCHEDULE_TEMPLATE_QUERY`

**Mutations**: `CREATE/PATCH/DELETE_SHIFT`, `CREATE/PATCH/DELETE_SHIFT_SLOT`, `ADD_SLOTS_TO_SHIFT`, `ADD/REMOVE_USER_FROM_SHIFT_SLOT`, `GENERATE_SHIFTS_FROM_TEMPLATE`, `CREATE/PATCH/DELETE_SCHEDULE_TEMPLATE`, `CREATE/PATCH/DELETE_SHIFT_TEMPLATE`, `CREATE/PATCH/DELETE_SHIFT_SLOT_TEMPLATE`, `PATCH_SCHEDULE`

## 4. Key Components

| Component                                    | Purpose                                                    |
| -------------------------------------------- | ---------------------------------------------------------- |
| `ShiftRenderer`                              | Dispatches to SINGLE_LOCATION or MULTIPLE_LOCATIONS layout |
| `ShiftDayWeekList` / `ShiftLocationWeekList` | Grouped shift week views                                   |
| `ShiftCard`                                  | Single shift card with filled/unfilled slot indicator      |
| `CreateShiftDrawer`                          | Full shift creation (name, time, location, role slots)     |
| `ApplyScheduleTemplateModal`                 | Instantiate template for date range + week count           |
| `ShiftTemplateAccordion`                     | Collapsible shift patterns in template editor              |
| `LocationSelect` / `ScheduleRoleSelect`      | Typed dropdowns backed by enums                            |
| `WeekController`                             | Prev/next week navigation                                  |

## 5. Locations and Roles — **IMPORTANT for Bryggeriet feature**

### Locations (`LocationValues` enum in `consts.ts`)

```typescript
enum LocationValues {
  BODEGAEN,
  DAGLIGHALLEN_BAR,
  EDGAR,
  KLUBBEN,
  LYCHE_BAR,
  LYCHE_KJOKKEN,
  RUNDHALLEN,
  SELSKAPSSIDEN,
  STORSALEN,
  STROSSA,
  KONTORET,
  // ← BRYGGERIET is MISSING here
}
```

Display map in `util.ts` (`parseLocation`): each location gets a label + badge colour.
`consts.ts` `locationOptions` array drives the `LocationSelect` dropdown.

### Roles (`RoleValues` enum in `consts.ts`)

Includes `BRYGGER` — already present. Also: BARISTA, BARTENDER, BARSJEF, KOKK, HOVMESTER, UGLE, BRANNVAKT, BAEREVAKT, RYDDEVAKT, SOCIVAKT, SPRITBARTENDER, SPRITBARSJEF, BARSERVITOR, KAFEANSVARLIG, SOUSCHEF, ARRANGEMENTBARTENDER, ARRANGEMENTANSVARLIG.

## 6. State Management

- **Apollo** — all queries/mutations; `refetchQueries` on shift create/delete
- **Polling** — 30 s on `MY_UPCOMING_SHIFTS` and `ALL_MY_SHIFTS`
- **Local** — modal/drawer open state, form inputs, `shiftsFrom` date, week count
- **Zustand** — `useMe()` for current user context

## 7. Notable Patterns

- **Polymorphic GraphQL union** (`ShiftGroupWeeksUnion`) — backend returns different week shapes based on `displayMode`
- **Chained mutations**: `createShift` → `addSlotsToShift` in `onCompleted` (no atomic backend mutation)
- **Template hierarchy**: ScheduleTemplate → ShiftTemplate → ShiftSlotTemplate (three levels)
- **Colour-coded location badges** — each venue has a distinct Mantine colour
- **iCal token** in `MyUpcomingShifts` — direct URL for calendar app subscription
