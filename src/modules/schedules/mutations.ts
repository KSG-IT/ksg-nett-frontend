import { gql } from 'graphql-tag'
import { SLOT_DRAFT_FIELDS } from './queries'

// ==== SCHEDULE TEMPLATE====

export const CREATE_SCHEDULE_TEMPLATE_MUTATION = gql`
  mutation CreateScheduleTemplate($input: CreateScheduleTemplateInput!) {
    createScheduleTemplate(input: $input) {
      scheduleTemplate {
        id
      }
    }
  }
`

export const PATCH_SCHEDULE_TEMPLATE_MUTATION = gql`
  mutation PatchScheduleTemplate(
    $id: ID!
    $input: PatchScheduleTemplateInput!
  ) {
    patchScheduleTemplate(id: $id, input: $input) {
      scheduleTemplate {
        id
      }
    }
  }
`

export const DELETE_SCHEDULE_TEMPLATE_MUTATION = gql`
  mutation DeleteScheduleTemplate($id: ID!) {
    deleteScheduleTemplate(id: $id) {
      found
    }
  }
`

// ==== SCHEDULE ====

export const PATCH_SCHEDULE_MUTATION = gql`
  mutation PatchSchedule($id: ID!, $input: PatchScheduleInput!) {
    patchSchedule(id: $id, input: $input) {
      schedule {
        id
      }
    }
  }
`

// ==== SHIFT TEMPLATE ====

export const CREATE_SHIFT_TEMPLATE_MUTATION = gql`
  mutation CreateShiftTemplate($input: CreateShiftTemplateInput!) {
    createShiftTemplate(input: $input) {
      shiftTemplate {
        id
      }
    }
  }
`

export const DELETE_SHIFT_TEMPLATE_MUTATION = gql`
  mutation DeleteShiftTemplate($id: ID!) {
    deleteShiftTemplate(id: $id) {
      found
    }
  }
`

// ==== SHIFT SLOT TEMPLATE ====
export const CREATE_SHIFT_SLOT_TEMPLATE_MUTATION = gql`
  mutation CreateShiftSlotTemplate($input: CreateShiftSlotTemplateInput!) {
    createShiftSlotTemplate(input: $input) {
      shiftSlotTemplate {
        id
      }
    }
  }
`

export const PATCH_SHIFT_SLOT_TEMPLATE_MUTATION = gql`
  mutation PatchShiftSlotTemplate(
    $id: ID!
    $input: PatchShiftSlotTemplateInput!
  ) {
    patchShiftSlotTemplate(id: $id, input: $input) {
      shiftSlotTemplate {
        id
      }
    }
  }
`

export const DELETE_SHIFT_SLOT_TEMPLATE_MUTATION = gql`
  mutation DeleteShiftSlotTemplate($id: ID!) {
    deleteShiftSlotTemplate(id: $id) {
      found
    }
  }
`

export const REMOVE_USER_FROM_SHIFT_SLOT_MUTATION = gql`
  mutation RemoveUserFromShiftSlot($shiftSlotId: ID!) {
    removeUserFromShiftSlot(shiftSlotId: $shiftSlotId) {
      shiftSlot {
        id
      }
    }
  }
`

export const ADD_USER_TO_SHIFT_SLOT_MUTATION = gql`
  mutation AddUserToShiftSlot($shiftSlotId: ID!, $userId: ID!) {
    addUserToShiftSlot(shiftSlotId: $shiftSlotId, userId: $userId) {
      shiftSlot {
        id
      }
    }
  }
`

export const GENERATE_SHIFTS_FROM_TEMPLATE_MUTATION = gql`
  mutation GenerateShiftsFromTemplate(
    $scheduleTemplateId: ID!
    $startDate: Date!
    $numberOfWeeks: Int!
    $confirmDelete: Boolean
  ) {
    generateShiftsFromTemplate(
      scheduleTemplateId: $scheduleTemplateId
      startDate: $startDate
      numberOfWeeks: $numberOfWeeks
      confirmDelete: $confirmDelete
    ) {
      shiftsCreated
    }
  }
`

export const DELETE_SHIFT_MUTATION = gql`
  mutation DeleteShift($id: ID!) {
    deleteShift(id: $id) {
      found
    }
  }
`

export const CREATE_SHIFT_MUTATION = gql`
  mutation CreateShift($input: CreateShiftInput!) {
    createShift(input: $input) {
      shift {
        id
      }
    }
  }
`

