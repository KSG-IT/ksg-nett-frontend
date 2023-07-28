import { SociProductNode } from 'modules/economy/types.graphql'
import { UserNode, UserThumbnailProps } from 'modules/users/types'
import {
  DayValues,
  LocationValues,
  RoleValues,
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

export interface AllMyShiftsReturns {
  allMyShifts: ShiftNode[]
}

export interface AllShiftsReturns {
  allShifts: Pick<
    ShiftNode,
    'id' | 'datetimeStart' | 'name' | 'filledSlots' | 'location' | 'datetimeEnd'
  >[]
}

export interface AllShiftsVariables {
  date: string
}
export interface AllSchedulesReturns {
  allSchedules: ScheduleNode[]
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

export interface AllUsersWorkingTodayReturns {
  allUsersWorkingToday: Pick<UserNode, 'id' | 'fullName' | 'initials'>[]
  defaultSociProducts: Pick<SociProductNode, 'id' | 'name'>[]
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
