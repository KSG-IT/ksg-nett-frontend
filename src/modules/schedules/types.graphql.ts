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

// === QUERIES ===

export interface MyUpcomingShiftsReturns {
  myUpcomingShifts: ShiftNode[]
}

export interface AllMyShiftsReturns {
  allMyShifts: ShiftNode[]
}

// === MUTATIONS ===
