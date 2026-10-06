import { NewPlayer } from './game'
import { TodPlayerNode } from './types.graphql'

// The value of the "add as guest" row in the player search.
export const GUEST_OPTION = 'guest'

export function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0].toUpperCase())
    .join('')
}

// The member's current gjeng, or null when they have no active membership.
export function groupOf(user: TodPlayerNode) {
  return user.activeInternalGroupPosition?.internalGroup.name ?? null
}

export function memberToPlayer(user: TodPlayerNode): NewPlayer {
  return {
    id: `user:${user.id}`,
    name: user.getCleanFullName,
    initials: user.initials,
    userId: user.id,
    profileImage: user.profileImage || null,
    group: groupOf(user),
  }
}

export function guestToPlayer(name: string, now: number): NewPlayer {
  return {
    id: `guest:${name}:${now}`,
    name,
    initials: initialsOf(name),
    userId: null,
    profileImage: null,
    group: null,
  }
}

// Text under the name: the gjeng for a member, "KSG" for a member without
// one, and "Gjest" for a guest.
export function playerSubtitle(player: Pick<NewPlayer, 'userId' | 'group'>) {
  if (player.userId === null) return 'Gjest'
  return player.group ?? 'KSG'
}
