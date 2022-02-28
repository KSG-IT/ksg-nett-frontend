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
