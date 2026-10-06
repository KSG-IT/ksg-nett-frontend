import { TemplateGenerationPreview } from './templateGeneration'
import type { DayShift } from './allShifts'
import { UserThumbnailProps } from 'modules/users/types'
import type { InternalGroupPositionType } from 'modules/organization/types.graphql'
import {
  DayValues,
  DefaultAvailabilityValues,
  LocationValues,
  RoleValues,
  RosterChangeKindValues,
  PlanningPeriodStatusValues,
  ScheduleDisplayModeValues,
  UnfilledReasonValues,
} from './consts'

// === NODES ===
export type ShiftSlotNode = {
  id: string
  user: UserThumbnailProps['user'] | null
  role: RoleValues
  shift: Pick<ShiftNode, 'id'>
}

// Is there a better way to do this?
type FilledShiftSlotNode = {
  id: string
  user: UserThumbnailProps['user']
  role: RoleValues
}

export type ShiftNode = {
  id: string
  users: UserThumbnailProps['user'][]
  slots: ShiftSlotNode[]
  filledSlots: FilledShiftSlotNode[]
  isFilled: boolean
  name: string

  datetimeStart: string
  datetimeEnd: string
  location: LocationValues | null
}

export type ShiftInterestNode = {
  interestType: 'INTERESTED' | 'AVAILABLE' | 'UNAVAILABLE'
  note: string
  source: string
}

export type ScheduleNode = {
  id: string
  name: string
  templates: Pick<ScheduleTemplateNode, 'id'>[]
  displayMode: ScheduleDisplayModeValues
}

// NORMALIZED SHIFT NODES

export type ShiftDay = {
  date: string
  shifts: ShiftNode[]
}

export type ShiftDayWeek = {
  date: string
  shiftDays: ShiftDay[]
}

export type ShiftLocationDayGroup = {
  location: LocationValues | null
  shifts: ShiftNode[]
}

export type ShiftLocationDay = {
  date: string
  locations: ShiftLocationDayGroup[]
}

export type ShiftLocationWeek = {
  date: string
  shiftDays: ShiftLocationDay[]
}

// TEMPLATE NODES

export type ScheduleTemplateNode = {
  id: string
  name: string
  schedule: Pick<ScheduleNode, 'id' | 'name'>
  shiftTemplates: ShiftTemplateNode[]
}

export type ShiftSlotTemplateNode = {
  id: string
  role: RoleValues
  count: number
}

export type ShiftTemplateNode = {
  id: string
  name: string
  location: LocationValues | null
  timeStart: string
  timeEnd: string
  day: DayValues
  duration: string
  shiftSlotTemplates: ShiftSlotTemplateNode[]
}

// === QUERIES ===

export interface MyUpcomingShiftsReturns {
  myUpcomingShifts: ShiftNode[]
}

export interface MyShiftsUpcomingReturns {
  myUpcomingShifts: DayShift[]
}

export interface MyShiftsPastReturns {
  allMyShifts: DayShift[]
}

export interface AllShiftsReturns {
  allShifts: DayShift[]
}

export interface AllShiftsVariables {
  date: string
}
export interface AllSchedulesReturns {
  allSchedules: ScheduleNode[]
}

export interface ScheduleOverviewNode {
  id: string
  name: string
  // Only schedules the user manages have the numbers below
  canManage: boolean
  internalGroup: { id: string; name: string } | null
  plannedUntil: string | null
  upcomingSlots: { filled: number; total: number } | null
  recentLocations: LocationValues[]
}

export interface ScheduleV2Returns {
  schedule: {
    id: string
    name: string
    canManage: boolean
    displayMode: ScheduleDisplayModeValues
    defaultRole: RoleValues | null
    recentLocations: LocationValues[]
    // All drafts of the schedule. Null for a user who does not manage it.
    draftCount: number | null
    shiftsFromRange: DayShift[]
  } | null
}

export interface DraftRangeVariables {
  scheduleId: string
  // Without dates, the mutation takes every draft of the schedule
  dateFrom?: string
  dateTo?: string
}

export interface LockDraftReturns {
  lockDraft: { changedSlots: number; notifiedUsers: number }
}

export interface DiscardDraftReturns {
  discardDraft: { discarded: number }
}

export interface ScheduleV2Variables {
  id: string
  shiftsFrom: string
  numberOfWeeks: number
}

export interface SchedulesOverviewReturns {
  allSchedules: ScheduleOverviewNode[]
}

// === PLANNING ===

