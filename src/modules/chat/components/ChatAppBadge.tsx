import { useQuery } from '@apollo/client'
import { setAppBadge, usePushEnabled } from 'modules/push'
import { useEffect } from 'react'
import { useChatEnabled } from '../hooks/useChatEnabled'
import { UNREAD_CHAT_COUNT_QUERY } from '../queries'
import { UnreadChatCountReturns } from '../types.graphql'

// The unread chat count on the app icon (iOS Home Screen app and some
// desktop browsers). Behind the chat and the push flags.
export const ChatAppBadge: React.FC = () => {
  const { enabled: chatEnabled } = useChatEnabled()
  const { enabled: pushEnabled } = usePushEnabled()
  if (!chatEnabled || !pushEnabled) return null
  return <ChatAppBadgeCount />
}

const ChatAppBadgeCount: React.FC = () => {
  // No poll of its own: it reads the cache, which the sidebar chat item's
  // poll (useUnreadChatCount) keeps fresh while the app is open
  const { data } = useQuery<UnreadChatCountReturns>(UNREAD_CHAT_COUNT_QUERY)
  const unread = data?.unreadChatCount ?? 0

  // The badge lives outside React, on the app icon
  useEffect(() => {
    setAppBadge(unread)
  }, [unread])

  return null
}
