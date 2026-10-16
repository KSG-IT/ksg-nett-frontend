import { ChatMember, ChatMessage } from './types.graphql'

// Relay ids are base64("ChatMessageNode:<number>"). The numbers grow with
// time, so they tell which message is newer.
export function messageNumber(id: string): number {
  const decoded = atob(id)
  return Number(decoded.slice(decoded.lastIndexOf(':') + 1))
}

// The members, other than the viewer, who have read up to this message.
export function readersOf(
  message: ChatMessage,
  members: ChatMember[],
  meId: string
): ChatMember[] {
  const number = messageNumber(message.id)
  return members.filter(
    member =>
      member.user.id !== meId &&
      member.lastReadMessageId !== null &&
      messageNumber(member.lastReadMessageId) >= number
  )
}

// "Kari, Per +4": the first names, at most `shown`, then the rest as a count.
export function readersLabel(readers: ChatMember[], shown = 2): string {
  const names = readers.slice(0, shown).map(reader => reader.user.firstName)
  const rest = readers.length - names.length
  return rest > 0 ? `${names.join(', ')} +${rest}` : names.join(', ')
}

export function lastMessageOf(messages: ChatMessage[], userId: string) {
  return [...messages].reverse().find(message => message.sender.id === userId)
}
