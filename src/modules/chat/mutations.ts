import { gql } from '@apollo/client'

export const JOIN_SHIFT_CHAT_MUTATION = gql`
  mutation JoinShiftChat($shiftId: ID!) {
    joinShiftChat(shiftId: $shiftId) {
      created
      chat {
        id
      }
    }
  }
`

export const SEND_CHAT_MESSAGE_MUTATION = gql`
  mutation SendChatMessage($chatId: ID!, $body: String!) {
    sendChatMessage(chatId: $chatId, body: $body) {
      message {
        id
      }
    }
  }
`

export const MARK_CHAT_READ_MUTATION = gql`
  mutation MarkChatRead($chatId: ID!, $messageId: ID!) {
    markChatRead(chatId: $chatId, messageId: $messageId) {
      changed
    }
  }
`

export const PING_CHAT_MUTATION = gql`
  mutation PingChat($chatId: ID!) {
    pingChat(chatId: $chatId) {
      recorded
    }
  }
`

export const CREATE_MEGA_CHAT_MUTATION = gql`
  mutation CreateMegaChat($name: String!) {
    createMegaChat(name: $name) {
      chat {
        id
      }
    }
  }
`

export const ADD_CHAT_MEMBERS_MUTATION = gql`
  mutation AddChatMembers($chatId: ID!, $userIds: [ID!]!) {
    addChatMembers(chatId: $chatId, userIds: $userIds) {
      addedCount
    }
  }
`
