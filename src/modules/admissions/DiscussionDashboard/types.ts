import { InternalGroupNode } from 'modules/organization/types'
import { ApplicantNode, InternalGroupPositionPriorityNode } from '../types'

export type InternalGroupDiscussionData = {
  internalGroup: InternalGroupNode
  processedApplicants: InternalGroupPositionPriorityNode[]
  applicantsOpenForOtherPositions: ApplicantNode[]
  applicants: ApplicantNode[]
}

// === Query typings ===

export interface InternalGroupDiscussionDataReturns {
  internalGroupDiscussionData: InternalGroupDiscussionData
}

// === Mutation typings ====

export interface PatchInternalGroupPositionPriorityReturns {
  internalGroupPositionPriority: InternalGroupPositionPriorityNode
}
