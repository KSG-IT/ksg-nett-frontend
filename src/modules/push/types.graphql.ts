export interface ChatNotificationSettings {
  // Lets the optimistic response update the cached user
  __typename?: 'UserNode'
  id: string
  notifyOnChatMessage: boolean
  notifyOnChatAdded: boolean
}

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

export interface SetChatNotificationsVariables {
  onMessage: boolean
  onAdded: boolean
}

export interface SetChatNotificationsReturns {
  setChatNotifications: { user: ChatNotificationSettings }
}
