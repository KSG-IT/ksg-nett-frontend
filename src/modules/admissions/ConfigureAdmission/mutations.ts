import { gql } from 'graphql-tag'

export const CREATE_INTERVIEW_LOCATION_AVAILABILITY = gql`
  mutation CreateInterviewLocationAvailability(
    $input: CreateInterviewLocationAvailabilityInput!
  ) {
    createInterviewLocationAvailability(input: $input) {
      interviewLocationAvailability {
        id
      }
    }
  }
`

export const CREATE_INTERVIEW_LOCATION = gql`
  mutation CreateInterviewLocation($input: CreateInterviewLocationInput!) {
    createInterviewLocation(input: $input) {
      interviewLocation {
        id
        name
      }
    }
  }
`

export const DELETE_INTERVIEW_LOCATION = gql`
  mutation DeleteInterviewLocation($id: ID!) {
    deleteInterviewLocation(id: $id) {
      found
    }
  }
`

export const DELETE_INTERVIEW_LOCATION_AVAILABILITY = gql`
  mutation DeleteInterviewLocationAvailability($id: ID!) {
    deleteInterviewLocationAvailability(id: $id) {
      found
    }
  }
`

export const GENERATE_INTERVIEWS = gql`
  mutation GenerateInterviews {
    generateInterviews {
      ok
      interviewsGenerated
    }
  }
`

export const DELETE_ALL_INTERVIEWS = gql`
  mutation DeleteAllInterviews {
    deleteAllInterviews {
      count
    }
  }
`

export const PATCH_INTERVIEW_SCHEDULE_TEMPLATE = gql`
  mutation PatchInterviewScheduleTemplate(
    $id: ID!
    $input: PatchInterviewScheduleTemplateInput!
  ) {
    patchInterviewScheduleTemplate(id: $id, input: $input) {
      interviewScheduleTemplate {
        id
      }
    }
  }
`

export const CREATE_INTERVIEW_BOOLEAN_EVALUATION = gql`
  mutation CreateInterviewBooleanEvaluation(
    $input: CreateInterviewBooleanEvaluationInput!
  ) {
    createInterviewBooleanEvaluation(input: $input) {
      interviewBooleanEvaluation {
        id
      }
    }
  }
`
export const PATCH_INTERVIEW_BOOLEAN_EVALUATION = gql`
  mutation InterviewBooleanEvaluation(
    $id: ID!
    $input: PatchInterviewBooleanEvaluationInput
  ) {
    patchInterviewBooleanEvaluation(id: $id, input: $input) {
      interviewBooleanEvaluation {
        id
      }
    }
  }
`
export const DELETE_INTERVIEW_BOOLEAN_EVALUATION = gql`
  mutation DeleteInterviewBooleanEvaluation($id: ID!) {
    deleteInterviewBooleanEvaluation(id: $id) {
      found
    }
  }
`

export const CREATE_INTERVIEW_ADDITIONAL_EVALUATION_STATEMENT = gql`
  mutation CreateInterviewAdditionalEvaluationStatement(
    $input: CreateInterviewAdditionalEvaluationStatementInput!
  ) {
    createInterviewAdditionalEvaluationStatement(input: $input) {
      interviewAdditionalEvaluationStatement {
        id
      }
    }
  }
`

export const PATCH_INTERVIEW_ADDITIONAL_EVALUATION_STATEMENT = gql`
  mutation PatchInterviewAdditionalEvaluationStatement(
    $id: ID!
    $input: PatchInterviewAdditionalEvaluationStatementInput!
  ) {
    patchInterviewAdditionalEvaluationStatement(id: $id, input: $input) {
      interviewAdditionalEvaluationStatement {
        id
      }
    }
  }
`

export const DELETE_INTERVIEW_ADDITIONAL_EVALUATION_STATEMENT = gql`
  mutation DeleteInterviewAdditionalEvaluationStatement($id: ID!) {
    deleteInterviewAdditionalEvaluationStatement(id: $id) {
      interviewAdditionalEvaluationStatement {
        found
      }
    }
  }
`

export const PATCH_ADMISSION_AVAILABLE_INTERNAL_GROUP_POSITION_DATA = gql`
  mutation PatchAdmissionAvailableInternalGroupPositionData(
    $id: ID!
    $input: PatchAdmissionAvailableInternalGroupPositionDataInput!
  ) {
    patchAdmissionAvailableInternalGroupPositionData(id: $id, input: $input) {
      admissionAvailableInternalGroupPositionData {
        id
        availablePositions
        __typename
      }
    }
  }
`

export const CREATE_ADMISSION_AVAILABLE_INTERNAL_GROUP_POSITION_DATA = gql`
  mutation CreateAdmissionAvailableInternalGroupPositionData(
    $input: CreateAdmissionAvailableInternalGroupPositionDataInput!
  ) {
    createAdmissionAvailableInternalGroupPositionData(input: $input) {
      admissionAvailableInternalGroupPositionData {
        id
        availablePositions
        __typename
      }
    }
  }
`

export const DELETE_ADMISSION_AVAILABLE_INTERNAL_GROUP_POSITION_DATA = gql`
  mutation DeleteAdmissionAvailableInternalGroupPositionData($id: ID!) {
    deleteAdmissionAvailableInternalGroupPositionData(id: $id) {
      found
    }
  }
`
