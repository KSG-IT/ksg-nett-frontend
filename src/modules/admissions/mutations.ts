import { gql } from 'graphql-tag'

export const CREATE_ADMISSION = gql`
  mutation CreateAdmission($input: CreateAdmissionInput!) {
    createAdmission(input: $input) {
      admission {
        id
      }
    }
  }
`

export const PATCH_ADMISSION = gql`
  mutation PatchAdmission($id: ID!, $input: PatchAdmissionInput!) {
    patchAdmission(id: $id, input: $input) {
      admission {
        id
      }
    }
  }
`

export const CREATE_APPLICATIONS = gql`
  mutation CreateApplications($emails: [String]) {
    createApplications(emails: $emails) {
      ok
      applicationsCreated
    }
  }
`

export const UPLOAD_APPLICANTS_FILE_MUTATION = gql`
  mutation UploadApplicantsCsv($applicantsFile: Upload!) {
    uploadApplicantsCsv(applicantsFile: $applicantsFile) {
      validApplicants {
        fullName
        firstName
        lastName
        phone
        email
      }
    }
  }
`

export const CREATE_APPLICANTS_FROM_CSV_DATA_MUTATION = gql`
  mutation CreateApplicantsFromCsvData($applicants: [ApplicantCSVDataInput!]!) {
    createApplicantsFromCsvData(applicants: $applicants) {
      ok
    }
  }
`

export const UPDATE_INTERNAL_GROUP_POSITION_PRIORITY_ORDER_MUTATION = gql`
  mutation UpdateInternalGroupPositionPriorityOrder(
    $applicantId: ID!
    $priorityOrder: [ID!]!
  ) {
    updateInternalGroupPositionPriorityOrder(
      applicantId: $applicantId
      priorityOrder: $priorityOrder
    ) {
      internalGroupPositionPriorities {
        id
      }
    }
  }
`

export const APPLICANT_UPDATE_INTERNAL_GROUP_POSITION_PRIORITY_ORDER_MUTATION = gql`
  mutation ApplicantUpdateInternalGroupPositionPriorityOrder(
    $priorityOrder: [ID!]!
    $token: String!
  ) {
    applicantUpdateInternalGroupPositionPriorityOrder(
      priorityOrder: $priorityOrder
      token: $token
    ) {
      internalGroupPositionPriorities {
        id
      }
    }
  }
`
export const RE_SEND_APPLICATION_TOKEN = gql`
  mutation ReSendApplicationToken($email: String!) {
    reSendApplicationToken(email: $email) {
      ok
    }
  }
`

export const PATCH_INTERVIEW_ADDITIONAL_EVALUATION_ANSWER = gql`
  mutation PatchInterviewAdditionalEvaluationAnswer(
    $id: ID!
    $input: PatchInterviewAdditionalEvaluationAnswerInput!
  ) {
    patchInterviewAdditionalEvaluationAnswer(id: $id, input: $input) {
      interviewAdditionalEvaluationAnswer {
        id
      }
    }
  }
`

export const PATCH_INTERVIEW_BOOLEAN_EVALUATION_ANSWER = gql`
  mutation PatchInterviewBooleanEvaluationAnswer(
    $id: ID!
    $input: PatchInterviewBooleanEvaluationAnswerInput!
  ) {
    patchInterviewBooleanEvaluationAnswer(id: $id, input: $input) {
      interviewBooleanEvaluationAnswer {
        id
      }
    }
  }
`

export const CLOSE_ADMISSION_MUTATION = gql`
  mutation CloseAdmissionMutation {
    closeAdmission {
      failedUserGeneration {
        id
        fullName
      }
    }
  }
`

export const LOCK_ADMISSION_MUTATION = gql`
  mutation LockAdmissionMutation {
    lockAdmission {
      admission {
        id
      }
    }
  }
`

export const PATCH_INTERNAL_GROUP_POSITION_PRIORITY = gql`
  mutation PatchInternalGroupPositionPriority(
    $id: ID!
    $input: PatchInternalGroupPositionPriorityInput!
  ) {
    patchInternalGroupPositionPriority(id: $id, input: $input) {
      internalGroupPositionPriority {
        id
      }
    }
  }
`

