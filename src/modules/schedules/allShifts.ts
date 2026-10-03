// Logic for the shifts page (/schedules/all-shifts): the list (ShiftList) and
// the timeline (ShiftTimeline). Times are read in the browser's time zone, as
// everywhere else in the SPA.
import type { UserThumbnailProps } from 'modules/users/types'
import { LocationValues, RoleValues } from './consts'

export interface DayShiftSlot {
  id: string
  role: RoleValues
  user: UserThumbnailProps['user'] | null
}

export interface DayShift {
  id: string
  name: string
  location: LocationValues | null
  datetimeStart: string
  datetimeEnd: string
  slots: DayShiftSlot[]
}

const HOUR_MS = 60 * 60 * 1000

const start = (shift: DayShift) => new Date(shift.datetimeStart).getTime()
const end = (shift: DayShift) => new Date(shift.datetimeEnd).getTime()

export function sortShifts<T extends DayShift>(shifts: T[]): T[] {
  return [...shifts].sort(
    (a, b) =>
      start(a) - start(b) || end(a) - end(b) || a.name.localeCompare(b.name)
  )
}

export type DayPart = 'Dag' | 'Kveld' | 'Natt'

// By start hour: Dag 05–14, Kveld 15–18, Natt 19–04.
export function dayPart(shift: DayShift): DayPart {
  const hour = new Date(shift.datetimeStart).getHours()
  if (hour >= 5 && hour < 15) return 'Dag'
  if (hour >= 15 && hour < 19) return 'Kveld'
  return 'Natt'
}

export function groupByDayPart<T extends DayShift>(shifts: T[]) {
  const parts: DayPart[] = ['Dag', 'Kveld', 'Natt']
  const sorted = sortShifts(shifts)
  return parts
    .map(part => ({
      part,
      shifts: sorted.filter(shift => dayPart(shift) === part),
    }))
    .filter(group => group.shifts.length > 0)
}

export function slotCounts(shift: DayShift) {
  const filled = shift.slots.filter(slot => slot.user !== null).length
  return {
    filled,
    total: shift.slots.length,
    open: shift.slots.length - filled,
  }
}

export function isMine(shift: DayShift, userId: string | undefined) {
  return (
    userId !== undefined && shift.slots.some(slot => slot.user?.id === userId)
  )
}

export interface TimelineRange {
  start: Date
  end: Date
}

// A Samfundet day: 06:00 to 06:00 the next morning, so night shifts fit and
// the hours are in the same place on every day. The day is the day of the
// first shift. A shift outside the day makes the range longer, to whole hours.
export const DAY_START_HOUR = 6

export function timelineRange(shifts: DayShift[]): TimelineRange | null {
  if (shifts.length === 0) return null
  const first = Math.min(...shifts.map(start))
  const last = Math.max(...shifts.map(end))

  const dayStart = new Date(first)
  dayStart.setHours(DAY_START_HOUR, 0, 0, 0)
  // setDate, not + 24 hours, so a day with a daylight saving change works
  const dayEnd = new Date(dayStart)
  dayEnd.setDate(dayEnd.getDate() + 1)

  const firstHour = new Date(first)
  firstHour.setMinutes(0, 0, 0)
  const lastHour = new Date(last)
  if (
    lastHour.getMinutes() ||
    lastHour.getSeconds() ||
    lastHour.getMilliseconds()
  ) {
    lastHour.setMinutes(0, 0, 0)
    lastHour.setTime(lastHour.getTime() + HOUR_MS)
  }

  return {
    start: new Date(Math.min(dayStart.getTime(), firstHour.getTime())),
    end: new Date(Math.max(dayEnd.getTime(), lastHour.getTime())),
  }
}

// The whole hours in the range, for the time axis.
export function timelineHours(range: TimelineRange) {
  const hours: Date[] = []
  for (let t = range.start.getTime(); t <= range.end.getTime(); t += HOUR_MS) {
    hours.push(new Date(t))
  }
  return hours
}

// Left edge and width of a shift, in percent of the range.
export function timelinePosition(shift: DayShift, range: TimelineRange) {
  const total = range.end.getTime() - range.start.getTime()
  return {
    left: ((start(shift) - range.start.getTime()) / total) * 100,
    width: ((end(shift) - start(shift)) / total) * 100,
  }
}

export interface Lane<T extends DayShift> {
  location: LocationValues | null
  // Shifts on one row do not overlap.
  rows: T[][]
}

// One lane per location, in the order of their first shift. Shifts without a
// location get the last lane. Overlapping shifts at one location go on
// separate rows.
export function laneLayout<T extends DayShift>(shifts: T[]): Lane<T>[] {
  const lanes: Lane<T>[] = []
  for (const shift of sortShifts(shifts)) {
    let lane = lanes.find(l => l.location === shift.location)
    if (!lane) {
      lane = { location: shift.location, rows: [] }
      lanes.push(lane)
    }
    const row = lane.rows.find(r => end(r[r.length - 1]) <= start(shift))
    if (row) row.push(shift)
    else lane.rows.push([shift])
  }
  return [
    ...lanes.filter(lane => lane.location !== null),
    ...lanes.filter(lane => lane.location === null),
  ]
}
