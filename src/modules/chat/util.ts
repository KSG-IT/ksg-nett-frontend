import { UserOption } from 'util/user'
import { ChatMember, ChatMessage, ChatUser } from './types.graphql'

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

interface MemberOption extends UserOption {
  disabled: boolean
}

// The user picker of a mega chat. Members stay in the list, so a search for
// them finds them, but they cannot be picked again.
export function memberAwareOptions(
  users: UserOption[],
  members: ChatMember[]
): MemberOption[] {
  const memberIds = new Set(members.map(member => member.user.id))
  return users.map(user =>
    memberIds.has(user.value)
      ? { ...user, label: `${user.label} (allerede medlem)`, disabled: true }
      : { ...user, disabled: false }
  )
}

// The picked users first, then the search results that are not picked.
export function withPicked(
  picked: UserOption[],
  results: UserOption[]
): UserOption[] {
  const pickedIds = new Set(picked.map(user => user.value))
  return [...picked, ...results.filter(user => !pickedIds.has(user.value))]
}

// A message the viewer sent that the server has not saved yet. It is not in
// the Apollo cache: its key is not a message id, and the read marker, the poll
// and "Lest av" must see real ids only.
export interface PendingMessage {
  key: string
  chatId: string
  body: string
  createdAt: string
}

// The list with the saved message in it, once and in order. A poll can bring
// it first, and two quick sends can come back in the other order.
export function withMessage(
  messages: readonly ChatMessage[],
  message: ChatMessage
): ChatMessage[] {
  if (messages.some(existing => existing.id === message.id))
    return [...messages]
  return [...messages, message].sort(
    (a, b) => messageNumber(a.id) - messageNumber(b.id)
  )
}

// A pending message in the shape of a bubble. The viewer's own bubbles do not
// show the sender, so the id is enough.
export function pendingAsMessage(
  pending: PendingMessage,
  meId: string
): ChatMessage {
  return {
    id: pending.key,
    body: pending.body,
    role: null,
    hidden: false,
    createdAt: pending.createdAt,
    sender: { id: meId } as ChatUser,
  }
}
