import { useEffect } from 'react'
import { useChatMutations } from '../mutations.hooks'

const PING_MS = 20_000

// Presence and read markers are best effort. The next ping or message retries.
function ignoreFailure() {}

// While the chat is open and the tab is visible, a member is shown as online,
// and the newest message counts as read. A viewer who is not a member (a
// superuser) calls neither.
export function useChatPresence(
  chatId: string,
  isMember: boolean,
  newestMessageId: string | undefined
) {
  const { pingChat, markChatRead } = useChatMutations()

  useEffect(() => {
    if (!isMember) return
    function ping() {
      if (document.visibilityState === 'visible')
        pingChat({ variables: { chatId } }).catch(ignoreFailure)
    }
    ping()
    const timer = setInterval(ping, PING_MS)
    return () => clearInterval(timer)
  }, [chatId, isMember, pingChat])

  useEffect(() => {
    if (!isMember || !newestMessageId) return
    if (document.visibilityState !== 'visible') return
    markChatRead({
      variables: { chatId, messageId: newestMessageId },
      // The badges drop at once, not at the next poll
      refetchQueries: ['UnreadChatCount', 'MyChats'],
    }).catch(ignoreFailure)
  }, [chatId, isMember, newestMessageId, markChatRead])
}
