import { useQuery } from '@apollo/client'
import { useCallback, useEffect } from 'react'
import { CHAT_MESSAGES_QUERY } from '../queries'
import { ChatMessagesReturns, ChatMessagesVariables } from '../types.graphql'

const MESSAGE_POLL_MS = 5_000
// Every sixth poll (30 s) loads the newest window again, to pick up messages
// a moderator has hidden.
const FULL_REFRESH_EVERY = 6

// The first load returns the newest messages. After that, a poll asks only for
// the messages after the newest one. The cache merges both
// (`chatMessages` in apollo-setup.ts).
export function useChatMessages(chatId: string) {
  const { data, loading, error, fetchMore, refetch } = useQuery<
    ChatMessagesReturns,
    ChatMessagesVariables
  >(CHAT_MESSAGES_QUERY, {
    variables: { chatId },
    fetchPolicy: 'cache-and-network',
  })
  const messages = data?.chatMessages ?? []
  const newestId = messages[messages.length - 1]?.id

  const pollNow = useCallback(() => {
    fetchMore({ variables: { chatId, afterId: newestId } })
  }, [fetchMore, chatId, newestId])

  useEffect(() => {
    let polls = 0
    // A hidden tab does not poll
    const timer = setInterval(() => {
      if (document.visibilityState !== 'visible') return
      polls += 1
      if (polls % FULL_REFRESH_EVERY === 0) refetch()
      else pollNow()
    }, MESSAGE_POLL_MS)
    return () => clearInterval(timer)
  }, [pollNow, refetch])

  return { messages, loading: loading && !data, error, pollNow }
}
