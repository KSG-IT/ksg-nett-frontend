import { ChatMember, ChatMessage } from './types.graphql'
import {
  memberAwareOptions,
  messageNumber,
  readersLabel,
  readersOf,
  pendingAsMessage,
  withMessage,
  withPicked,
} from './util'

const id = (n: number) => btoa(`ChatMessageNode:${n}`)

function member(userId: string, firstName: string, readUpTo: number | null) {
  return {
    user: { id: userId, firstName },
    online: false,
    lastReadMessageId: readUpTo === null ? null : id(readUpTo),
  } as ChatMember
}

describe('readersOf', () => {
  const message = { id: id(10) } as ChatMessage
  const members = [
    member('me', 'Meg', 10),
    member('a', 'Anna', 10),
    member('b', 'Per', 12),
    member('c', 'Kari', 9),
    member('d', 'Ola', null),
  ]

  it('lists the others who have read up to the message or later', () => {
    const readers = readersOf(message, members, 'me')
    expect(readers.map(reader => reader.user.firstName)).toEqual([
      'Anna',
      'Per',
    ])
  })

  it('reads the number from the id', () => {
    expect(messageNumber(id(42))).toBe(42)
  })
})

describe('readersLabel', () => {
  it('shows two names and counts the rest', () => {
    const readers = ['A', 'B', 'C', 'D'].map(name => member(name, name, 1))
    expect(readersLabel(readers)).toBe('A, B +2')
    expect(readersLabel(readers.slice(0, 2))).toBe('A, B')
  })
})

describe('memberAwareOptions', () => {
  it('keeps members in the list but disables them', () => {
    const users = [
      { value: 'a', label: 'Anna Lund' },
      { value: 'b', label: 'Per Moe' },
    ]

    expect(memberAwareOptions(users, [member('a', 'Anna', null)])).toEqual([
      { value: 'a', label: 'Anna Lund (allerede medlem)', disabled: true },
      { value: 'b', label: 'Per Moe', disabled: false },
    ])
  })
})

describe('withPicked', () => {
  it('keeps picked users and adds results without duplicates', () => {
    const anna = { value: 'a', label: 'Anna Lund' }
    const per = { value: 'b', label: 'Per Moe' }

    expect(withPicked([anna], [per, anna])).toEqual([anna, per])
  })
})

describe('withMessage', () => {
  const message = (n: number) => ({ id: id(n) } as ChatMessage)

  it('puts the saved message at the end', () => {
    expect(withMessage([message(1), message(2)], message(3))).toEqual([
      message(1),
      message(2),
      message(3),
    ])
  })

  it('keeps the order when a later message was saved first', () => {
    expect(withMessage([message(1), message(3)], message(2))).toEqual([
      message(1),
      message(2),
      message(3),
    ])
  })

  it('does not add it twice when a poll brought it first', () => {
    expect(withMessage([message(1), message(2)], message(2))).toEqual([
      message(1),
      message(2),
    ])
  })
})

describe('pendingAsMessage', () => {
  it("shows the text and time as the viewer's own message", () => {
    const pending = {
      key: 'pending-1',
      chatId: 'chat',
      body: 'Hei',
      createdAt: '2026-10-26T20:00:00.000Z',
    }

    expect(pendingAsMessage(pending, 'me')).toEqual({
      id: 'pending-1',
      body: 'Hei',
      role: null,
      hidden: false,
      createdAt: '2026-10-26T20:00:00.000Z',
      sender: { id: 'me' },
    })
  })
})
