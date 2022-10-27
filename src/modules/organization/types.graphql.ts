import { InternalGroupPositionMembershipNode } from 'modules/users/UserManagement/types'

export type LegacyUserrWorkHistoryNode = {
  id: string
  identifyingId: string
  dateFrom: string
  dateTo: string
}

export interface PatchInternalGroupPositionMembershipReturns {
  internalGroupPositionMembership: Pick<
    InternalGroupPositionMembershipNode,
    'id'
  >
}
export interface PatchInternalGroupPositionMembershipVariables {
  id: string
  input: Partial<Omit<InternalGroupPositionMembershipNode, 'id'>>
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
