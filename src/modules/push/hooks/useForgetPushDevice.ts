import { usePushMutations } from '../mutations.hooks'
import { currentSubscription } from '../util'

// On a manual logout this device stops getting the user's pushes. It runs
// before the token is removed, because the API call needs it. It never throws,
// so logout always goes on.
export function useForgetPushDevice() {
  const { removePushSubscription } = usePushMutations()

  return async function forgetPushDevice() {
    try {
      const subscription = await currentSubscription()
      if (!subscription) return
      // Fails with the flag off. The push service then answers 410 for the
      // row, and the backend deletes it.
      await removePushSubscription({
        variables: { endpoint: subscription.endpoint },
      }).catch(() => undefined)
      await subscription.unsubscribe()
    } catch {
      // Logout must not depend on push
    }
  }
}
