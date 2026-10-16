import { useMutation } from '@apollo/client'
import {
  JOIN_SHIFT_CHAT_MUTATION,
  MARK_CHAT_READ_MUTATION,
  PING_CHAT_MUTATION,
  SEND_CHAT_MESSAGE_MUTATION,
} from './mutations'
import {
  JoinShiftChatReturns,
  JoinShiftChatVariables,
  MarkChatReadReturns,
  MarkChatReadVariables,
  PingChatReturns,
  PingChatVariables,
  SendChatMessageReturns,
  SendChatMessageVariables,
} from './types.graphql'

export function useChatMutations() {
  const [joinShiftChat, { loading: joinShiftChatLoading }] = useMutation<
    JoinShiftChatReturns,
    JoinShiftChatVariables
  >(JOIN_SHIFT_CHAT_MUTATION)

  const [sendChatMessage, { loading: sendChatMessageLoading }] = useMutation<
    SendChatMessageReturns,
    SendChatMessageVariables
  >(SEND_CHAT_MESSAGE_MUTATION)

  const [markChatRead] = useMutation<
    MarkChatReadReturns,
    MarkChatReadVariables
  >(MARK_CHAT_READ_MUTATION)

  const [pingChat] = useMutation<PingChatReturns, PingChatVariables>(
    PING_CHAT_MUTATION
  )

  return {
    joinShiftChat,
    joinShiftChatLoading,
    sendChatMessage,
    sendChatMessageLoading,
    markChatRead,
    pingChat,
  }
}