export const BOOK_INTERRVIEW_MUTATION = gql`
  mutation BookInterviewMutation(
    $interviewIds: [ID]
    $applicantToken: String!
  ) {
    bookInterview(
      interviewIds: $interviewIds
      applicantToken: $applicantToken
    ) {
      ok
    }
  }
`

export const ADD_INTERNAL_GROUP_POSITION_PRIORITY = gql`
  mutation AddInternalGroupPositionPriority(
    $internalGroupPositionId: ID!
    $applicantId: ID!
  ) {
    addInternalGroupPositionPriority(
      internalGroupPositionId: $internalGroupPositionId
      applicantId: $applicantId
    ) {
      success
    }
  }
`

export const APPLICANT_ADD_INTERNAL_GROUP_POSITION_PRIORITY = gql`
  mutation ApplicantAddInternalGroupPositionPriority(
    $internalGroupPositionId: ID!
    $token: String!
  ) {
    applicantAddInternalGroupPositionPriority(
      internalGroupPositionId: $internalGroupPositionId
      token: $token
    ) {
      success
    }
  }
`

// export const CHANGE_INTERNAL_GROUP_PRIORITY_ORDER = gql``

export const DELETE_INTERNAL_GROUP_POSITION_PRIORITY = gql`
  mutation DeleteInternalGroupPositionPriority($id: ID!) {
    deleteInternalGroupPositionPriority(id: $id) {
      found
    }
  }
`

export const APPLICANT_DELETE_INTERNAL_GROUP_POSITION_PRIORITY = gql`
  mutation ApplicantDeleteInternalGroupPositionPriority(
    $internalGroupPositionId: ID!
    $token: String!
  ) {
    applicantDeleteInternalGroupPositionPriority(
      internalGroupPositionId: $internalGroupPositionId
      token: $token
    ) {
      success
    }
  }
`

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
      found
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

export const SET_SELF_AS_INTERVIEWER = gql`
  mutation SetSelfAsInterviewerMutation($interviewId: ID!) {
    setSelfAsInterviewer(interviewId: $interviewId) {
      success
    }
  }
`

export const REMOVE_SELF_AS_INTERVIEWER = gql`
  mutation RemoveSelfAsInterviewerMutation($interviewId: ID!) {
    removeSelfAsInterviewer(interviewId: $interviewId) {
      success
    }
  }
`

export const DELETE_APPLICANT = gql`
  mutation DeleteApplicant($id: ID!) {
    deleteApplicant(id: $id) {
      found
    }
  }
`

export const CREATE_APPLICANT_COMMENT_MUTATION = gql`
  mutation CreateApplicantCommentMutation(
    $input: CreateApplicantCommentInput!
  ) {
    createApplicantComment(input: $input) {
      applicantComment {
        id
      }
    }
  }
`

export const ASSIGN_APPLICANT_NEW_INTERVIEW_MUTATION = gql`
  mutation AssignApplicantNewInterview($applicantId: ID!, $interviewId: ID!) {
    assignApplicantNewInterview(
      applicantId: $applicantId
      interviewId: $interviewId
    ) {
      success
    }
  }
`

export const DELETE_INTERNAL_GROUP_POSITION_PRIORITY_MUTATION = gql`
  mutation DeleteInternalGroupPositionPriorityMutation($id: ID!) {
    deleteInternalGroupPositionPriority(id: $id) {
      found
    }
  }
`

export const CREATE_INTERVIEW_MUTATION = gql`
  mutation CreateInterviewMutation($input: CreateInterviewInput!) {
    createInterview(input: $input) {
      interview {
        id
      }
    }
  }
`

export const DELETE_INTERVIEW_MUTATION = gql`
  mutation DeleteInterviewMutation($id: ID!) {
    deleteInterview(id: $id) {
      found
    }
  }
`

export const REMOVE_APPLICANT_FROM_INTERVIEW_MUTATION = gql`
  mutation RemoveApplicantFromInterviewMutation($interviewId: ID!) {
    removeApplicantFromInterview(interviewId: $interviewId) {
      interview {
        id
      }
    }
  }
`
