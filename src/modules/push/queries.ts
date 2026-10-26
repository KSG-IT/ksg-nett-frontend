import { gql } from '@apollo/client'
import { PUSH_NOTIFICATIONS_FEATURE_FLAG_KEY } from 'util/featureFlagKeys'

export const PUSH_ENABLED_QUERY = gql`
  query PushEnabled {
    getFeatureFlagByKey(key: "${PUSH_NOTIFICATIONS_FEATURE_FLAG_KEY}") {
      id
      enabled
    }
  }
`

export const PUSH_CONFIG_QUERY = gql`
  query PushConfig {
    pushConfig {
      vapidPublicKey
    }
  }
`

export const BADGE_COUNT_QUERY = gql`
  query BadgeCount {
    badgeCount
  }
`
