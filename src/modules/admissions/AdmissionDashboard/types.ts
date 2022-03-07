import { InternalGroupNode } from 'modules/organization/types'

export interface InternalGroupsAcceptingApplicantsReturns {
  internalGroupsAcceptingApplicants: Pick<InternalGroupNode, 'id' | 'name'>[]
}
