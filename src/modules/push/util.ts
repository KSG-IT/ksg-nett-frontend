import { RegisterPushSubscriptionVariables } from './types.graphql'

export type PushStatus =
  | 'unsupported'
  | 'needs-install'
  | 'denied'
  | 'off'
  | 'on'

// The VAPID public key comes as base64url. pushManager.subscribe wants bytes.
export function urlBase64ToUint8Array(base64Url: string) {
  const padding = '='.repeat((4 - (base64Url.length % 4)) % 4)
  const base64 = (base64Url + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(base64)
  const bytes = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i)
  return bytes
}

export function isPushSupported() {
  return (
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  )
}

// iPadOS says it is a Mac. Only the touch points give it away.
export function isIos(
  userAgent = navigator.userAgent,
  maxTouchPoints = navigator.maxTouchPoints
) {
  return (
    /iPad|iPhone|iPod/.test(userAgent) ||
    (/Macintosh/.test(userAgent) && maxTouchPoints > 1)
  )
}

// True in the installed app. Safari on iOS has `navigator.standalone`.
export function isStandalone(
  win: Pick<Window, 'matchMedia' | 'navigator'> = window
) {
  return (
    win.matchMedia('(display-mode: standalone)').matches ||
    (win.navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

interface PushEnvironment {
  supported: boolean
  ios: boolean
  standalone: boolean
  permission: NotificationPermission | null
  subscribed: boolean
}

// What the settings page shows. iOS has push only in the Home Screen app, so a
// Safari tab on iOS gets the install hint and not "unsupported".
export function pushStatus({
  supported,
  ios,
  standalone,
  permission,
  subscribed,
}: PushEnvironment): PushStatus {
  if (ios && !standalone) return 'needs-install'
  if (!supported) return 'unsupported'
  if (permission === 'denied') return 'denied'
  return subscribed ? 'on' : 'off'
}

export function subscriptionVariables(
  subscription: Pick<PushSubscription, 'toJSON'>,
  userAgent: string
): RegisterPushSubscriptionVariables {
  const { endpoint = '', keys = {} } = subscription.toJSON()
  return {
    endpoint,
    p256dh: keys.p256dh ?? '',
    auth: keys.auth ?? '',
    userAgent,
  }
}

export async function currentSubscription() {
  if (!isPushSupported()) return null
  const registration = await navigator.serviceWorker.getRegistration()
  return (await registration?.pushManager.getSubscription()) ?? null
}

// The number on the app icon: iOS 16.4+ Home Screen apps and some desktop
// browsers. 0 removes it. It never throws: the user can turn badges off.
export function setAppBadge(
  count: number,
  nav: Pick<Navigator, 'setAppBadge' | 'clearAppBadge'> = navigator
) {
  if (!('setAppBadge' in nav)) return Promise.resolve()
  const result = count > 0 ? nav.setAppBadge(count) : nav.clearAppBadge()
  return result.catch(() => undefined)
}
