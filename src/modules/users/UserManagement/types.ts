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
  dateJoined: string
  dateEnded: string
  fullName: string
}

export type ManageInternalGroupUser = {
  userId: string
  membershipId: string
  position: InternalGroupPositionNode
  internalGroupPositionType: InternalGroupPositionType
  internalGroupPositionMembership: InternalGroupPositionMembershipNode
  dateJoinedSemesterShorthand: string
  dateEndedSemesterShorthand: string | null
  fullName: string
  positionName: string
}

export type ManageInternalGroupData = {
  activeMemberships: ManageInternalGroupUser[]
  allMemberships: ManageInternalGroupUser[]
}

// ==== Query typing ===

export interface ManageUsersDataReturns {
  manageUsersData: ManageInternalGroupData
}

export interface ManageUsersDataVariables {
  internalGroupId: string
  activeOnly: boolean
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

export interface InternalGroupPositionTypeOption {
  value: InternalGroupPositionType
  label: string
}
