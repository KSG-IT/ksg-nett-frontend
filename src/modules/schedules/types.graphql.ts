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
  ScheduleDisplayModeValues,
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
    shiftsFromRange: DayShift[]
  } | null
}

export interface ScheduleV2Variables {
  id: string
  shiftsFrom: string
  numberOfWeeks: number
}

export interface SchedulesOverviewReturns {
  allSchedules: ScheduleOverviewNode[]
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
