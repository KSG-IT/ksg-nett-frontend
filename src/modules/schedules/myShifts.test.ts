import { DayShift } from './allShifts'
import { LocationValues, RoleValues } from './consts'
import {
  coworkerShift,
  daysUntil,
  groupByMonth,
  groupByWeek,
  mySlot,
  pastShifts,
  relativeDay,
  upcomingShifts,
} from './myShifts'

const ME = 'me'

function person(id: string) {
  return {
    id,
    initials: 'XX',
    firstName: id,
    getFullWithNickName: id,
    getCleanFullName: id,
    profileImage: null,
  }
}

// Local times without an offset, so the tests give the same result in any
// time zone.
function shift(id: string, start: string, end: string): DayShift {
  return {
    id,
    name: `Vakt ${id}`,
    location: LocationValues.EDGAR,
    datetimeStart: start,
    datetimeEnd: end,
    slots: [
      { id: `${id}-me`, role: RoleValues.BARISTA, user: person(ME) },
      { id: `${id}-other`, role: RoleValues.BARISTA, user: person('ingrid') },
      { id: `${id}-open`, role: RoleValues.KAFEANSVARLIG, user: null },
    ],
  }
}

const now = new Date('2026-10-07T12:00:00')
const friday = shift('fri', '2026-10-09T16:00:00', '2026-10-09T23:00:00')
const wednesday = shift('wed', '2026-10-14T17:00:00', '2026-10-15T01:00:00')
const nextYear = shift('jan', '2027-01-04T08:00:00', '2027-01-04T16:00:00')
const lastWeek = shift('old', '2026-09-30T16:00:00', '2026-09-30T23:00:00')
const august = shift('aug', '2026-08-20T16:00:00', '2026-08-20T23:00:00')

describe('mySlot', () => {
  it('finds the slot of the user', () => {
    expect(mySlot(friday, ME)?.role).toBe(RoleValues.BARISTA)
    expect(mySlot(friday, 'someone-else')).toBeUndefined()
  })
})

describe('coworkerShift', () => {
  it('keeps the others and the open slots, without me', () => {
    const slotIds = coworkerShift(friday, ME).slots.map(slot => slot.id)
    expect(slotIds).toEqual(['fri-other', 'fri-open'])
  })
})

describe('daysUntil and relativeDay', () => {
  it('counts calendar days, not 24-hour periods', () => {
    const tonight = shift('t', '2026-10-07T23:30:00', '2026-10-08T03:00:00')
    const tomorrowMorning = shift(
      't2',
      '2026-10-08T08:00:00',
      '2026-10-08T16:00:00'
    )
    expect(daysUntil(tonight, now)).toBe(0)
    expect(daysUntil(tomorrowMorning, now)).toBe(1)
    expect(daysUntil(friday, now)).toBe(2)
  })

  it('says i dag, i morgen or om N dager', () => {
    expect(relativeDay(0)).toBe('i dag')
    expect(relativeDay(1)).toBe('i morgen')
    expect(relativeDay(2)).toBe('om 2 dager')
  })
})

describe('upcomingShifts and pastShifts', () => {
  it('sorts upcoming shifts with the first one first', () => {
    expect(upcomingShifts([wednesday, friday]).map(s => s.id)).toEqual([
      'fri',
      'wed',
    ])
  })

  it('keeps only ended shifts, the newest first', () => {
    expect(pastShifts([august, friday, lastWeek], now).map(s => s.id)).toEqual([
      'old',
      'aug',
    ])
  })
})

describe('groupByWeek', () => {
  it('groups by ISO week and adds the year when it is not this year', () => {
    expect(
      groupByWeek([friday, wednesday, nextYear], now).map(group => [
        group.label,
        group.shifts.map(s => s.id),
      ])
    ).toEqual([
      ['Uke 41', ['fri']],
      ['Uke 42', ['wed']],
      ['Uke 1, 2027', ['jan']],
    ])
  })
})

describe('groupByMonth', () => {
  it('groups by month in the order given', () => {
    expect(
      groupByMonth([lastWeek, august]).map(group => [
        group.label,
        group.shifts.map(s => s.id),
      ])
    ).toEqual([
      ['September 2026', ['old']],
      ['August 2026', ['aug']],
    ])
  })
})
