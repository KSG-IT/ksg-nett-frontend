import { InternalGroupPositionNode } from 'modules/organization/types'

export enum InternalGroupPositionType {
  FUNCTIONARY = 'FUNCTIONARY',
  ACTIVE_FUNCTIONARY_PANG = 'ACTIVE_FUNCTIONARY_PANG',
  OLD_FUNCTIONARY_PANG = 'OLD_FUNCTIONARY_PANG',
  GANG_MEMBER = 'GANG_MEMBER',
  ACTIVE_GANG_MEMBER_PANG = 'ACTIVE_GANG_MEMBER_PANG',
  OLD_GANG_MEMBER_PANG = 'OLD_GANG_MEMBER_PANG',
  INTEREST_GROUP_MEMBER = 'INTEREST_GROUP_MEMBER',
  HANGAROUND = 'HANGAROUND',
  TEMPORARY_LEAVE = 'TEMPORARY_LEAVE',
}

export type InternalGroupPositionMembershipNode = {
  id: string
  position: InternalGroupPositionNode
  internalGroupPositionType: InternalGroupPositionType
  dateJoinedSemesterShorthand: string
  fullName: string
}

export type ManageInternalGroupUser = {
  userId: string
  position: InternalGroupPositionNode
  internalGroupPositionType: InternalGroupPositionType
  internalGroupPositionMembership: InternalGroupPositionMembershipNode
  dateJoinedSemesterShorthand: string
  fullName: string
  positionName: string
}

// ==== Query typing ===

export interface ManageUsersDataReturns {
  manageUsersData: ManageInternalGroupUser[]
}

export interface ManageUsersDataVariables {
  internalGroupId: string
}

// === Mutation typing ===

export interface AssignNewInternalGroupPositionMembershipReturns {
  internalGroupPositionMembership: InternalGroupPositionMembershipNode
}

export interface AssignNewInternalGroupPositionMembershipVariables {
  userId: string
  internalGroupPositionId: string
  internalGroupPositionType: InternalGroupPositionType
}
