import {
  AdmissionAvailableInternalGroupPositionData,
  InterviewLocationAvailabilityNode,
  InterviewLocationNode,
  InterviewNode,
  InterviewScheduleTemplateNode,
} from 'modules/admissions/types'

// === Object types ==== //
export type WizardStage =
  | 'START'
  | 'SCHEDULE'
  | 'INTERVIEW_LOCATION_AVAILABILITY'
  | 'INTERVIEW_TEMPLATE'
  | 'AVAILABLE_POSITIONS'
  | 'SUMMARY'
  | null

export type CreateInterviewLocationAvailabilityInput = {
  interviewLocation: string
  datetimeFrom: Date
  datetimeTo: Date
}

export type CreateInterviewLocationInput = {
  name: string
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

export type InterviewBooleanEvaluationNode = {
  id: string
  statement: string
  order: number
}

export type InterviewAdditionalEvaluationStatementNode = {
  id: string
  statement: string
  order: number
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
      'id' | '__typename' | 'availablePositions'
    >
  }
}
