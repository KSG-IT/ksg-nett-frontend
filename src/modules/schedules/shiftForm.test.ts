import { DayShift } from './allShifts'
import { LocationValues, RoleValues } from './consts'
import {
  clockTime,
  emptyShiftForm,
  nameSuggestions,
  roleCounts,
  roleOptionGroups,
  rolesInUse,
  setRoleCount,
  toCreateInput,
  toUpdateInput,
} from './shiftForm'

function shift(
  id: string,
  name: string,
  start: string,
  end: string,
  roles: RoleValues[],
  location: LocationValues | null = LocationValues.EDGAR
): DayShift {
  return {
    id,
    name,
    location,
    datetimeStart: start,
    datetimeEnd: end,
    schedule: { id: 'bar', name: 'Bargjengen' },
    slots: roles.map((role, index) => ({
      id: `${id}-${index}`,
      role,
      user: null,
    })),
  }
}

const { BARISTA, KAFEANSVARLIG, BARTENDER } = RoleValues

// Local times without an offset, so the tests give the same result in any
// time zone.
const oldEvening = shift(
  'a',
  'Kveld',
  '2026-10-05T16:00:00',
  '2026-10-05T23:00:00',
  [BARISTA, KAFEANSVARLIG]
)
const newEvening = shift(
  'b',
  'Kveld',
  '2026-10-06T16:30:00',
  '2026-10-06T23:00:00',
  [BARISTA, BARISTA, KAFEANSVARLIG]
)
const morning = shift(
  'c',
  'Morgen',
  '2026-10-06T08:00:00',
  '2026-10-06T16:00:00',
  [BARISTA]
)
const bar = shift(
  'd',
  'Bar',
  '2026-10-06T20:00:00',
  '2026-10-07T03:00:00',
  [BARTENDER],
  LocationValues.BODEGAEN
)

describe('clockTime', () => {
  it('gives the local clock time', () => {
    expect(clockTime('2026-10-06T16:30:00')).toBe('16:30')
  })
})

describe('roleCounts', () => {
  it('counts slots per role, in the order of the first slot', () => {
    expect(roleCounts(newEvening.slots)).toEqual([
      { role: BARISTA, count: 2 },
      { role: KAFEANSVARLIG, count: 1 },
    ])
  })
})

describe('nameSuggestions', () => {
  it('gives the names at the location, the most used first, from the newest shift', () => {
    const suggestions = nameSuggestions(
      [morning, oldEvening, bar, newEvening],
      LocationValues.EDGAR
    )
    expect(suggestions.map(s => s.name)).toEqual(['Kveld', 'Morgen'])
    expect(suggestions[0]).toEqual({
      name: 'Kveld',
      startTime: '16:30',
      endTime: '23:00',
      slots: [
        { role: BARISTA, count: 2 },
        { role: KAFEANSVARLIG, count: 1 },
      ],
    })
  })

  it('uses all shifts when there is no location', () => {
    expect(nameSuggestions([morning, bar], null).map(s => s.name)).toEqual([
      'Bar',
      'Morgen',
    ])
  })
})

describe('emptyShiftForm', () => {
  it('starts with the date and the location, and no slots', () => {
    expect(
      emptyShiftForm(new Date('2026-10-09T00:00:00'), LocationValues.EDGAR)
    ).toEqual({
      name: '',
      location: LocationValues.EDGAR,
      date: '2026-10-09',
      startTime: '16:00',
      endTime: '23:00',
      slots: [],
    })
  })
})

describe('setRoleCount', () => {
  const slots = [
    { role: BARISTA, count: 2 },
    { role: KAFEANSVARLIG, count: 1 },
  ]

  it('changes the count of a role', () => {
    expect(setRoleCount(slots, BARISTA, 3)).toEqual([
      { role: BARISTA, count: 3 },
      { role: KAFEANSVARLIG, count: 1 },
    ])
  })

  it('removes the role at 0', () => {
    expect(setRoleCount(slots, KAFEANSVARLIG, 0)).toEqual([
      { role: BARISTA, count: 2 },
    ])
  })
})

describe('toCreateInput and toUpdateInput', () => {
  const form = {
    name: ' Kveld ',
    location: LocationValues.EDGAR,
    date: '2026-10-09',
    startTime: '16:00',
    endTime: '23:00',
    slots: [
      { role: BARISTA, count: 2 },
      { role: KAFEANSVARLIG, count: 0 },
    ],
  }

  it('sends clock times and drops roles with no slots', () => {
    expect(toCreateInput('schedule-1', form)).toEqual({
      scheduleId: 'schedule-1',
      name: 'Kveld',
      location: LocationValues.EDGAR,
      date: '2026-10-09',
      startTime: '16:00:00',
      endTime: '23:00:00',
      slots: [{ shiftSlotRole: BARISTA, count: 2 }],
    })
  })

  it('sends the details of a shift without slots', () => {
    expect(toUpdateInput('shift-1', form)).toEqual({
      shiftId: 'shift-1',
      name: 'Kveld',
      location: LocationValues.EDGAR,
      date: '2026-10-09',
      startTime: '16:00:00',
      endTime: '23:00:00',
    })
  })
})

describe('rolesInUse', () => {
  it('gives the roles in the shifts, the most used first', () => {
    expect(rolesInUse([oldEvening, newEvening, morning, bar])).toEqual([
      BARISTA,
      KAFEANSVARLIG,
      BARTENDER,
    ])
  })
})

describe('roleOptionGroups', () => {
  it('puts the roles in use first, and leaves out the roles in the form', () => {
    const groups = roleOptionGroups([BARISTA, KAFEANSVARLIG], [BARISTA])
    expect(groups[0]).toEqual({
      group: 'Brukt i vaktplanen',
      items: [{ value: KAFEANSVARLIG, label: 'Kafeansvarlig' }],
    })
    expect(groups[1].group).toBe('Alle roller')
    const others = groups[1].items.map(item => item.value)
    expect(others).not.toContain(BARISTA)
    expect(others).not.toContain(KAFEANSVARLIG)
    expect(others).toContain(BARTENDER)
  })

  it('has one group when no roles are in use', () => {
    expect(roleOptionGroups([], []).map(group => group.group)).toEqual([
      'Alle roller',
    ])
  })
})
