// Logic for the schedule managers' view, v2 (/schedules/:id/v2). The shifts
// have the same shape as on the shifts page (DayShift). Times are read in the
// browser's time zone, as everywhere else in the SPA.
import {
  addDays,
  format,
  getISOWeek,
  isSameDay,
  startOfISOWeek,
} from 'date-fns'
import { DayShift, DayShiftSlot, sortShifts } from './allShifts'
import { LocationValues } from './consts'

type Mode = 'SINGLE_LOCATION' | 'MULTIPLE_LOCATIONS'

export interface GridDay {
  date: Date
  shifts: DayShift[]
}

export interface GridRow {
  key: string
  // Set for several locations only. null is "no location".
  location?: LocationValues | null
  days: GridDay[]
}

export interface GridWeek {
  monday: Date
  label: string
  rows: GridRow[]
}

interface GridOptions {
  monday: Date
  weeks: number
  mode: Mode
  // The usual locations of the schedule. They get a row also without shifts.
  locations?: LocationValues[]
}

export function mondayOf(date: Date) {
  return startOfISOWeek(date)
}

// A shift belongs to the day it starts, also when it ends after midnight.
function shiftsOnDay(shifts: DayShift[], date: Date) {
  return sortShifts(
    shifts.filter(shift => isSameDay(new Date(shift.datetimeStart), date))
  )
}

function weekDays(monday: Date) {
  return Array.from({ length: 7 }, (_, index) => addDays(monday, index))
}

function rowLocations(shifts: DayShift[], given: LocationValues[]) {
  const found = shifts
    .map(shift => shift.location)
    .filter(location => location !== null && !given.includes(location))
  const locations: (LocationValues | null)[] = [
    ...new Set([...given, ...found]),
  ]
  if (shifts.some(shift => shift.location === null)) locations.push(null)
  return locations
}

// One location: one row per week. Several locations: one row per location in
// each week, so a manager sees which location is short on which day.
export function scheduleGrid(
  shifts: DayShift[],
  { monday, weeks, mode, locations = [] }: GridOptions
): GridWeek[] {
  return Array.from({ length: weeks }, (_, index) => {
    const weekMonday = addDays(monday, index * 7)
    const days = weekDays(weekMonday)
    const label = `Uke ${getISOWeek(weekMonday)}`
    const weekShifts = shifts.filter(shift =>
      days.some(day => isSameDay(new Date(shift.datetimeStart), day))
    )

    if (mode === 'SINGLE_LOCATION') {
      return {
        monday: weekMonday,
        label,
        rows: [
          {
            key: format(weekMonday, 'yyyy-MM-dd'),
            days: days.map(date => ({
              date,
              shifts: shiftsOnDay(weekShifts, date),
            })),
          },
        ],
      }
    }

    return {
      monday: weekMonday,
      label,
      rows: rowLocations(weekShifts, locations).map(location => {
        const atLocation = weekShifts.filter(
          shift => shift.location === location
        )
        return {
          key: location ?? 'none',
          location,
          days: days.map(date => ({
            date,
            shifts: shiftsOnDay(atLocation, date),
          })),
        }
      }),
    }
  })
}

export interface ShiftCount {
  user: NonNullable<DayShiftSlot['user']>
  count: number
}

// Shifts per person in the shifts given, the most first. A person with two
// slots on one shift counts once.
export function shiftCounts(shifts: DayShift[]): ShiftCount[] {
  const counts = new Map<string, ShiftCount>()
  for (const shift of shifts) {
    const users = new Map(
      shift.slots
        .filter(slot => slot.user)
        .map(slot => [slot.user!.id, slot.user!])
    )
    for (const [id, user] of users) {
      const count = counts.get(id)
      if (count) count.count += 1
      else counts.set(id, { user, count: 1 })
    }
  }
  return [...counts.values()].sort(
    (a, b) =>
      b.count - a.count ||
      a.user.getCleanFullName.localeCompare(b.user.getCleanFullName)
  )
}

// The name of another shift the person has on the day of `shift`, or null.
export function busyOnDay(
  shifts: DayShift[],
  userId: string,
  shift: DayShift
): string | null {
  const day = new Date(shift.datetimeStart)
  const other = shifts.find(
    candidate =>
      candidate.id !== shift.id &&
      isSameDay(new Date(candidate.datetimeStart), day) &&
      candidate.slots.some(slot => slot.user?.id === userId)
  )
  return other?.name ?? null
}

export interface OpenSlot {
  shift: DayShift
  slot: DayShiftSlot
}

// The open slot after `slotId`, in time order. The picker moves on to it after
// a person is put in a slot.
export function nextOpenSlot(
  shifts: DayShift[],
  slotId: string
): OpenSlot | null {
  const open = sortShifts(shifts).flatMap(shift =>
    shift.slots.map(slot => ({ shift, slot }))
  )
  const index = open.findIndex(({ slot }) => slot.id === slotId)
  return open.slice(index + 1).find(({ slot }) => slot.user === null) ?? null
}

function compactHour(date: Date) {
  return format(date, date.getMinutes() ? 'HH:mm' : 'HH')
}

// "16–23" for narrow grid cells; minutes only when they are not :00.
export function compactTime(shift: DayShift) {
  return `${compactHour(new Date(shift.datetimeStart))}–${compactHour(
    new Date(shift.datetimeEnd)
  )}`
}