export interface PlanningResponseStats {
  rosterCount: number
  optInCount: number
  usersWithAnswers: number
  optInWithInterest: number
  interested: number
  available: number
  unavailable: number
  unavailablePrefilled: number
  withNote: number
}

export interface SlotCoverageNode {
  shift: Pick<ShiftNode, 'id' | 'name' | 'datetimeStart'>
  role: RoleValues
  candidateBreakdown: SlotCoverageCandidateBreakdownNode[]
  slotCount: number
  openSlotCount: number
  candidateCount: number
  interestedCount: number
  unavailableCount: number
  unavailableWithNoteCount: number
}

export interface SlotCoverageCandidateBreakdownNode {
  membershipType: string | null
  candidateCount: number
  interestedCount: number
}

// A slot that an autofill run left empty, and why
export interface UnfilledSlotNode {
  // Null when the slot was deleted after the run
  shiftSlot: {
    id: string
    role: RoleValues
    // The slot now, so the page can skip slots that are filled after the run
    user: { id: string } | null
    draft: { id: string } | null
    shift: Pick<ShiftNode, 'id' | 'name' | 'datetimeStart'>
  } | null
  reason: UnfilledReasonValues
  candidateCount: number
}

export interface AutofillRunNode {
  id: string
  createdAt: string
  createdBy: { id: string; getCleanFullName: string } | null
  // The drafts of the run that are not locked, changed or replaced
  draftCount: number
  unfilled: UnfilledSlotNode[]
}

// The fields SCHEDULE_PLANNING_QUERY fetches for a manager
export interface PlanningPeriodNode {
  id: string
  dateFrom: string
  dateTo: string
  deadline: string
  status: PlanningPeriodStatusValues
  publishedAt: string | null
  reminderSentAt: string | null
  responseStats: PlanningResponseStats | null
  slotCoverage: SlotCoverageNode[]
  // Newest first
  autofillRuns: AutofillRunNode[]
}

// The fields MY_OPEN_PLANNING_PERIODS_QUERY fetches for the member
export type MyPlanningShiftNode = Pick<
  ShiftNode,
  'id' | 'name' | 'location' | 'datetimeStart' | 'datetimeEnd'
> & {
  myInterest: ShiftInterestNode | null
}

export interface MyPlanningPeriodNode {
  id: string
  dateFrom: string
  dateTo: string
  deadline: string
  status: PlanningPeriodStatusValues
  myDefaultAvailability: DefaultAvailabilityValues | null
  schedule: {
    id: string
    name: string
  }
  shifts: MyPlanningShiftNode[]
}

export interface MyOpenPlanningPeriodsReturns {
  myOpenPlanningPeriods: MyPlanningPeriodNode[]
}

export interface MyOpenPlanningPeriodsSummaryReturns {
  myOpenPlanningPeriods: {
    id: string
    dateFrom: string
    dateTo: string
    deadline: string
    status: PlanningPeriodStatusValues
    myDefaultAvailability: DefaultAvailabilityValues | null
    schedule: { id: string; name: string }
    shifts: {
      id: string
      myInterest: Pick<ShiftInterestNode, 'interestType' | 'source'> | null
    }[]
  }[]
}

export interface SchedulePlanningReturns {
  schedule: {
    id: string
    name: string
    canManage: boolean
    planningPeriods: PlanningPeriodNode[]
  } | null
}

export interface PlanningPeriodInput {
  dateFrom: string
  dateTo: string
  deadline: string
}

export interface CreatePlanningPeriodVariables {
  input: PlanningPeriodInput & { scheduleId: string }
}

export interface CreatePlanningPeriodReturns {
  createPlanningPeriod: { planningPeriod: Pick<PlanningPeriodNode, 'id'> }
}

export interface UpdatePlanningPeriodVariables {
  id: string
  input: PlanningPeriodInput
}

export interface UpdatePlanningPeriodReturns {
  updatePlanningPeriod: { planningPeriod: Pick<PlanningPeriodNode, 'id'> }
}

export interface DeletePlanningPeriodReturns {
  deletePlanningPeriod: { found: boolean }
}

export interface SendPlanningPeriodReminderVariables {
  planningPeriodId: string
}

export interface SendPlanningPeriodReminderReturns {
  sendPlanningPeriodReminder: {
    recipients: number
    planningPeriod: Pick<PlanningPeriodNode, 'id' | 'reminderSentAt'>
  }
}

export interface RunAutofillVariables {
  planningPeriodId: string
}

