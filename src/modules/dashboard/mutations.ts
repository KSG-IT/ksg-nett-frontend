import gql from 'graphql-tag'

export const SEND_FEEDBACK_MUTATION = gql`
  mutation SendFeedback($message: String!, $anonymous: Boolean!) {
    sendFeedback(message: $message, anonymous: $anonymous) {
      ok
    }
  }
`
