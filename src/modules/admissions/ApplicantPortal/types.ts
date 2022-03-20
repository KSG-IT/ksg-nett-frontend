import { InternalGroupNode } from 'modules/organization/types'
import { ApplicantNode } from '../types'

export type InterviewSlot = {
  interviewStart: Date
  interviewIds: string[]
}

export type AvailableInterviewsDayGrouping = {
  date: Date
  interviewSlots: InterviewSlot[]
}

/* === Query typing === */

export interface InterviewsAvailableForBookingReturns {
  interviewsAvailableForBooking: AvailableInterviewsDayGrouping[]
}

export interface InterviewsAvailableForBookingVariables {
  requestMoreInterviewsOffset: Date
}

export interface GetApplicantFromTokenVariables {}

export interface GetApplicantFromTokenReturns {
  applicant: ApplicantNode
}

// === Mutation typing ===

export interface AddInternalGroupPositionPriorityReturns {
  success: boolean
}

export interface AddInternalGroupPositionPriorityVariables {
  internalGroupPositionId: string
  applicantId: string
}

export interface InternalGroupPositionsAvailableForApplicantReturns {
  internalGroupPositionsAvailableForApplicants: Pick<
    InternalGroupNode,
    'id' | 'name'
  >[]
}