export interface RunAutofillReturns {
  runAutofill: {
    autofillRun: Pick<AutofillRunNode, 'id' | 'draftCount'> & {
      unfilled: Pick<UnfilledSlotNode, 'reason'>[]
    }
  }
}

export interface RevertAutofillRunReturns {
  revertAutofillRun: { removedDrafts: number }
}

export interface PublishPlanningPeriodReturns {
  publishPlanningPeriod: {
    changedSlots: number
    notifiedUsers: number
    planningPeriod: Pick<PlanningPeriodNode, 'id' | 'status' | 'publishedAt'>
  }
}

export interface AllScheduleTemplatesReturns {
  allScheduleTemplates: ScheduleTemplateNode[]
}

export interface ScheduleTemplateQueryVariables {
  id: string
}
export interface ScheduleTemplateQueryReturns {
  scheduleTemplate: ScheduleTemplateNode | null
}

// === ROSTER ===

// The membership type of a rule, as the enum name ("HANGAROUND")
export type MembershipTypeName = `${InternalGroupPositionType}`

// The values a roster row and a roster rule share
export interface RosterValues {
  role: RoleValues
  defaultAvailability: DefaultAvailabilityValues
  shiftCap: number | null
}

export interface ScheduleRosterNode {
  id: string
  user: {
    id: string
    fullName: string
    initials: string
    profileImage: string | null
  }
  autofillAs: RoleValues
  defaultAvailability: DefaultAvailabilityValues
  shiftCap: number | null
  manuallyEdited: boolean
  addedManually: boolean
  countFrom: string | null
  // The raw type of the active membership, for example "hangaround"
  membershipType: string | null
  shiftsDone: number
  shiftsPlanned: number
  lastShift: string | null
}

export interface ScheduleRosterGroupingNode extends RosterValues {
  id: string
  internalGroupPosition: { id: string; name: string }
  positionType: MembershipTypeName
}

export interface RosterChangeNode {
  kind: RosterChangeKindValues
  user: { id: string; fullName: string }
  autofillAs: RoleValues | null
  defaultAvailability: DefaultAvailabilityValues | null
  shiftCap: number | null
  message: string | null
}

export interface ScheduleIdVariables {
  id: string
}

export interface ScheduleRosterReturns {
  schedule: {
    id: string
    name: string
    canManage: boolean
    roster: ScheduleRosterNode[]
  } | null
}

export interface ScheduleRosterRulesReturns {
  schedule: {
    id: string
    name: string
    canManage: boolean
    internalGroup: {
      id: string
      name: string
      positions: { edges: { node: { id: string; name: string } }[] }
    } | null
    rosterGroupings: ScheduleRosterGroupingNode[]
  } | null
}

export interface RosterSyncPreviewReturns {
  schedule: { id: string; rosterSyncPreview: RosterChangeNode[] } | null
}

export interface CreateScheduleRosterGroupingVariables {
  input: {
    scheduleId: string
    internalGroupPositionId: string
    positionType: MembershipTypeName
    role: RoleValues
    defaultAvailability: DefaultAvailabilityValues
    shiftCap: number | null
  }
}

export interface CreateScheduleRosterGroupingReturns {
  createScheduleRosterGrouping: { grouping: { id: string } }
}

export interface PatchScheduleRosterGroupingVariables {
  id: string
  input: RosterValues
}

export interface PatchScheduleRosterGroupingReturns {
  patchScheduleRosterGrouping: { grouping: ScheduleRosterGroupingNode }
}

export interface DeleteScheduleRosterGroupingReturns {
  deleteScheduleRosterGrouping: { found: boolean }
}

export interface SyncScheduleRosterVariables {
  scheduleId: string
}

export interface SyncScheduleRosterReturns {
  syncScheduleRoster: { changes: { kind: RosterChangeKindValues }[] }
}

export interface RosterEntryInput {
  autofillAs: RoleValues
  defaultAvailability: DefaultAvailabilityValues
  shiftCap: number | null
}

export interface AddScheduleRosterEntryVariables {
  input: RosterEntryInput & { scheduleId: string; userId: string }
}

export interface AddScheduleRosterEntryReturns {
  addScheduleRosterEntry: { entry: { id: string } }
}

export interface UpdateScheduleRosterEntryVariables {
  id: string
  input: RosterEntryInput
}

export interface UpdateScheduleRosterEntryReturns {
  updateScheduleRosterEntry: {
    entry: Pick<
      ScheduleRosterNode,
      | 'id'
      | 'autofillAs'
      | 'defaultAvailability'
      | 'shiftCap'
      | 'manuallyEdited'
    >
  }
}

