import { gql } from 'graphql-tag'

export const INTERVIEW_TEMPLATE_QUERY = gql`
  query InterviewTemplateQuery {
    interviewTemplate {
      interviewBooleanEvaluationStatements {
        id
        statement
      }
      interviewAdditionalEvaluationStatements {
        id
        statement
      }
    }
  }
`

export const EXTERNALLY_AVAILABLE_INTERNAL_GROUP_POSITIONS_QUERY = gql`
  query ExternallyAvailableInternalGroupPositionsQuery {
    externallyAvailableInternalGroupPositions {
      id
      name
    }
    currentAdmissionInternalGroupPositionData {
      id
      availablePositions
      internalGroupPosition {
        id
        name
      }
    }
  }
`

export const CURRENT_ADMISSION_INTERNAL_GROUP_POSITION_DATA = gql`
  query CurrentAdmissionInternalGroupPositionData {
    currentAdmissionInternalGroupPositionData {
      id
      availablePositions
      internalGroupPosition {
        id
        name
      }
    }
  }
`
