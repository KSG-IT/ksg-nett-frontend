import { ApplicantStatus, InterviewNode } from '../types'

export type CoreApplicantNode = {
  id: string
  status: ApplicantStatus
  email: string
  fullName: string
  image: string | File
  dateOfBirth: Date | string
  interview: InterviewNode | null
  interviewerFromInternalGroup: string | null
  phone: string
}

export interface InternalGroupApplicantsDataReturns {
  internalGroupApplicantsData: {
    internalGroupName: string
    firstPriorities: CoreApplicantNode[]
    secondPriorities: CoreApplicantNode[]
    thirdPriorities: CoreApplicantNode[]
  }
}
export interface InternalGroupApplicantsDataVariables {
  internalGroup: string
}

// === Mutation typing ===
export interface SetSelfAsInterviewerMutatationReturns {
  setSelfAsInterviewer: {
    success: boolean
  }
}
export interface SetSelfAsInterviewerMutatationVariables {
  interviewId: string
}
