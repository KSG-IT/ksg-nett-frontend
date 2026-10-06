// Logic for the shifts page (/schedules/all-shifts): the list (ShiftList) and
// the timeline (ShiftTimeline). Times are read in the browser's time zone, as
// everywhere else in the SPA.
import type { UserThumbnailProps } from 'modules/users/types'
import { LocationValues, RoleValues } from './consts'
import type { SlotDraft } from './drafts'

export interface DayShiftSlot {
  id: string
  role: RoleValues
  user: UserThumbnailProps['user'] | null
  // Managers only, see drafts.ts. `user` is the person after the draft when
  // applyDrafts has run, and `lockedUser` the person before it.
  draft?: SlotDraft | null
  lockedUser?: UserThumbnailProps['user'] | null
}

export interface DayShift {
  id: string
  name: string
  location: LocationValues | null
  datetimeStart: string
  datetimeEnd: string
  schedule: { id: string; name: string }
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

export const DAY_PARTS: DayPart[] = ['Dag', 'Kveld', 'Natt']

export function parseDayPart(value: string | null): DayPart | null {
  return DAY_PARTS.find(part => part === value) ?? null
}

// By start hour: Dag 05–14, Kveld 15–18, Natt 19–04.
export function dayPart(shift: DayShift): DayPart {
  const hour = new Date(shift.datetimeStart).getHours()
  if (hour >= 5 && hour < 15) return 'Dag'
  if (hour >= 15 && hour < 19) return 'Kveld'
  return 'Natt'
}

export function groupByDayPart<T extends DayShift>(shifts: T[]) {
  const sorted = sortShifts(shifts)
  return DAY_PARTS.map(part => ({
    part,
    shifts: sorted.filter(shift => dayPart(shift) === part),
  })).filter(group => group.shifts.length > 0)
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

// A shift that ends when the other starts does not overlap it.
export function overlaps(a: DayShift, b: DayShift) {
  return start(a) < end(b) && start(b) < end(a)
}

export interface ShiftFilter {
  scheduleId: string | null
  part: DayPart | null
  // "Jobber samtidig som meg": only the shifts that overlap one of your
  // shifts, your own shifts included. Without a shift of your own on the day,
  // this filter does nothing.
  withMe: boolean
}

export function filterShifts<T extends DayShift>(
  shifts: T[],
  filter: ShiftFilter,
  userId: string | undefined
): T[] {
  const mine = shifts.filter(shift => isMine(shift, userId))
  return shifts.filter(
    shift =>
      (filter.scheduleId === null || shift.schedule.id === filter.scheduleId) &&
      (filter.part === null || dayPart(shift) === filter.part) &&
      (!filter.withMe ||
        mine.length === 0 ||
        mine.some(myShift => overlaps(shift, myShift)))
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
