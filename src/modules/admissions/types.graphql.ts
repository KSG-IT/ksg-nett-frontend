import {
  InternalGroupNode,
  InternalGroupPositionNode,
} from 'modules/organization/types'
import { UserNode } from 'modules/users'
import {
  AdmissionStatusValues,
  ApplicantStatusValues,
  InternalGroupPositionPriorityApplicantPriorityValues,
  InternalGroupPositionPriorityInternalGroupPriorityValues,
  InterviewAdditionalEvaluationAnswerValues,
  InterviewTotalEvaluationValues,
} from './consts'

// === Node types ===

export type InterviewAdditionalEvaluationStatementNode = {
  id: string
  statement: string
  order: number
}

export type InterviewNode = {
  id: string
  interviewStart: Date
  interviewEnd: Date
  interviewers: Pick<UserNode, 'id' | 'initials' | 'profileImage'>[]
  location: Pick<InterviewLocationNode, 'id' | 'name' | 'locationDescription'>
  notes: string
  discussion: string
  booleanEvaluationAnswers: InterviewBooleanEvaluationAnswerNode[]
  additionalEvaluationAnswers: InterviewAdditionalEvaluationAnswerNode[]

  applicant: Pick<
    ApplicantNode,
    | 'id'
    | 'fullName'
    | 'canCommitThreeSemesters'
    | 'openForOtherPositions'
    | 'priorities'
  >
  totalEvaluation: InterviewTotalEvaluationValues | null
  priorities: InternalGroupPositionPriority[]
}

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

export type InterviewBooleanEvaluationNode = {
  id: string
  statement: string
}

export type InterviewBooleanEvaluationAnswerNode = {
  id: string
  statement: Pick<InterviewBooleanEvaluationNode, 'statement' | 'id'>
  value: boolean | null
}

export type InterviewAdditionalEvaluationAnswerNode = {
  id: string
  statement: {
    id: string
    statement: string
  }
  // Should probably be renamed to evaluation or value
  answer: InterviewAdditionalEvaluationAnswerValues | null
}

export type AdmissionAvailableInternalGroupPositionData = {
  id: string
  internalGroupPosition: Pick<InternalGroupPositionNode, 'id' | 'name'>
  availablePositions: number
}

export type InternalGroupPositionPriorityNode = {
  id: string
  internalGroupPosition: Pick<
    InternalGroupPositionNode,
    'id' | 'name' | 'internalGroup'
  >
  applicantPriority: InternalGroupPositionPriorityApplicantPriorityValues
  internalGroupPriority: InternalGroupPositionPriorityInternalGroupPriorityValues
  applicant: ApplicantNode
}

export type InternalGroupPositionPriority =
  InternalGroupPositionPriorityNode | null

export type ApplicantNode = {
  id: string
  status: ApplicantStatusValues
  email: string
  fullName: string
  firstName: string
  lastName: string
  address: string
  phone: string
  hometown: string
  study: string
  image: string
  dateOfBirth: Date | string
  priorities: InternalGroupPositionPriority[]
  interview: InterviewNode | null
  interviewers: Pick<UserNode, 'id' | 'profileImage' | 'initials'>
  willBeAdmitted: boolean
  canCommitThreeSemesters: boolean
  openForOtherPositions: boolean
  internalGroupInterests: ApplicantInterestNode[]
}

export type ApplicantCSVData = {
  fullName: string
  firstName: string
  lastName: string
  phone: string
  email: string
}

// Shiuld be renamed. Implies a Shallow type but we are
// starting to have a lot of custom fields?
export type CoreApplicantNode = {
  id: string
  status: ApplicantStatusValues
  email: string
  fullName: string
  image: string | File
  dateOfBirth: Date | string
  interview: InterviewNode | null
  interviewerFromInternalGroup: string | null
  interviewIsCovered: boolean
  iAmAttendingInterview: boolean
  phone: string
  priorities: InternalGroupPositionPriority[]
}

export type ApplicantInterestNode = {
  id: string
  applicant: Pick<ApplicantNode, 'id' | 'fullName'>
  internalGroup: Pick<InternalGroupNode, 'id' | 'name'>
  positionToBeOffered: Pick<InternalGroupPositionNode, 'id' | 'name'> | null
}

export type AdmissionNode = {
  id: string
  date: Date
  semester: `${'H' | 'V'}${number}`
  status: AdmissionStatusValues
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
  activeAdmission: Pick<
    AdmissionNode,
    'id' | 'availableInternalGroupPositionsData' | 'status'
  > | null
}

