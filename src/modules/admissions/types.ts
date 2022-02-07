import { InternalGroupPositionNode } from 'modules/organization/types'

export type ApplicantStatus =
  | 'EMAIL_SENT'
  | 'HAS_REGISTERED_PROFILE'
  | 'SCHEDULED_INTERVIEW'
  | 'INTERVIEW_FINISHED'
  | 'DID_NOT_SHOW_UP_FOR_INTERVIEW'
  | 'TO_BE_CALLED'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'RETRACTED_APPLICATION'

export type AdmissionAvailableInternalGroupPositionData = {
  id: string
  internalGroupPosition: Pick<InternalGroupPositionNode, 'id' | 'name'>
  availablePositions: number
}

export type ApplicantNode = {
  id: string
  status: ApplicantStatus
  email: string
  fullName: string
  firstName: string
  lastName: string
}

export type AdmissionNode = {
  date: Date
  semester: `${'H' | 'V'}${number}`
  status: 'OPEN' | 'CLOSED' | 'IN_SESSION'
  availableInternalGroupPositions: AdmissionAvailableInternalGroupPositionData[]
  applicants: ApplicantNode[]
}

/* === QUERY TYPING === */
export interface ActiveAdmissioneturns {
  activeAdmission: AdmissionNode | null
}

export interface GetApplicantFromTokenVariables {
  token: string
}

export interface GeApplicantFromTokenReturns {
  getApplicantFromToken: ApplicantNode
}

/* === MUTATION TYPING === */

export interface CreateAdmissionReturns {
  admission: AdmissionNode
}

export interface CreateAdmissionVariables {
  supplementaryAdmission: boolean
}

export interface CreateApplicationsReturns {
  ok: boolean
  applicationsCreated: number
}

export interface CreateApplicationsVariables {
  emails: string[]
}

export interface ReSendApplicationTokenReturns {
  ok: boolean
}

export interface ReSendApplicationTokenVariables {
  email: string
}

export type PatchApplicantInput = {
  firstName?: string
  lastName?: string
  phone?: string
  study?: string
  dateOfBirth?: string
  address?: string
  hometown?: string
  image?: File
  status?: ApplicantStatus
}

export interface PatchApplicantReturns {
  applicant: Pick<ApplicantNode, 'id'>
}
export interface PatchApplicantVariables {
  id: string
  input: PatchApplicantInput
}
