import { DayShift, DayShiftSlot, slotCounts } from './allShifts'
import { RoleValues } from './consts'
import {
  applyDrafts,
  draftCount,
  draftKind,
  draftLabel,
  draftRange,
  lockedPerson,
  SlotDraft,
} from './drafts'
import { shiftCounts } from './scheduleGrid'

function user(id: string): NonNullable<DayShiftSlot['user']> {
  return {
    id,
    initials: `U${id}`,
    firstName: `Bruker ${id}`,
    getFullWithNickName: `Bruker ${id}`,
    getCleanFullName: `Bruker ${id}`,
    profileImage: null,
  }
}

function draft(
  userId: string | null,
  extra: Partial<SlotDraft> = {}
): SlotDraft {
  return {
    id: 'd',
    user: userId ? user(userId) : null,
    changedBy: { getCleanFullName: 'Kari' },
    changedAt: '2026-10-06T12:00:00',
    ...extra,
  }
}

function slot(
  id: string,
  userId: string | null,
  slotDraft?: SlotDraft | null
): DayShiftSlot {
  return {
    id,
    role: RoleValues.BARISTA,
    user: userId ? user(userId) : null,
    draft: slotDraft,
  }
}

function shiftWith(slots: DayShiftSlot[]): DayShift {
  return {
    id: 's1',
    name: 'Vakt',
    location: null,
    datetimeStart: '2026-10-12T16:00:00',
    datetimeEnd: '2026-10-12T23:00:00',
    schedule: { id: '1', name: 'Plan' },
    slots,
  }
}

describe('applyDrafts', () => {
  it('puts the person of a draft in the slot and keeps the locked person', () => {
    const [shift] = applyDrafts([
      shiftWith([slot('a', '1', draft('2')), slot('b', null, draft('3'))]),
    ])
    expect(shift.slots.map(s => s.user?.id)).toEqual(['2', '3'])
    expect(shift.slots.map(s => s.lockedUser?.id)).toEqual(['1', undefined])
  })

  it('clears the slot for a removal draft', () => {
    const [shift] = applyDrafts([shiftWith([slot('a', '1', draft(null))])])
    expect(shift.slots[0].user).toBeNull()
    expect(shift.slots[0].lockedUser?.id).toBe('1')
  })

  it('leaves a slot without a draft as it is', () => {
    const plain = slot('a', '1')
    const [shift] = applyDrafts([shiftWith([plain, slot('b', null, null)])])
    expect(shift.slots[0]).toBe(plain)
    expect(shift.slots[1].user).toBeNull()
  })

  it('does not change the shifts it gets', () => {
    const original = shiftWith([slot('a', '1', draft('2'))])
    applyDrafts([original])
    expect(original.slots[0].user?.id).toBe('1')
  })

  it('makes the counts follow the plan', () => {
    const [shift] = applyDrafts([
      shiftWith([
        slot('a', null, draft('2')),
        slot('b', '1', draft(null)),
        slot('c', '3'),
      ]),
    ])
    expect(slotCounts(shift)).toEqual({ filled: 2, total: 3, open: 1 })
    expect(shiftCounts([shift]).map(entry => entry.user.id)).toEqual(['2', '3'])
  })
})

describe('draftKind', () => {
  it('tells what a draft does to the slot', () => {
    const [shift] = applyDrafts([
      shiftWith([
        slot('a', null, draft('2')),
        slot('b', '1', draft('2')),
        slot('c', '1', draft(null)),
        slot('d', '1'),
      ]),
    ])
    expect(shift.slots.map(draftKind)).toEqual([
      'fill',
      'replace',
      'remove',
      null,
    ])
  })
})

describe('draftCount', () => {
  it('counts the slots with a draft', () => {
    const shifts = [
      shiftWith([slot('a', null, draft('2')), slot('b', '1')]),
      shiftWith([slot('c', '1', draft(null))]),
    ]
    expect(draftCount(shifts)).toBe(2)
    expect(draftCount([])).toBe(0)
  })
})

describe('draftLabel', () => {
  it('names the person and who changed it', () => {
    const [shift] = applyDrafts([
      shiftWith([
        slot('a', null, draft('2')),
        slot('b', '1', draft(null)),
        slot('c', null, draft('3', { changedBy: null })),
        slot('d', '1'),
      ]),
    ])
    expect(shift.slots.map(draftLabel)).toEqual([
      'Utkast: Bruker 2 (endret av Kari)',
      'Utkast: fjern Bruker 1 (endret av Kari)',
      'Utkast: Bruker 3',
      null,
    ])
  })
})

describe('lockedPerson', () => {
  it('gives the person who is locked in the slot, with or without a draft', () => {
    const [shift] = applyDrafts([
      shiftWith([
        slot('a', null, draft('2')),
        slot('b', '1', draft('2')),
        slot('c', '1', draft(null)),
        slot('d', '1'),
        slot('e', null),
      ]),
    ])
    expect(shift.slots.map(s => lockedPerson(s)?.id ?? null)).toEqual([
      null,
      '1',
      '1',
      '1',
      null,
    ])
  })
})

describe('draftRange', () => {
  it('gives the first and the last day of the visible weeks', () => {
    expect(draftRange(new Date(2026, 9, 12), 1)).toEqual({
      dateFrom: '2026-10-12',
      dateTo: '2026-10-18',
    })
    expect(draftRange(new Date(2026, 9, 12), 3)).toEqual({
      dateFrom: '2026-10-12',
      dateTo: '2026-11-01',
    })
  })

  it('counts local days over the end of daylight saving time', () => {
    // Europe/Oslo changes the clock on 2026-10-25
    expect(draftRange(new Date(2026, 9, 19), 2).dateTo).toBe('2026-11-01')
  })
})
