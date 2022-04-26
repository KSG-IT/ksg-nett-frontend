import { ApplicantNode } from 'modules/admissions/types'
import { UserNode } from 'modules/users/types'

export type InternalGroupNode = {
  id: string
  name: string
  currentlyDiscussing: ApplicantNode | null
  groupImage: string
  groupIcon: string
  description: string
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

export type InternalGroupReturns = {
  internalGroup: InternalGroupNode
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

export type PatchInternalGroupInput = Partial<Omit<InternalGroupNode, 'id'>>

export interface PatchInternalGroupReturns {
  internalGroup: InternalGroupNode
}

export interface PatchInternalGroupVariables {
  id: string
  input: PatchInternalGroupInput
}
