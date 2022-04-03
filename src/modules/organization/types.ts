export type InternalGroupNode = {
  id: string
  name: string
}

export type InternalGroupPositionNode = {
  id: string
  internalGroup: InternalGroupNode
  name: string
}

// === Query typing ===
export interface AllInternalGroupsReturns {
  allInternalGroups: InternalGroupNode[]
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