export interface RemoveScheduleRosterEntryReturns {
  removeScheduleRosterEntry: { found: boolean }
}

// === MUTATIONS ===

type PatchScheduleTemplateInput = {
  name: string
}

export interface PatchScheduleTemplateReturns {
  patchScheduleTemplate: Pick<ScheduleTemplateNode, 'id'>
}
export interface PatchScheduleTemplateVariables {
  id: string
  input: PatchScheduleTemplateInput
}

export interface PatchScheduleReturns {
  schedule: Pick<ScheduleNode, 'id'>
}

type PatchScheduleInput = {
  name: string
  displayMode: ScheduleDisplayModeValues
}
export interface PatchScheduleVariables {
  id: string
  input: PatchScheduleInput
}

export interface PatchShiftSlotTemplateReturns {
  patchShiftSlotTemplate: Pick<ShiftSlotTemplateNode, 'id'>
}
export interface PatchShiftSlotTemplateVariables {
  id: string
  input: PatchShiftSlotTemplateInput
}

type PatchShiftSlotTemplateInput = {
  role?: RoleValues
  count?: number
}

type CreateShiftTemplateInput = {
  name: string
  day: DayValues
  location?: LocationValues | null
  timeStart: string
  timeEnd: string
  scheduleTemplate: string
}

export interface CreateShiftTemplateReturns {
  shiftTemplate: Pick<ShiftTemplateNode, 'id'>
}
export interface CreateShiftTemplateVariables {
  input: CreateShiftTemplateInput
}

export interface CreateShiftSlotTemplateReturns {
  shiftSlotTemplate: Pick<ShiftSlotTemplateNode, 'id'>
}

type CreateShiftSlotTemplateInput = {
  shiftTemplate: string
  role: RoleValues
  count: number
}
export interface CreateShiftSlotTemplateVariables {
  input: CreateShiftSlotTemplateInput
}

export interface CreateScheduleTemplateReturns {
  scheduleTemplate: Pick<ScheduleTemplateNode, 'id'>
}

type CreateScheduleTemplateInput = {
  name: string
  schedule: string
}
export interface CreateScheduleTemplateVariables {
  input: CreateScheduleTemplateInput
}

export interface AddUserToShiftSlotReturns {
  shiftSlot: Pick<ShiftSlotNode, 'id'>
}
export interface AddUserToShiftSlotVariables {
  shiftSlotId: string
  userId: string
}

export interface RemoveUserFromShiftSlotReturns {
  shiftSlot: Pick<ShiftSlotNode, 'id'>
}

export interface RemoveUserFromShiftSlotVariables {
  shiftSlotId: string
}

export interface GenerateShiftsFromTemplateReturns {
  shiftsCreated: number
}
export interface GenerateShiftsFromTemplateVariables {
  scheduleTemplateId: string
  startDate: string
  numberOfWeeks: number
  // Needed when the generation deletes people, answers or drafts
  confirmDelete?: boolean
}

export interface TemplateGenerationPreviewReturns {
  templateGenerationPreview: TemplateGenerationPreview
}

export interface CreateShiftMutationReturns {
  createShift: { shift: Pick<ShiftNode, 'id'> }
}

type CreateShiftInput = {
  schedule: string
  location?: LocationValues | null
  name?: string
  datetimeStart: Date
  datetimeEnd: Date
}
export interface CreateShiftMutationVariables {
  input: CreateShiftInput
}

export interface CreateShiftSlotReturns {
  shiftSlot: Pick<ShiftSlotNode, 'id'>
}

type CreateShiftSlotInput = {
  shift: string
  role: RoleValues
}
export interface CreateShiftSlotVariables {
  input: CreateShiftSlotInput
}

export type AddSlotToShiftInput = {
  shiftSlotRole: RoleValues
  count: number
}

export interface AddSlotsToShiftReturns {
  shift: Pick<ShiftNode, 'id'>
}
export interface AddSlotsToShiftVariables {
  shiftId: string
  slots: AddSlotToShiftInput[]
}

type PatchShiftInput = {
  name?: string
  datetimeStart?: Date
  datetimeEnd?: Date
  location?: LocationValues | null
}
export interface PatchShiftReturns {
  shift: Pick<ShiftNode, 'id'>
}
export interface PatchShiftVariables {
  id: string
  input: PatchShiftInput
}
