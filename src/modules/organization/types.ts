import { ApplicantNode } from 'modules/admissions/types.graphql'
import { UserNode } from 'modules/users/types'

export type InternalGroupNode = {
  id: string
  name: string
  type?: InternalGroupType
  currentlyDiscussing: ApplicantNode | null
  groupImage: string
  groupIcon: string
  description: string
  highlightedName: string
  membershipData: InternalGroupMembershipDataNode[]
}

export type InternalGroupMembershipDataNode = {
  internalGroupPositionName: string
  users: UserNode[]
}

export type InternalGroupPositionNode = {
  id: string
  internalGroup: InternalGroupNode
  name: string
}

export type InternalGroupUserHighlightNode = {
  id: string
  user: UserNode
  internalGroup: InternalGroupNode
  occupation: string
  description: string
  image?: File | null
  archived: boolean
}

// === Query typing ===
export interface AllInternalGroupsReturns {
  allInternalGroups: InternalGroupNode[]
}

export interface AllInternalGroupsByTypeReturns {
  internalGroups: InternalGroupNode[]
  interestGroups: InternalGroupNode[]
}

export interface AllInternalGroupPositionsReturns {
  allInternalGroupPositions: InternalGroupPositionNode[]
}
export type InternalGroupReturns = {
  internalGroup: InternalGroupNode
}

export type InternalGroupUserHighlightsByInternalGroupReturns = {
  internalGroupUserHighlightsByInternalGroup: InternalGroupUserHighlightNode[]
}

export type InternalGroupUserHighlightsByInternalGroupVariables = {
  internalGroupId: string
}

export enum InternalGroupType {
  INTERNAL_GROUP = 'INTERNAL_GROUP',
  INTEREST_GROUP = 'INTEREST_GROUP',
}

export type InternalGroupNodeShallow = {
  id: string
}

export type InternalGroupVariables = {
  id: string
}

// === Mutation typing ===

export type PatchInternalGroupInput = {
  name?: string
  description?: string
  groupImage?: File | null
}
export interface PatchInternalGroupReturns {
  internalGroup: InternalGroupNode
}

export interface PatchInternalGroupVariables {
  id: string
  input: PatchInternalGroupInput
}
