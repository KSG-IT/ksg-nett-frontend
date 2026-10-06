// Drafts of slot changes (ShiftSlotNode.draft). A draft is not visible to the
// members until a manager locks it. Only managers get drafts from the API.
import { addDays, format } from 'date-fns'
import type { DayShift, DayShiftSlot } from './allShifts'

type SlotUser = DayShiftSlot['user']

export interface SlotDraft {
  id: string
  // null: the draft removes the person from the slot
  user: SlotUser
  changedBy: { getCleanFullName: string } | null
  changedAt: string
  // Set when autofill wrote the draft. A manual change clears it.
  autofillRun: { id: string } | null
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

// The person who is locked in the slot, with or without a draft. A draft with
// this person removes the draft.
export function lockedPerson(slot: DayShiftSlot): SlotUser {
  return slot.draft ? slot.lockedUser ?? null : slot.user
}

export interface DraftRange {
  dateFrom: string
  dateTo: string
}

// The dates of the visible weeks, as the backend reads them: local dates, both
// included. `monday` is the first day of the first week.
export function draftRange(monday: Date, weeks: number): DraftRange {
  const last = addDays(monday, weeks * 7 - 1)
  return {
    dateFrom: format(monday, 'yyyy-MM-dd'),
    dateTo: format(last, 'yyyy-MM-dd'),
  }
}

export function draftCount(shifts: DayShift[]) {
  return shifts.reduce(
    (sum, shift) => sum + shift.slots.filter(slot => slot.draft).length,
    0
  )
}

// "Utkast: Ola Nordmann (endret av Kari)" for the tooltip of a chip. An
// autofill draft says "(autofyll)" instead of the person who ran autofill.
export function draftLabel(slot: DayShiftSlot) {
  const kind = draftKind(slot)
  if (!kind || !slot.draft) return null
  const person =
    kind === 'remove'
      ? `fjern ${slot.lockedUser?.getFullWithNickName ?? 'person'}`
      : slot.draft.user?.getFullWithNickName
  return `Utkast: ${person}${draftSource(slot.draft)}`
}

function draftSource(draft: SlotDraft) {
  if (draft.autofillRun) return ' (autofyll)'
  if (draft.changedBy) return ` (endret av ${draft.changedBy.getCleanFullName})`
  return ''
}
