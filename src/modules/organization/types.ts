import { ApplicantNode } from 'modules/admissions/types'

export type InternalGroupNode = {
  id: string
  name: string
  currentlyDiscussing: ApplicantNode | null
}

export type InternalGroupPositionNode = {
  id: string
  internalGroup: InternalGroupNode
  name: string
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
