import { useQuery } from '@apollo/client'
import { showNotification } from '@mantine/notifications'
import { useEffect, useState } from 'react'
import { usePushMutations } from '../mutations.hooks'
import { PUSH_CONFIG_QUERY } from '../queries'
import { PushConfigReturns } from '../types.graphql'
import {
  currentSubscription,
  isIos,
  isPushSupported,
  isStandalone,
  pushStatus,
  subscriptionVariables,
  urlBase64ToUint8Array,
} from '../util'

function currentPermission() {
  return 'Notification' in window ? Notification.permission : null
}

// The push state of this browser, and the switch actions for the settings page.
export function usePush() {
  const { data } = useQuery<PushConfigReturns>(PUSH_CONFIG_QUERY)
  const { registerPushSubscription, removePushSubscription } =
    usePushMutations()
  const [subscribed, setSubscribed] = useState(false)
  const [checked, setChecked] = useState(false)
  const [permission, setPermission] = useState(currentPermission)
  const [busy, setBusy] = useState(false)

  // The subscription lives in the browser, outside React
  useEffect(() => {
    let active = true
    currentSubscription()
      .then(subscription => active && setSubscribed(subscription !== null))
      .finally(() => active && setChecked(true))
    return () => {
      active = false
    }
  }, [])

  const status = pushStatus({
    supported: isPushSupported(),
    ios: isIos(),
    standalone: isStandalone(),
    permission,
    subscribed,
  })

  // Runs from the switch click: iOS asks for permission only after a tap,
  // so requestPermission must be the first thing that waits.
  async function enable() {
    const key = data?.pushConfig.vapidPublicKey
    if (!key) return
    setBusy(true)
    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      if (result !== 'granted') return
      const registration = await navigator.serviceWorker.ready
      // A subscription made with an old VAPID key cannot be reused
      await (await registration.pushManager.getSubscription())?.unsubscribe()
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(key),
      })
      await registerPushSubscription({
        variables: subscriptionVariables(subscription, navigator.userAgent),
      })
      setSubscribed(true)
    } catch {
      showNotification({
        title: 'Noe gikk galt',
        message: 'Kunne ikke slå på push-varsler',
      })
    } finally {
      setBusy(false)
    }
  }

  async function disable() {
    setBusy(true)
    try {
      const subscription = await currentSubscription()
      if (subscription) {
        await removePushSubscription({
          variables: { endpoint: subscription.endpoint },
        })
        await subscription.unsubscribe()
      }
      setSubscribed(false)
    } catch {
      showNotification({
        title: 'Noe gikk galt',
        message: 'Kunne ikke slå av push-varsler',
      })
    } finally {
      setBusy(false)
    }
  }

  return { status, ready: checked && !!data, busy, enable, disable }
}
