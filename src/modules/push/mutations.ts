import { gql } from '@apollo/client'

export const REGISTER_PUSH_SUBSCRIPTION_MUTATION = gql`
  mutation RegisterPushSubscription(
    $endpoint: String!
    $p256dh: String!
    $auth: String!
    $userAgent: String
  ) {
    registerPushSubscription(
      endpoint: $endpoint
      p256dh: $p256dh
      auth: $auth
      userAgent: $userAgent
    ) {
      ok
    }
  }
`

export const REMOVE_PUSH_SUBSCRIPTION_MUTATION = gql`
  mutation RemovePushSubscription($endpoint: String!) {
    removePushSubscription(endpoint: $endpoint) {
      ok
    }
  }
`

export const SET_CHAT_NOTIFICATIONS_MUTATION = gql`
  mutation SetChatNotifications($onMessage: Boolean!, $onAdded: Boolean!) {
    setChatNotifications(onMessage: $onMessage, onAdded: $onAdded) {
      user {
        id
        notifyOnChatMessage
        notifyOnChatAdded
      }
    }
  }
`
