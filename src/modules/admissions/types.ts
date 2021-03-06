import {
  InternalGroupNode,
  InternalGroupPositionNode,
} from 'modules/organization/types'
import { UserNode } from 'modules/users'
import { CoreApplicantNode } from './InternalGroupApplicants/types'

export type InterviewLocationNode = {
  id: string
  name: string
  availability: InterviewLocationAvailabilityNode[]
  locationDescription: string
}

export type InterviewLocationAvailabilityNode = {
  id: string
  datetimeFrom: Date
  datetimeTo: Date
}

export type BooleanEvaluationAnswer = {
  statement: string
  answer: boolean
}

export type AdditionalEvaluationAnswer = {
  statement: string
  answer: boolean
}

export type InterviewNode = {
  id: string
  interviewStart: Date
  interviewEnd: Date
  interviewers: Pick<UserNode, 'id' | 'initials' | 'profileImage'>[]
  location: Pick<InterviewLocationNode, 'id' | 'name' | 'locationDescription'>
  notes: string
  discussion: string
  booleanEvaluationAnswers: BooleanEvaluationAnswer[]
  additionalEvaluationAnswers: AdditionalEvaluationAnswer[]
  totalEvaluation: 'VERY_GOOD' | 'GOOD' | 'MEDIUM' | 'POOR' | 'VERY_POOR'
  canCommitThreeSemesters: boolean
  cannotCommitThreeSemestersDetails: string | null
}

export type InterviewNodeShallow = Pick<InterviewNode, 'id'>

export type ApplicantStatus =
  | 'EMAIL_SENT'
  | 'HAS_REGISTERED_PROFILE'
  | 'HAS_SET_PRIORITIES'
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
  __typename: string
}

export type ApplicantPriority = 'FIRST' | 'SECOND' | 'THIRD'

export type InternalGroupPriority =
  | 'WANT'
  | 'DO_NOT_WANT'
  | 'RESERVE'
  | 'SHOULD_BE_ADMITTED'
  | 'PASS_AROUND'
  | null

export type InternalGroupPositionPriorityNode = {
  id: string
  internalGroupPosition: Pick<
    InternalGroupPositionNode,
    'id' | 'name' | 'internalGroup'
  >
  applicantPriority: ApplicantPriority
  internalGroupPriority: InternalGroupPriority
  applicant: ApplicantNode
}

export type InternalGroupPositionPriorityArray =
  InternalGroupPositionPriorityNode | null

export type ApplicantNode = {
  id: string
  status: ApplicantStatus
  email: string
  fullName: string
  firstName: string
  lastName: string
  image: string | File
  dateOfBirth: Date | string
  priorities: InternalGroupPositionPriorityArray[]
  interview: InterviewNode | null
  interviewers: Pick<UserNode, 'id' | 'profileImage' | 'initials'>
  willBeAdmitted: boolean
}

export type AdmissionStatus =
  | 'CONFIGURATION'
  | 'OPEN'
  | 'CLOSED'
  | 'IN_SESSION'
  | 'LOCKED'

export type AdmissionNode = {
  id: string
  date: Date
  semester: `${'H' | 'V'}${number}`
  status: AdmissionStatus
  availableInternalGroupPositionsData: AdmissionAvailableInternalGroupPositionData[]
  applicants: ApplicantNode[]
}

export type InterviewScheduleTemplateNode = {
  id: string
  interviewPeriodStartDate: Date
  defaultInterviewDayStart: string
  interviewPeriodEndDate: Date
  defaultInterviewDayEnd: string
  defaultInterviewDuration: string
  defaultBlockSize: number
  defaultPauseDuration: string
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

export interface InterviewConfigQueryReturns {
  allInterviewScheduleTemplates: InterviewScheduleTemplateNode[]
  allInterviewLocations: InterviewLocationNode[]
}

export interface AllInterviewLocationsReturns {
  allInterviewLocations: InterviewLocationNode[]
}

export interface ApplicantQueryReturns {
  applicant: ApplicantNode | null
}

export interface ApplicantQueryVariables {
  id: string
}

export interface InternalGroupsAcceptingApplicantsReturns {
  internalGroupsAcceptingApplicants: Pick<InternalGroupNode, 'id' | 'name'>[]
}

export type InternalGroupApplicantData = {
  internalGroup: Pick<InternalGroupNode, 'id' | 'name'>
  positionsToFill: number
  currentProgress: number
  firstPriorities: CoreApplicantNode[]
  secondPriorities: CoreApplicantNode[]
  thirdPriorities: CoreApplicantNode[]
}

export interface AllInternalGroupsAcceptingApplicantsReturns {
  allInternalGroupApplicantData: InternalGroupApplicantData[]
}

/* === MUTATION TYPING === */

export interface CreateAdmissionReturns {
  admission: AdmissionNode
}

export type CreateAdmissionInput = {
  status?: AdmissionStatus
  availableInternalGroupPositions?: any[]
}
export interface CreateAdmissionVariables {
  input: CreateAdmissionInput
}

export type PatchAdmissionInput = Partial<Omit<AdmissionNode, 'id'>>

export interface PatchAdmissionReturns {
  patchAdmission: {
    admission: Pick<AdmissionNode, 'id'>
  }
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

export type PatchApplicantInput = Partial<Omit<ApplicantNode, 'id'>>

export interface PatchApplicantReturns {
  applicant: Pick<ApplicantNode, 'id'>
}
export interface PatchApplicantVariables {
  id: string
  input: PatchApplicantInput
}

export type PatchInterviewScheduleTemplateInput = Partial<
  Omit<InterviewScheduleTemplateNode, 'id'>
>
