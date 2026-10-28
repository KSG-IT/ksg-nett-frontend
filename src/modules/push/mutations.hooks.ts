import { useMutation } from '@apollo/client'
import {
  REGISTER_PUSH_SUBSCRIPTION_MUTATION,
  REMOVE_PUSH_SUBSCRIPTION_MUTATION,
  SET_PUSH_SETTINGS_MUTATION,
} from './mutations'
import {
  RegisterPushSubscriptionReturns,
  RegisterPushSubscriptionVariables,
  RemovePushSubscriptionReturns,
  RemovePushSubscriptionVariables,
  SetPushSettingsReturns,
  SetPushSettingsVariables,
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

  const [setPushSettings] = useMutation<
    SetPushSettingsReturns,
    SetPushSettingsVariables
  >(SET_PUSH_SETTINGS_MUTATION)

  return {
    registerPushSubscription,
    removePushSubscription,
    setPushSettings,
  }
}
