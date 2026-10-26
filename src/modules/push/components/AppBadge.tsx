import { useQuery } from '@apollo/client'
import { useEffect } from 'react'
import { useVisiblePolling } from 'util/hooks/useVisiblePolling'
import { usePushEnabled } from '../hooks/usePushEnabled'
import { BADGE_COUNT_QUERY } from '../queries'
import { BadgeCountReturns } from '../types.graphql'
import { setAppBadge } from '../util'

const BADGE_POLL_MS = 60_000

// The number on the app icon (iOS Home Screen app and some desktop
// browsers). The backend decides what counts (badgeCount), so this knows no
// feature. Behind the push flag.
export const AppBadge: React.FC = () => {
  const { enabled } = usePushEnabled()
  if (!enabled) return null
  return <AppBadgeCount />
}

const AppBadgeCount: React.FC = () => {
  const query = useQuery<BadgeCountReturns>(BADGE_COUNT_QUERY)
  useVisiblePolling(query, BADGE_POLL_MS)
  const count = query.data?.badgeCount ?? 0

  // The badge lives outside React, on the app icon
  useEffect(() => {
    setAppBadge(count)
  }, [count])

  return null
}