export const CREATE_SHIFT_SLOT_MUTATION = gql`
  mutation CreateShiftSlot($input: CreateShiftSlotInput!) {
    createShiftSlot(input: $input) {
      shiftSlot {
        id
      }
    }
  }
`

export const DELETE_SHIFT_SLOT_MUTATION = gql`
  mutation DeleteShiftSlot($id: ID!) {
    deleteShiftSlot(id: $id) {
      found
    }
  }
`

export const ADD_SLOTS_TO_SHIFT_MUTATION = gql`
  mutation AddSlotsToShift($shiftId: ID!, $slots: [AddSlotToShiftInput]!) {
    addSlotsToShift(shiftId: $shiftId, slots: $slots) {
      shift {
        id
      }
    }
  }
`

export const PATCH_SHIFT_MUTATION = gql`
  mutation PatchShift($id: ID!, $input: PatchShiftInput!) {
    patchShift(id: $id, input: $input) {
      shift {
        id
      }
    }
  }
`

// v2 of the schedule view: the mutations return the slot with its user, so
// the Apollo cache updates the chip without a refetch.
const SLOT_WITH_USER = `
  shiftSlot {
    id
    user {
      id
      initials
      firstName
      getFullWithNickName
      getCleanFullName
      profileImage
    }
  }
`

export const ASSIGN_SLOT_V2_MUTATION = gql`
  mutation AssignSlotV2($shiftSlotId: ID!, $userId: ID!) {
    addUserToShiftSlot(shiftSlotId: $shiftSlotId, userId: $userId) {
      ${SLOT_WITH_USER}
    }
  }
`

// Writes a draft, not the slot. The member sees nothing until the lock.
// Without userId the draft removes the person; a draft with the locked person
// removes the draft (ksg-nett-backend/schedules/schemas/drafts.py).
export const DRAFT_SLOT_V2_MUTATION = gql`
  ${SLOT_DRAFT_FIELDS}
  mutation DraftSlotV2($shiftSlotId: ID!, $userId: ID) {
    draftSlot(shiftSlotId: $shiftSlotId, userId: $userId) {
      shiftSlot {
        id
        ...SlotDraftFields
        # The count of the schedule is cached, so a draft must update it. The
        # lock buttons show only when it is above 0.
        shift {
          id
          schedule {
            id
            draftCount
          }
        }
      }
    }
  }
`

// The dates are optional. Without them, the mutation takes every draft of the
// schedule. A lock sends one email per member with the notification setting.
export const LOCK_DRAFT_MUTATION = gql`
  mutation LockDraft($scheduleId: ID!, $dateFrom: Date, $dateTo: Date) {
    lockDraft(scheduleId: $scheduleId, dateFrom: $dateFrom, dateTo: $dateTo) {
      changedSlots
      notifiedUsers
    }
  }
`

export const DISCARD_DRAFT_MUTATION = gql`
  mutation DiscardDraft($scheduleId: ID!, $dateFrom: Date, $dateTo: Date) {
    discardDraft(
      scheduleId: $scheduleId
      dateFrom: $dateFrom
      dateTo: $dateTo
    ) {
      discarded
    }
  }
`

export const CLEAR_SLOT_V2_MUTATION = gql`
  mutation ClearSlotV2($shiftSlotId: ID!) {
    removeUserFromShiftSlot(shiftSlotId: $shiftSlotId) {
      ${SLOT_WITH_USER}
    }
  }
`

// === PLANNING ===

export const CREATE_PLANNING_PERIOD_MUTATION = gql`
  mutation CreatePlanningPeriod($input: CreatePlanningPeriodInput!) {
    createPlanningPeriod(input: $input) {
      planningPeriod {
        id
      }
    }
  }
`

export const UPDATE_PLANNING_PERIOD_MUTATION = gql`
  mutation UpdatePlanningPeriod($id: ID!, $input: UpdatePlanningPeriodInput!) {
    updatePlanningPeriod(id: $id, input: $input) {
      planningPeriod {
        id
      }
    }
  }
`

export const DELETE_PLANNING_PERIOD_MUTATION = gql`
  mutation DeletePlanningPeriod($id: ID!) {
    deletePlanningPeriod(id: $id) {
      found
    }
  }
`

export const SEND_PLANNING_PERIOD_REMINDER_MUTATION = gql`
  mutation SendPlanningPeriodReminder($planningPeriodId: ID!) {
    sendPlanningPeriodReminder(planningPeriodId: $planningPeriodId) {
      recipients
      planningPeriod {
        id
        reminderSentAt
      }
    }
  }
`

