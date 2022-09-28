import { UserNode } from 'modules/users/types'
import { LocationValues, RoleValues } from './consts'

// === NODES ===
export type ShiftSlotNode = {
  id: string
  user: Pick<UserNode, 'id' | 'fullName' | 'profileImage' | 'initials'> | null
  role: RoleValues
}

// Is there a better way to do this?
type FilledShiftSlotNode = {
  id: string
  user: Pick<UserNode, 'id' | 'fullName' | 'profileImage' | 'initials'>
  role: RoleValues
}

export type ShiftNode = {
  id: string
  users: Pick<UserNode, 'id' | 'fullName' | 'profileImage' | 'initials'>[]
  slots: ShiftSlotNode[]
  filledSlots: FilledShiftSlotNode[]

  datetimeStart: string
  datetimeEnd: string
  location: LocationValues | null
}

export type ScheduleNode = {
  id: string
  name: string
  templates: Pick<ScheduleTemplateNode, 'id'>[]
}
export type ScheduleTemplateNode = {
  id: string
  name: string
  schedule: Pick<ScheduleNode, 'id' | 'name'>
}

// === QUERIES ===

export interface MyUpcomingShiftsReturns {
  myUpcomingShifts: ShiftNode[]
}

export interface AllMyShiftsReturns {
  allMyShifts: ShiftNode[]
}

export interface AllSchedulesReturns {
  allSchedules: ScheduleNode[]
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
