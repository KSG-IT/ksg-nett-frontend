import { DayShift } from './allShifts'
import { LocationValues, RoleValues } from './consts'
import {
  busyOnDay,
  compactTime,
  mondayOf,
  nextOpenSlot,
  phoneDays,
  scheduleGrid,
  shiftCounts,
} from './scheduleGrid'

function person(id: string) {
  return {
    id,
    initials: id.slice(0, 2).toUpperCase(),
    firstName: id,
    getFullWithNickName: id,
    getCleanFullName: id,
    profileImage: null,
  }
}

// Local times without an offset, so the tests give the same result in any
// time zone.
function shift(
  id: string,
  start: string,
  end: string,
  users: (string | null)[],
  location: LocationValues | null = LocationValues.EDGAR
): DayShift {
  return {
    id,
    name: `Vakt ${id}`,
    location,
    datetimeStart: start,
    datetimeEnd: end,
    schedule: { id: 'bar', name: 'Bargjengen' },
    slots: users.map((user, index) => ({
      id: `${id}-${index}`,
      role: RoleValues.BARISTA,
      user: user ? person(user) : null,
    })),
  }
}

// Monday 5 October 2026 is the first day of week 41.
const monday = new Date('2026-10-05T00:00:00')
const mondayEvening = shift(
  'mon-eve',
  '2026-10-05T16:00:00',
  '2026-10-05T23:00:00',
  ['ola', null]
)
const mondayMorning = shift(
  'mon-mor',
  '2026-10-05T08:00:00',
  '2026-10-05T16:00:00',
  ['ingrid', 'per']
)
// Starts on Friday and ends on Saturday: it belongs to Friday.
const fridayBar = shift(
  'fri-bar',
  '2026-10-09T20:00:00',
  '2026-10-10T03:00:00',
  ['ola', null, null],
  LocationValues.BODEGAEN
)
const nextWeek = shift('next', '2026-10-13T16:00:00', '2026-10-13T23:00:00', [
  'per',
])
const shifts = [nextWeek, fridayBar, mondayEvening, mondayMorning]

describe('mondayOf', () => {
  it('gives the Monday of the week at midnight', () => {
    expect(mondayOf(new Date('2026-10-11T22:00:00'))).toEqual(monday)
    expect(mondayOf(new Date('2026-10-05T00:30:00'))).toEqual(monday)
  })
})

describe('scheduleGrid', () => {
  it('has one row per week with seven days for one location', () => {
    const grid = scheduleGrid(shifts, {
      monday,
      weeks: 2,
      mode: 'SINGLE_LOCATION',
    })
    expect(grid.map(week => week.label)).toEqual(['Uke 41', 'Uke 42'])
    expect(grid[0].rows).toHaveLength(1)
    const days = grid[0].rows[0].days
    expect(days).toHaveLength(7)
    expect(days[0].shifts.map(s => s.id)).toEqual(['mon-mor', 'mon-eve'])
    expect(days[4].shifts.map(s => s.id)).toEqual(['fri-bar'])
    expect(days[5].shifts).toEqual([])
    expect(grid[1].rows[0].days[1].shifts.map(s => s.id)).toEqual(['next'])
  })

  it('has one row per location for several locations, the given ones first', () => {
    const grid = scheduleGrid(shifts, {
      monday,
      weeks: 1,
      mode: 'MULTIPLE_LOCATIONS',
      locations: [LocationValues.LYCHE_BAR, LocationValues.EDGAR],
    })
    expect(grid[0].rows.map(row => row.location)).toEqual([
      LocationValues.LYCHE_BAR,
      LocationValues.EDGAR,
      LocationValues.BODEGAEN,
    ])
    // A given location has a row also when it has no shifts
    expect(grid[0].rows[0].days.every(day => day.shifts.length === 0)).toBe(
      true
    )
    expect(grid[0].rows[2].days[4].shifts.map(s => s.id)).toEqual(['fri-bar'])
  })

  it('puts shifts without a location in the last row', () => {
    const noLocation = shift(
      'none',
      '2026-10-06T12:00:00',
      '2026-10-06T14:00:00',
      [],
      null
    )
    const grid = scheduleGrid([noLocation, mondayMorning], {
      monday,
      weeks: 1,
      mode: 'MULTIPLE_LOCATIONS',
    })
    expect(grid[0].rows.map(row => row.location)).toEqual([
      LocationValues.EDGAR,
      null,
    ])
  })
})

