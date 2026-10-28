export interface PushNotificationSettings {
  // Lets the optimistic response update the cached user
  __typename?: 'UserNode'
  id: string
  notifyOnChatMessage: boolean
  notifyOnChatAdded: boolean
  pushOnDeposit: boolean
  pushOnQuote: boolean
  pushOnShift: boolean
  pushOnOrderSession: boolean
}

export type PushSettingKey = Exclude<
  keyof PushNotificationSettings,
  '__typename' | 'id'
>

/* ==== QUERY TYPING === */
export interface PushEnabledReturns {
  getFeatureFlagByKey: { id: string; enabled: boolean } | null
}

export interface BadgeCountReturns {
  badgeCount: number
}

export interface PushConfigReturns {
  pushConfig: { vapidPublicKey: string | null }
}

/* ==== MUTATION TYPING === */
export interface RegisterPushSubscriptionVariables {
  endpoint: string
  p256dh: string
  auth: string
  userAgent: string
}

export interface RegisterPushSubscriptionReturns {
  registerPushSubscription: { ok: boolean }
}

export interface RemovePushSubscriptionVariables {
  endpoint: string
}

export interface RemovePushSubscriptionReturns {
  removePushSubscription: { ok: boolean }
}

// Only the given settings change
export interface SetPushSettingsVariables {
  onChatMessage?: boolean
  onChatAdded?: boolean
  onDeposit?: boolean
  onQuote?: boolean
  onShift?: boolean
  onOrderSession?: boolean
}

export interface SetPushSettingsReturns {
  setPushSettings: { user: PushNotificationSettings }
}
