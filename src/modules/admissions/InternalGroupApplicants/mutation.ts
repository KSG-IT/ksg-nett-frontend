import { gql } from 'graphql-tag'

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
