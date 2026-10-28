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

export const SET_PUSH_SETTINGS_MUTATION = gql`
  mutation SetPushSettings(
    $onChatMessage: Boolean
    $onChatAdded: Boolean
    $onDeposit: Boolean
    $onQuote: Boolean
    $onShift: Boolean
    $onOrderSession: Boolean
  ) {
    setPushSettings(
      onChatMessage: $onChatMessage
      onChatAdded: $onChatAdded
      onDeposit: $onDeposit
      onQuote: $onQuote
      onShift: $onShift
      onOrderSession: $onOrderSession
    ) {
      user {
        id
        notifyOnChatMessage
        notifyOnChatAdded
        pushOnDeposit
        pushOnQuote
        pushOnShift
        pushOnOrderSession
      }
    }
  }
`
