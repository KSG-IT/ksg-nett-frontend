import { RoleValues } from 'modules/schedules/consts'
import { UserThumbnailProps } from 'modules/users/types'

export type ChatUser = UserThumbnailProps['user']

export interface ChatMessage {
  id: string
  body: string
  role: RoleValues | null
  createdAt: string
  hidden: boolean
  sender: ChatUser
}

export interface ChatMember {
  user: ChatUser
  online: boolean
  // Null for a viewer who is not a member (a superuser)
  lastReadMessageId: string | null
}

export interface ChatSummary {
  id: string
  name: string
  closed: boolean
  closesAt: string
  unreadCount: number
  onlineCount: number
  lastMessage: ChatMessage | null
}

export interface ChatDetail extends ChatSummary {
  membersEditable: boolean
  members: ChatMember[]
}

/* ==== QUERY TYPING === */
export interface ChatEnabledReturns {
  getFeatureFlagByKey: { id: string; enabled: boolean } | null
}

export interface UnreadChatCountReturns {
  unreadChatCount: number
}

export interface MyChatsReturns {
  myChats: ChatSummary[]
}

export interface AllChatsReturns {
  allChats: ChatSummary[]
}

export interface ChatReturns {
  chat: ChatDetail
}

export interface ChatVariables {
  chatId: string
}

export interface ChatMessagesReturns {
  chatMessages: ChatMessage[]
}

export interface ChatMessagesVariables {
  chatId: string
  afterId?: string
}

export interface JoinableShiftChat {
  userCount: number
  shift: {
    id: string
    name: string
    datetimeStart: string
    datetimeEnd: string
    locationDisplay: string | null
  }
  chat: { id: string; unreadCount: number } | null
}

export interface JoinableShiftChatsReturns {
  joinableShiftChats: JoinableShiftChat[]
}

/* ==== MUTATION TYPING === */
export interface JoinShiftChatVariables {
  shiftId: string
}

export interface JoinShiftChatReturns {
  joinShiftChat: { created: boolean; chat: { id: string } }
}

export interface SendChatMessageVariables {
  chatId: string
  body: string
}

export interface SendChatMessageReturns {
  sendChatMessage: { message: ChatMessage }
}

export interface MarkChatReadVariables {
  chatId: string
  messageId: string
}

export interface MarkChatReadReturns {
  markChatRead: { changed: boolean }
}

export interface PingChatVariables {
  chatId: string
}

export interface PingChatReturns {
  pingChat: { recorded: boolean }
}
