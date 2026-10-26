import { useState } from 'react'
import { useChatMutations } from '../mutations.hooks'
import { CHAT_MESSAGES_QUERY } from '../queries'
import { ChatMessagesReturns, ChatMessagesVariables } from '../types.graphql'
import { PendingMessage, withMessage } from '../util'

let nextKey = 0

// Own messages show at once, as pending, while the server saves them. When
// the server answers, the saved message goes into the cached list and the
// pending one goes away. On an error, send() throws and the pending one goes
// away, so the composer can give the text back.
export function useSendChatMessage(chatId: string) {
  const { sendChatMessage } = useChatMutations()
  const [pending, setPending] = useState<PendingMessage[]>([])

  function drop(key: string) {
    setPending(list => list.filter(message => message.key !== key))
  }

  async function send(body: string) {
    nextKey += 1
    const key = `pending-${nextKey}`
    const createdAt = new Date().toISOString()
    setPending(list => [...list, { key, chatId, body, createdAt }])
    try {
      await sendChatMessage({
        variables: { chatId, body },
        update(cache, { data }) {
          const message = data?.sendChatMessage.message
          if (!message) return
          cache.updateQuery<ChatMessagesReturns, ChatMessagesVariables>(
            { query: CHAT_MESSAGES_QUERY, variables: { chatId } },
            current =>
              current && {
                chatMessages: withMessage(current.chatMessages, message),
              }
          )
          // In the same update as the saved message, so both never show
          drop(key)
        },
      })
    } catch (error) {
      drop(key)
      throw error
    }
  }

  // Pending messages of another chat stay out of this one
  return {
    pending: pending.filter(message => message.chatId === chatId),
    send,
  }
}