describe('shiftCounts', () => {
  it('counts filled slots per person, the most shifts first', () => {
    expect(
      shiftCounts(shifts).map(count => [count.user.id, count.count])
    ).toEqual([
      ['ola', 2],
      ['per', 2],
      ['ingrid', 1],
    ])
  })
})

describe('busyOnDay', () => {
  it('names the other shift a person has on the same day', () => {
    expect(busyOnDay(shifts, 'ingrid', mondayEvening)).toBe('Vakt mon-mor')
  })

  it('is null when the person is free that day, or only on this shift', () => {
    expect(busyOnDay(shifts, 'ingrid', fridayBar)).toBeNull()
    expect(busyOnDay(shifts, 'ola', mondayEvening)).toBeNull()
  })
})

describe('nextOpenSlot', () => {
  it('gives the next open slot in time order, after the given slot', () => {
    expect(nextOpenSlot(shifts, 'mon-eve-1')?.slot.id).toBe('fri-bar-1')
    expect(nextOpenSlot(shifts, 'fri-bar-1')?.slot.id).toBe('fri-bar-2')
  })

  it('is null when there are no more open slots', () => {
    expect(nextOpenSlot(shifts, 'fri-bar-2')).toBeNull()
  })
})

describe('compactTime', () => {
  it('drops :00 and keeps other minutes', () => {
    expect(compactTime(mondayEvening)).toBe('16–23')
    expect(
      compactTime(shift('x', '2026-10-05T20:30:00', '2026-10-06T02:00:00', []))
    ).toBe('20:30–02')
  })
})

describe('phoneDays', () => {
  it('lists the days of one location with their shifts', () => {
    const grid = scheduleGrid(shifts, {
      monday,
      weeks: 1,
      mode: 'SINGLE_LOCATION',
    })
    const days = phoneDays(grid)
    expect(days).toHaveLength(7)
    expect(days[0].groups).toEqual([
      {
        key: 'all',
        location: undefined,
        shifts: [mondayMorning, mondayEvening],
      },
    ])
    expect(days[1].groups).toEqual([])
  })

  it('groups the shifts of a day by location, and leaves out empty locations', () => {
    const grid = scheduleGrid(shifts, {
      monday,
      weeks: 1,
      mode: 'MULTIPLE_LOCATIONS',
      locations: [LocationValues.LYCHE_BAR, LocationValues.EDGAR],
    })
    const friday = phoneDays(grid)[4]
    expect(friday.groups.map(group => group.location)).toEqual([
      LocationValues.BODEGAEN,
    ])
    expect(phoneDays(grid)[0].groups.map(group => group.location)).toEqual([
      LocationValues.EDGAR,
    ])
  })

  it('has seven empty days for a week with no rows', () => {
    const grid = scheduleGrid([], {
      monday,
      weeks: 1,
      mode: 'MULTIPLE_LOCATIONS',
    })
    const days = phoneDays(grid)
    expect(days).toHaveLength(7)
    expect(days[0].date).toEqual(monday)
    expect(days.every(day => day.groups.length === 0)).toBe(true)
  })

  it('has the days of all weeks in order', () => {
    const grid = scheduleGrid(shifts, {
      monday,
      weeks: 2,
      mode: 'SINGLE_LOCATION',
    })
    const days = phoneDays(grid)
    expect(days).toHaveLength(14)
    expect(days[8].groups[0].shifts.map(s => s.id)).toEqual(['next'])
  })
})
