import {
  InternalGroupNode,
  InternalGroupPositionNode,
} from 'modules/organization/types'
import { UserNode, UserThumbnailProps } from 'modules/users/types'
import {
  AdmissionStatusValues,
  ApplicantStatusValues,
  InternalGroupPositionPriorityApplicantPriorityValues,
  InternalGroupPositionPriorityInternalGroupPriorityValues,
  InterviewAdditionalEvaluationAnswerValues,
  InterviewTotalEvaluationValues,
  NoticeMethodValues,
} from './consts'

// === Node types ===

export type InterviewAdditionalEvaluationStatementNode = {
  id: string
  statement: string
  order: number
}

export type InterviewNode = {
  id: string
  interviewStart: string
  interviewEnd: string
  interviewers: UserThumbnailProps['user'][]
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
    | 'status'
    | 'phone'
    | 'email'
  >
  totalEvaluation: InterviewTotalEvaluationValues | null
  priorities: InternalGroupPositionPriority[]
  registeredAtSamfundet: boolean
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

export type InterviewOverviewTableData = {
  id: string
  interviewRows: InterviewLocationOverviewRow[]
  locations: string[]
  timestampHeader: string[]
}

export type InterviewLocationOverviewRow = {
  id: string
  location: string
  interviews: InterviewOverviewCell[]
}

export type InterviewOverviewCell = {
  time: string
  content: string
  applicantId: string
  interviewId: string
  color: string
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
  membershipType: 'FUNCTIONARY' | 'GANG_MEMBER'
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

export type ApplicantCommentNode = {
  id: string
  text: string
  createdAt: Date
  user: UserThumbnailProps['user']
}

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
  interviewers: UserThumbnailProps['user'][]
  wantsDigitalInterview: boolean
  willBeAdmitted: boolean
  canCommitThreeSemesters: boolean
  openForOtherPositions: boolean
  gdprConsent: boolean
  internalGroupInterests: ApplicantInterestNode[]
  comments: ApplicantCommentNode[]

  lastActivity: Date | null
  lastNotice: Date | null
  noticeMethod: NoticeMethodValues | null
  noticeComment: string
  noticeUser: UserThumbnailProps['user'] | null
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
  wantsDigitalInterview: boolean
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
  interviewBookingLateBatchEnabled: boolean
  interviewBookingOverrideEnabled: boolean
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

export interface interviewPeriodDatesNode {
  startDate: Date
  endDate: Date
}

/* === QUERY TYPING === */

export interface ActiveAdmissioneturns {
  activeAdmission: Pick<
    AdmissionNode,
    | 'id'
    | 'availableInternalGroupPositionsData'
    | 'status'
    | 'interviewBookingLateBatchEnabled'
    | 'interviewBookingOverrideEnabled'
  > | null
}

export interface InterviewTableOverviewReturns {
  interviewTableOverview: InterviewOverviewTableData
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

export interface InterviewsAvailableForBookingReturns {
  interviewsAvailableForBooking: AvailableInterviewsDayGrouping[]
}

export interface InterviewsAvailableForBookingVariables {
  requestMoreInterviewsOffset: Date
}

export interface InterviewPeriodDatesReturns {
  interviewPeriodDates: interviewPeriodDatesNode
}
export interface GetApplicantFromTokenVariables {}

export interface GetApplicantFromTokenReturns {
  applicant: ApplicantNode
}

export interface AllAvailableInterviewsReturns {
  allAvailableInterviews: Pick<
    InterviewNode,
    'id' | 'location' | 'interviewStart' | 'interviewEnd'
  >[]
}

export interface AllApplicantsAvailableForRebookingReturns {
  allApplicantsAvailableForRebooking: Pick<
    ApplicantNode,
    'id' | 'fullName' | 'email' | 'phone' | 'status'
  >[]
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
    defaultInterviewNotes: string
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

export interface FinishedInterviewsReturns {
  finishedInterviews: Pick<
    InterviewNode,
    'id' | 'registeredAtSamfundet' | 'applicant' | 'location' | 'interviewStart'
  >[]
}

export interface InterviewStatisticsReturns {
  interviewStatistics: {
    totalApplicants: number
    totalFinishedInterviews: number
    totalBookedInterviews: number
    totalAvailableInterviews: number
    userInterviewCounts: {
      interviewCount: number
      user: Pick<UserNode, 'id' | 'getFullWithNickName'>
    }[]
  }
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

  lastActivity?: Date | null
  lastNotice?: Date | null
  noticeComment?: string
  noticeMethod?: NoticeMethodValues | null
  noticeUser?: string
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

export type CreateApplicantCommentInput = {
  applicant: string
  text: string
}

export interface CreateApplicantCommentVariables {
  input: CreateApplicantCommentInput
}

export interface CreateApplicantCommentReturns {
  applicantComment: Pick<ApplicantCommentNode, 'id'>
}

export interface ReSendApplicationTokenReturns {
  ok: boolean
}

export interface ReSendApplicationTokenVariables {
  email: string
}

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

export interface PatchInterviewScheduleTemplateVariables {
  id: string
  input: {
    defaultBlockSize?: number
    defaultInterviewDuration?: string
    defaultPauseDuration?: string
    defaultInterviewDayStart?: string
    defaultInterviewDayEnd?: string
    defaultInterviewNotes?: string
    interviewPeriodStartDate?: string
    interviewPeriodEndDate?: string
  }
}

export interface PatchAdmissionAvailableInternalGroupPositionDataReturns {
  patchAdmissionAvailableInternalGroupPositionData: {
    admissionAvailableInternalGroupPositionData: Pick<
      AdmissionAvailableInternalGroupPositionData,
      'id' | 'availablePositions' | 'membershipType'
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

export interface ApplicantAddInternalGroupPositionPriorityVariables {
  internalGroupPositionId: string
  token: string
}

export interface ApplicantDeleteInternalGroupPositionPriorityReturns {
  success: boolean
}

export interface ApplicantDeleteInternalGroupPositionPriorityVariables {
  internalGroupPositionId: string
  token: string
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

export interface UpdateInternalGroupPositionPriorityOrderReturns {
  priorityOrder: Pick<InternalGroupPositionPriorityNode, 'id'>[]
}

export interface UpdateInternalGroupPositionPriorityOrderVariables {
  applicantId: string
  priorityOrder: string[]
}

export interface ApplicantUpdateInternalGroupPositionPriorityOrderVariables {
  applicantId: string
  priorityOrder: string[]
  token: string
}

export interface UpdateInternalGroupPositionPriorityOrderReturns {
  success: boolean
}

export interface AssignApplicantNewInterviewReturns {
  success: boolean
}

export interface AssignApplicantNewInterviewVariables {
  applicantId: string
  interviewId: string
}

type CreateInterviewInput = {
  location: string
  interviewStart: string
  interviewEnd: string
}

export interface CreateInterviewVariables {
  input: CreateInterviewInput
}

export interface CreateInterviewReturns {
  createInterview: {
    interview: Pick<InterviewNode, 'id'>
  }
}

export interface RemoveApplicantFromInterviewReturns {
  interview: Pick<InterviewNode, 'id'>
}

export interface RemoveApplicantFromInterviewVariables {
  interviewId: string
}