export interface CurrentApplicantsReturns {
  currentApplicants: CoreApplicantNode[]
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

export interface InterviewDetailQueryReturns {
  interview: InterviewNode | null
}

export interface InterviewDetailQueryVariables {
  id: string
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

// === Query typings ===

export interface InternalGroupDiscussionDataReturns {
  internalGroupDiscussionData: InternalGroupDiscussionData
}

// === Query typing === //
export interface InterviewOverviewReturns {
  interviewOverview: InterviewOverview
  interviewScheduleTemplate: InterviewScheduleTemplateNode
}

export interface InterviewTemplateReturns {
  interviewTemplate: {
    interviewBooleanEvaluationStatements: Pick<
      InterviewBooleanEvaluationNode,
      'id' | 'statement'
    >[]

    interviewAdditionalEvaluationStatements: Pick<
      InterviewAdditionalEvaluationStatementNode,
      'id' | 'statement'
    >[]
  }
}

export type InterviewLocationDateGrouping = {
  name: string
  interviews: Pick<InterviewNode, 'id' | 'interviewStart' | 'interviewEnd'>[]
}

export type InterviewDay = {
  date: Date
  locations: InterviewLocationDateGrouping[]
}

export type InterviewOverview = {
  interviewCount: number
  admissionId: string
  interviewDayGroupings: InterviewDay[]
}

export interface InternalGroupApplicantsDataReturns {
  internalGroupApplicantsData: {
    internalGroup: Pick<InternalGroupNode, 'id' | 'name'>
    positionsToFill: number
    currentProgress: number
    firstPriorities: CoreApplicantNode[]
    secondPriorities: CoreApplicantNode[]
    thirdPriorities: CoreApplicantNode[]
  }
}

export type InterviewSlot = {
  interviewStart: Date
  interviewIds: string[]
}

export type AvailableInterviewsDayGrouping = {
  date: Date
  interviewSlots: InterviewSlot[]
}

/* === MUTATION TYPING === */

export interface CreateAdmissionReturns {
  admission: AdmissionNode
}

export type CreateAdmissionInput = {
  status?: AdmissionStatusValues
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

export type PatchApplicantInput = {
  firstName?: string
  lastName?: string
  phone?: string
  address?: string
  homeTown?: string

  status?: ApplicantStatusValues
  canCommitThreeSemesters?: boolean | null
  openForOtherPositions?: boolean | null
}

export interface PatchApplicantVariables {
  id: string
  input: PatchApplicantInput
}
export interface PatchApplicantReturns {
  applicant: {
    id: string
  }
}

export interface ReSendApplicationTokenReturns {
  ok: boolean
}

export interface ReSendApplicationTokenVariables {
  email: string
}

export type PatchInterviewScheduleTemplateInput = Partial<
  Omit<InterviewScheduleTemplateNode, 'id'>
>

export type PatchInterviewBooleanEvaluationAnswerInput = {
  value: boolean
}

export interface PatchInterviewBooleanEvaluationAnswerReturns {
  interviewBooleanEvaluationAnswer: Pick<
    InterviewBooleanEvaluationAnswerNode,
    'id'
  >
}

type PatchInterviewAdditionalEvaluationAnswerInput = {
  answer: InterviewAdditionalEvaluationAnswerNode['answer']
}

export interface PatchInterviewAdditionalEvaluationAnswerReturns {
  interviewAdditionalEvaluationAnswer: Pick<
    InterviewAdditionalEvaluationAnswerNode,
    'id'
  >
}

export interface PatchInterviewAdditionalEvaluationAnswerVariables {
  id: string
  input: PatchInterviewAdditionalEvaluationAnswerInput
}

export type CreateInterviewLocationAvailabilityInput = {
  interviewLocation: string
  datetimeFrom: Date
  datetimeTo: Date
}

export type CreateInterviewLocationInput = {
  name: string
}

// === Mutation typing === //
export interface CreateInterviewLocationAvailabilityVariables {
  input: CreateInterviewLocationAvailabilityInput
}

export interface CreateInterviewLocationAvailabilityReturns {
  interviewLocationAvailability: Pick<InterviewLocationAvailabilityNode, 'id'>
}

export interface CreateInterfaceLocationVariables {
  input: CreateInterviewLocationInput
}

export interface CreateInterviewLocationReturns {
  createInterviewLocation: {
    interviewLocation: Pick<InterviewLocationNode, 'id' | 'name'>
  }
}
export interface CreateInterviewLocationVariables {
  input: {
    name: string
  }
}

export interface PatchInterviewScheduleTemplateReturns {
  patchInterviewScheduleTemplate: {
    interviewScheduleTemplate: {
      id: string
    }
  }
}

export interface PatchAdmissionAvailableInternalGroupPositionDataReturns {
  patchAdmissionAvailableInternalGroupPositionData: {
    admissionAvailableInternalGroupPositionData: Pick<
      AdmissionAvailableInternalGroupPositionData,
      'id' | 'availablePositions'
    >
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

export type InternalGroupDiscussionData = {
  internalGroup: InternalGroupNode
  processedApplicants: InternalGroupPositionPriorityNode[]
  applicantsOpenForOtherPositions: ApplicantNode[]
  applicants: ApplicantNode[]
}

// === Mutation typings ====

export interface PatchInternalGroupPositionPriorityReturns {
  internalGroupPositionPriority: InternalGroupPositionPriorityNode
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

export interface CreateApplicantsFromCSVDataReturns {
  ok: boolean
}
export interface CreateApplicantsFromCSVDataVariables {
  applicants: ApplicantCSVData[]
}
