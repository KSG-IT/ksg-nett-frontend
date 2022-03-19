import { ApplicantNode } from 'modules/admissions/types'

export type InternalGroupNode = {
  id: string
  name: string
  currentlyDiscussing: ApplicantNode | null
  groupImage: string
  description: string
}

export type InternalGroupPositionNode = {
  id: string
  internalGroup: InternalGroupNode
  name: string
}

export type InternalGroupReturns = {
  internalGroup: InternalGroupNode
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
  currentlyDiscussing?: string
}

export interface PatchInternalGroupReturns {
  internalGroup: InternalGroupNode
}

export interface PatchInternalGroupVariables {
  id: string
  input: PatchInternalGroupInput
}
