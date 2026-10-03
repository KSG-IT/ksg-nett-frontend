import {
  DayShift,
  groupByDayPart,
  isMine,
  laneLayout,
  slotCounts,
  sortShifts,
  timelinePosition,
  timelineRange,
} from './allShifts'
import { LocationValues, RoleValues } from './consts'

// Local times without an offset, so the tests give the same result in any
// time zone.
function shift(
  id: string,
  start: string,
  end: string,
  location: LocationValues | null = LocationValues.EDGAR,
  userIds: (string | null)[] = ['1']
): DayShift {
  return {
    id,
    name: `Vakt ${id}`,
    location,
    datetimeStart: start,
    datetimeEnd: end,
    slots: userIds.map((userId, index) => ({
      id: `${id}-${index}`,
      role: RoleValues.BARISTA,
      user:
        userId === null
          ? null
          : {
              id: userId,
              initials: 'OL',
              firstName: 'Ola',
              getFullWithNickName: 'Ola Nordmann',
              getCleanFullName: 'Ola Nordmann',
              profileImage: null,
            },
    })),
  }
}

const morning = shift('a', '2026-10-09T08:00:00', '2026-10-09T16:00:00')
const kitchen = shift(
  'b',
  '2026-10-09T15:00:00',
  '2026-10-09T23:00:00',
  LocationValues.LYCHE_KJOKKEN
)
const evening = shift('c', '2026-10-09T16:00:00', '2026-10-09T23:00:00')
const bar = shift(
  'd',
  '2026-10-09T20:00:00',
  '2026-10-10T02:30:00',
  LocationValues.BODEGAEN
)

describe('sortShifts', () => {
  it('sorts by start time', () => {
    expect(sortShifts([bar, evening, morning, kitchen]).map(s => s.id)).toEqual(
      ['a', 'b', 'c', 'd']
    )
  })
})

describe('groupByDayPart', () => {
  it('groups by start hour into Dag, Kveld and Natt, in that order', () => {
    const late = shift('e', '2026-10-10T01:00:00', '2026-10-10T03:00:00')
    expect(
      groupByDayPart([late, bar, evening, kitchen, morning]).map(group => [
        group.part,
        group.shifts.map(s => s.id),
      ])
    ).toEqual([
      ['Dag', ['a']],
      ['Kveld', ['b', 'c']],
      ['Natt', ['d', 'e']],
    ])
  })

  it('leaves out parts without shifts', () => {
    expect(groupByDayPart([morning]).map(group => group.part)).toEqual(['Dag'])
  })
})

describe('slotCounts', () => {
  it('counts filled and open slots', () => {
    expect(slotCounts(shift('x', '', '', null, ['1', '2', null]))).toEqual({
      filled: 2,
      total: 3,
      open: 1,
    })
  })
})

describe('isMine', () => {
  it('is true when the user has a slot on the shift', () => {
    expect(isMine(shift('x', '', '', null, ['1', '7']), '7')).toBe(true)
    expect(isMine(shift('x', '', '', null, ['1', null]), '7')).toBe(false)
  })
})

describe('timelineRange', () => {
  it('spans whole hours from the first start to the last end, past midnight', () => {
    const range = timelineRange([evening, bar, morning])!
    expect(range.start).toEqual(new Date('2026-10-09T08:00:00'))
    expect(range.end).toEqual(new Date('2026-10-10T03:00:00'))
  })

  it('is null without shifts', () => {
    expect(timelineRange([])).toBeNull()
  })
})

describe('timelinePosition', () => {
  it('places a shift as a share of the range', () => {
    const range = timelineRange([morning, bar])! // 08:00 to 03:00, 19 hours
    const position = timelinePosition(morning, range)
    expect(position.left).toBeCloseTo(0)
    expect(position.width).toBeCloseTo((8 / 19) * 100)
    expect(timelinePosition(bar, range).left).toBeCloseTo((12 / 19) * 100)
  })
})

describe('laneLayout', () => {
  it('makes one lane per location, in the order of the first start', () => {
    expect(
      laneLayout([bar, evening, kitchen, morning]).map(lane => lane.location)
    ).toEqual([
      LocationValues.EDGAR,
      LocationValues.LYCHE_KJOKKEN,
      LocationValues.BODEGAEN,
    ])
  })

  it('keeps shifts that follow each other on one row', () => {
    const [edgar] = laneLayout([morning, evening])
    expect(edgar.rows.map(row => row.map(s => s.id))).toEqual([['a', 'c']])
  })

  it('puts overlapping shifts at one location on separate rows', () => {
    const extra = shift('f', '2026-10-09T18:00:00', '2026-10-09T22:00:00')
    const [edgar] = laneLayout([morning, evening, extra])
    expect(edgar.rows.map(row => row.map(s => s.id))).toEqual([
      ['a', 'c'],
      ['f'],
    ])
  })

  it('puts shifts without a location in a last lane', () => {
    const noLocation = shift(
      'g',
      '2026-10-09T06:00:00',
      '2026-10-09T07:00:00',
      null
    )
    const lanes = laneLayout([noLocation, morning])
    expect(lanes.map(lane => lane.location)).toEqual([
      LocationValues.EDGAR,
      null,
    ])
  })
})
