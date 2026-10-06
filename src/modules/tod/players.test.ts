import {
  guestToPlayer,
  initialsOf,
  memberToPlayer,
  playerSubtitle,
} from './players'
import { TodPlayerNode } from './types.graphql'

const member: TodPlayerNode = {
  id: '12',
  getCleanFullName: 'Kari Nordmann',
  profileImage: 'https://example.com/kari.jpg',
  initials: 'KN',
  activeInternalGroupPosition: {
    id: '3',
    internalGroup: { id: '1', name: 'Edgar' },
  },
}

describe('memberToPlayer', () => {
  it('keeps the user id, picture and gjeng', () => {
    expect(memberToPlayer(member)).toEqual({
      id: 'user:12',
      name: 'Kari Nordmann',
      initials: 'KN',
      userId: '12',
      profileImage: 'https://example.com/kari.jpg',
      group: 'Edgar',
    })
  })

  it('has no gjeng without an active membership', () => {
    const player = memberToPlayer({
      ...member,
      activeInternalGroupPosition: null,
      profileImage: '',
    })
    expect(player.group).toBeNull()
    expect(player.profileImage).toBeNull()
  })
})

describe('guestToPlayer', () => {
  it('has no user id', () => {
    const guest = guestToPlayer('Petter Smart', 5)
    expect(guest.userId).toBeNull()
    expect(guest.initials).toBe('PS')
    expect(guest.id).toBe('guest:Petter Smart:5')
  })
})

describe('initialsOf', () => {
  it('takes at most two initials', () => {
    expect(initialsOf('ola  jakob hansen')).toBe('OJ')
  })
})

describe('playerSubtitle', () => {
  it('shows the gjeng, KSG or Gjest', () => {
    expect(playerSubtitle({ userId: '1', group: 'Lyche' })).toBe('Lyche')
    expect(playerSubtitle({ userId: '1', group: null })).toBe('KSG')
    expect(playerSubtitle({ userId: null, group: null })).toBe('Gjest')
  })
})
