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
    currentlyAdmissionInternalGroupPositionData {
      id
      availablePositions
      internalGroupPosition {
        id
        name
      }
    }
  }
`

export const CURRENTLY_ADMISSION_INTERNAL_GROUP_POSITION_DATA = gql`
  query CurrentlyAdmissionInternalGroupPositionData {
    currentlyAdmissionInternalGroupPositionData {
      id
      availablePositions
      internalGroupPosition {
        id
        name
      }
    }
  }
`
