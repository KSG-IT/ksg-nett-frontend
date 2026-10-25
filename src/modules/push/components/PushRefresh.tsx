import { useEffect } from 'react'
import { usePushEnabled } from '../hooks/usePushEnabled'
import { usePushMutations } from '../mutations.hooks'
import { currentSubscription, subscriptionVariables } from '../util'

// Once per app load, send this browser's subscription to the backend again.
// It heals expired subscriptions and moves the device to the user who is
// logged in now. It never asks for permission.
export const PushRefresh: React.FC = () => {
  const { enabled } = usePushEnabled()
  if (!enabled) return null
  return <PushRefreshOnce />
}

const PushRefreshOnce: React.FC = () => {
  const { registerPushSubscription } = usePushMutations()

  useEffect(() => {
    if (!('Notification' in window) || Notification.permission !== 'granted')
      return
    currentSubscription()
      .then(subscription => {
        if (!subscription) return
        return registerPushSubscription({
          variables: subscriptionVariables(subscription, navigator.userAgent),
        })
      })
      .catch(() => undefined)
    // Once per load. The mutation function from Apollo is stable.
  }, [])

  return null
}
