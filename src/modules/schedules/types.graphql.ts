import { UserNode } from 'modules/users'
import { LocationValues } from './consts'

// === NODES ===
export type ShiftSlotNode = {
  id: string
  user: Pick<UserNode, 'id' | 'fullName' | 'profileImage' | 'initials'> | null
  role: RoleNode
}

// Is there a better way to do this?
type FilledShiftSlotNode = {
  id: string
  user: Pick<UserNode, 'id' | 'fullName' | 'profileImage' | 'initials'>
  role: RoleNode
}

export type RoleNode = {
  id: string
  name: string
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

// === MUTATIONS ===