// === AUTOFILL AND PUBLISH ===

export const RUN_AUTOFILL_MUTATION = gql`
  mutation RunAutofill($planningPeriodId: ID!) {
    runAutofill(planningPeriodId: $planningPeriodId) {
      autofillRun {
        id
        draftCount
        unfilled {
          reason
        }
      }
    }
  }
`

export const REVERT_AUTOFILL_RUN_MUTATION = gql`
  mutation RevertAutofillRun($id: ID!) {
    revertAutofillRun(id: $id) {
      removedDrafts
    }
  }
`

// Locks the drafts in the period's dates. Members with notify_on_shift get
// one email each.
export const PUBLISH_PLANNING_PERIOD_MUTATION = gql`
  mutation PublishPlanningPeriod($id: ID!) {
    publishPlanningPeriod(id: $id) {
      changedSlots
      notifiedUsers
      planningPeriod {
        id
        status
        publishedAt
      }
    }
  }
`

export const SET_SHIFT_INTEREST_MUTATION = gql`
  mutation SetShiftInterest(
    $shiftId: ID!
    $interestType: ShiftInterestTypeEnum
    $note: String
  ) {
    setShiftInterest(
      shiftId: $shiftId
      interestType: $interestType
      note: $note
    ) {
      shift {
        id
        myInterest {
          interestType
          note
          source
        }
      }
      shiftInterest {
        interestType
        note
        source
      }
    }
  }
`

export const CREATE_SHIFT_WITH_SLOTS_MUTATION = gql`
  mutation CreateShiftWithSlots($input: CreateShiftWithSlotsInput!) {
    createShiftWithSlots(input: $input) {
      shift {
        id
      }
    }
  }
`

export const UPDATE_SHIFT_DETAILS_MUTATION = gql`
  mutation UpdateShiftDetails($input: UpdateShiftDetailsInput!) {
    updateShiftDetails(input: $input) {
      shift {
        id
      }
    }
  }
`

// === ROSTER ===

const GROUPING_FIELDS = `
  id
  internalGroupPosition {
    id
    name
  }
  positionType
  role
  defaultAvailability
  shiftCap
`

export const CREATE_SCHEDULE_ROSTER_GROUPING_MUTATION = gql`
  mutation CreateScheduleRosterGrouping(
    $input: CreateScheduleRosterGroupingInput!
  ) {
    createScheduleRosterGrouping(input: $input) {
      grouping {
        id
      }
    }
  }
`

export const PATCH_SCHEDULE_ROSTER_GROUPING_MUTATION = gql`
  mutation PatchScheduleRosterGrouping(
    $id: ID!
    $input: PatchScheduleRosterGroupingInput!
  ) {
    patchScheduleRosterGrouping(id: $id, input: $input) {
      grouping {
        ${GROUPING_FIELDS}
      }
    }
  }
`

export const DELETE_SCHEDULE_ROSTER_GROUPING_MUTATION = gql`
  mutation DeleteScheduleRosterGrouping($id: ID!) {
    deleteScheduleRosterGrouping(id: $id) {
      found
    }
  }
`

export const SYNC_SCHEDULE_ROSTER_MUTATION = gql`
  mutation SyncScheduleRoster($scheduleId: ID!) {
    syncScheduleRoster(scheduleId: $scheduleId) {
      changes {
        kind
      }
    }
  }
`

export const ADD_SCHEDULE_ROSTER_ENTRY_MUTATION = gql`
  mutation AddScheduleRosterEntry($input: AddScheduleRosterEntryInput!) {
    addScheduleRosterEntry(input: $input) {
      entry {
        id
      }
    }
  }
`

// Returns the changed values, so the Apollo cache updates the row
export const UPDATE_SCHEDULE_ROSTER_ENTRY_MUTATION = gql`
  mutation UpdateScheduleRosterEntry(
    $id: ID!
    $input: UpdateScheduleRosterEntryInput!
  ) {
    updateScheduleRosterEntry(id: $id, input: $input) {
      entry {
        id
        autofillAs
        defaultAvailability
        shiftCap
        manuallyEdited
      }
    }
  }
`

export const REMOVE_SCHEDULE_ROSTER_ENTRY_MUTATION = gql`
  mutation RemoveScheduleRosterEntry($id: ID!) {
    removeScheduleRosterEntry(id: $id) {
      found
    }
  }
`
