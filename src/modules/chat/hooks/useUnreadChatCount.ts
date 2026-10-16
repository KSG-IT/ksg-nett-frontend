import { useQuery } from '@apollo/client'
import { useVisiblePolling } from 'util/hooks/useVisiblePolling'
import { UNREAD_CHAT_COUNT_QUERY } from '../queries'
import { UnreadChatCountReturns } from '../types.graphql'

const UNREAD_POLL_MS = 30_000

// Use only in a component that renders when the chat is enabled.
export function useUnreadChatCount() {
  const query = useQuery<UnreadChatCountReturns>(UNREAD_CHAT_COUNT_QUERY)
  useVisiblePolling(query, UNREAD_POLL_MS)
  return query.data?.unreadChatCount ?? 0
}
