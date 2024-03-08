export type LegacyUserrWorkHistoryNode = {
  id: string
  identifyingId: string
  dateFrom: string
  dateTo: string
}

export type PatchHighlightInput = {
  user: string
  internalGroup: string
  occupation: string
  description: string
  image?: File | null
  archived: boolean
}

export interface PatchInternalGroupPositionMembershipReturns {
  internalGroupPositionMembership: Pick<
    InternalGroupPositionMembershipNode,
    'id'
  >
}

export interface PatchInternalGroupPositionMembershipDatesReturns
  extends PatchInternalGroupPositionMembershipReturns {}

export interface PatchInternalGroupPositionMembershipDatesVariables {
  membershipId: string
  dateJoined: string
  dateEnded: string
}

export interface PatchInternalGroupPositionMembershipVariables {
  id: string
  input: Partial<Omit<InternalGroupPositionMembershipNode, 'id'>>
}

export interface CreateInternalGroupUserHighlightReturns {
  internalGroupUserHighlight: Pick<InternalGroupUserHighlightNode, 'id'>
}

export interface PatchInternalGroupUserHighlightReturns {
  internalGroupUserHighlight: Pick<InternalGroupUserHighlightNode, 'id'>
}

export interface PatchInternalGroupUserHighlightVariables {
  id: string
  input: PatchHighlightInput
}

export interface QuitKSGReturns {
  internalGroupPositionMembership: Pick<
    InternalGroupPositionMembershipNode,
    'id'
  >
}

export interface QuitKSGVariables {
  membershipId: string
}

import {
  InternalGroupPositionNode,
  InternalGroupUserHighlightNode,
} from 'modules/organization/types'

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
  membershipStart: string
  membershipEnd: string
  fullName: string
  getTypeDisplay: string
}

export type ManageInternalGroupUser = {
  userId: string
  membershipId: string
  position: InternalGroupPositionNode
  internalGroupPositionType: InternalGroupPositionType
  // Better typing on this
  internalGroupPositionMembership: Pick<
    InternalGroupPositionMembershipNode,
    'id' | 'getTypeDisplay' | 'position' | 'dateJoined' | 'dateEnded'
  >
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

export interface InternalGroupPositionsByInternalGroupReturns {
  internalGroupPositionsByInternalGroup: Pick<
    InternalGroupPositionNode,
    'id' | 'name'
  >[]
}

export interface InternalGroupPositionsByInternalGroupVariables {
  id: string
}
