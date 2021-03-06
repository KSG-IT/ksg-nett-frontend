import { InternalGroupNode } from 'modules/organization/types'
import { ApplicantNode, InternalGroupPositionPriorityNode } from '../types'

export type InternalGroupDiscussionData = {
  availablePicks: InternalGroupPositionPriorityNode[]
  currentApplicantUnderDiscussion: ApplicantNode
  internalGroup: InternalGroupNode
  processedApplicants: InternalGroupPositionPriorityNode[]
}

// === Query typings ===

export interface InternalGroupDiscussionDataReturns {
  internalGroupDiscussionData: InternalGroupDiscussionData
}

// === Mutation typings ====

export interface PatchInternalGroupPositionPriorityReturns {
  internalGroupPositionPriority: InternalGroupPositionPriorityNode
}
