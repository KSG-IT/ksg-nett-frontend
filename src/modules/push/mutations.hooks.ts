import { useMutation } from '@apollo/client'
import {
  REGISTER_PUSH_SUBSCRIPTION_MUTATION,
  REMOVE_PUSH_SUBSCRIPTION_MUTATION,
  SET_CHAT_NOTIFICATIONS_MUTATION,
} from './mutations'
import {
  RegisterPushSubscriptionReturns,
  RegisterPushSubscriptionVariables,
  RemovePushSubscriptionReturns,
  RemovePushSubscriptionVariables,
  SetChatNotificationsReturns,
  SetChatNotificationsVariables,
} from './types.graphql'

export function usePushMutations() {
  const [registerPushSubscription] = useMutation<
    RegisterPushSubscriptionReturns,
    RegisterPushSubscriptionVariables
  >(REGISTER_PUSH_SUBSCRIPTION_MUTATION)

  const [removePushSubscription] = useMutation<
    RemovePushSubscriptionReturns,
    RemovePushSubscriptionVariables
  >(REMOVE_PUSH_SUBSCRIPTION_MUTATION)

  const [setChatNotifications] = useMutation<
    SetChatNotificationsReturns,
    SetChatNotificationsVariables
  >(SET_CHAT_NOTIFICATIONS_MUTATION)

  return {
    registerPushSubscription,
    removePushSubscription,
    setChatNotifications,
  }
}
