import { gql } from '@apollo/client'

const CHAT_USER_FIELDS = `
  id
  initials
  profileImage
  firstName
  getFullWithNickName
  getCleanFullName
`

export const CHAT_ENABLED_QUERY = gql`
  query ChatEnabled {
    getFeatureFlagByKey(key: "chat") {
      id
      enabled
    }
  }
`

export const UNREAD_CHAT_COUNT_QUERY = gql`
  query UnreadChatCount {
    unreadChatCount
  }
`

const CHAT_SUMMARY_FIELDS = `
  id
  name
  closed
  closesAt
  unreadCount
  onlineCount
  muted
  lastMessage {
    id
    body
    hidden
    createdAt
    sender {
      ${CHAT_USER_FIELDS}
    }
  }
`

export const MY_CHATS_QUERY = gql`
  query MyChats {
    myChats {
      ${CHAT_SUMMARY_FIELDS}
    }
  }
`

export const ALL_CHATS_QUERY = gql`
  query AllChats {
    allChats {
      ${CHAT_SUMMARY_FIELDS}
    }
  }
`

export const CHAT_QUERY = gql`
  query Chat($chatId: ID!) {
    chat(chatId: $chatId) {
      ${CHAT_SUMMARY_FIELDS}
      membersEditable
      members {
        online
        lastReadMessageId
        user {
          ${CHAT_USER_FIELDS}
        }
      }
    }
  }
`

// The send mutation returns the same fields, so its message can go straight
// into the cached list
export const CHAT_MESSAGE_FIELDS = `
  id
  body
  role
  hidden
  createdAt
  sender {
    ${CHAT_USER_FIELDS}
  }
`

export const CHAT_MESSAGES_QUERY = gql`
  query ChatMessages($chatId: ID!, $afterId: ID) {
    chatMessages(chatId: $chatId, afterId: $afterId) {
      ${CHAT_MESSAGE_FIELDS}
    }
  }
`

export const JOINABLE_SHIFT_CHATS_QUERY = gql`
  query JoinableShiftChats {
    joinableShiftChats {
      userCount
      shift {
        id
        name
        datetimeStart
        datetimeEnd
        locationDisplay
      }
      chat {
        id
        unreadCount
      }
    }
  }
`

export const MEGA_CHAT_PREVIEW_QUERY = gql`
  query MegaChatPreview {
    megaChatPreview {
      open
      userCount
      shifts {
        userCount
        shift {
          id
          name
          datetimeStart
          datetimeEnd
          locationDisplay
        }
      }
    }
  }
`
