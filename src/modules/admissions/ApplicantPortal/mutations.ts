import { gql } from 'graphql-tag'

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

// export const CHANGE_INTERNAL_GROUP_PRIORITY_ORDER = gql``

export const DELETE_INTERNAL_GROUP_POSITION_PRIORITY = gql`
  mutation DeleteInternalGroupPositionPriority($id: ID!) {
    deleteInternalGroupPositionPriority(id: $id) {
      found
    }
  }
`
