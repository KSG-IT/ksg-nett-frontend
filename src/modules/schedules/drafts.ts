// Drafts of slot changes (ShiftSlotNode.draft). A draft is not visible to the
// members until a manager locks it. Only managers get drafts from the API.
import type { DayShift, DayShiftSlot } from './allShifts'

type SlotUser = DayShiftSlot['user']

export interface SlotDraft {
  id: string
  // null: the draft removes the person from the slot
  user: SlotUser
  changedBy: { getCleanFullName: string } | null
  changedAt: string
}

export type DraftKind = 'fill' | 'replace' | 'remove'

// What the draft does to the slot. The slot keeps its locked person in
// `lockedUser`, see applyDrafts.
export function draftKind(slot: DayShiftSlot): DraftKind | null {
  if (!slot.draft) return null
  if (slot.draft.user === null) return 'remove'
  return slot.lockedUser ? 'replace' : 'fill'
}

// The shifts as they look after a lock: each slot has the person of its draft.
// Counts, "busy that day" and the open slots then follow the plan. The slot
// keeps its draft, and the locked person in `lockedUser`.
export function applyDrafts(shifts: DayShift[]): DayShift[] {
  return shifts.map(shift => ({
    ...shift,
    slots: shift.slots.map(slot =>
      slot.draft
        ? { ...slot, lockedUser: slot.user, user: slot.draft.user }
        : slot
    ),
  }))
}

export function draftCount(shifts: DayShift[]) {
  return shifts.reduce(
    (sum, shift) => sum + shift.slots.filter(slot => slot.draft).length,
    0
  )
}

// "Utkast: Ola Nordmann (endret av Kari)" for the tooltip of a chip.
export function draftLabel(slot: DayShiftSlot) {
  const kind = draftKind(slot)
  if (!kind || !slot.draft) return null
  const person =
    kind === 'remove'
      ? `fjern ${slot.lockedUser?.getFullWithNickName ?? 'person'}`
      : slot.draft.user?.getFullWithNickName
  const author = slot.draft.changedBy
    ? ` (endret av ${slot.draft.changedBy.getCleanFullName})`
    : ''
  return `Utkast: ${person}${author}`
}
