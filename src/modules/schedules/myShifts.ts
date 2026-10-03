// Logic for Mine vakter (/schedules/me). The shifts have the same shape as on
// the shifts page (DayShift). Times are read in the browser's time zone.
import {
  differenceInCalendarDays,
  format,
  getISOWeek,
  getISOWeekYear,
} from 'date-fns'
import { nb } from 'date-fns/locale'
import { DayShift } from './allShifts'

const start = (shift: DayShift) => new Date(shift.datetimeStart)
const end = (shift: DayShift) => new Date(shift.datetimeEnd)

export function mySlot(shift: DayShift, meId: string) {
  return shift.slots.find(slot => slot.user?.id === meId)
}

// The same shift without my slot: the people I work with and the open slots.
export function coworkerShift(shift: DayShift, meId: string): DayShift {
  return {
    ...shift,
    slots: shift.slots.filter(slot => slot.user?.id !== meId),
  }
}

// Calendar days, so a shift tonight is "i dag" and one tomorrow morning is
// "i morgen", whatever the hour now.
export function daysUntil(shift: DayShift, now: Date) {
  return differenceInCalendarDays(start(shift), now)
}

export function relativeDay(days: number) {
  if (days <= 0) return 'i dag'
  if (days === 1) return 'i morgen'
  return `om ${days} dager`
}

export function upcomingShifts(shifts: DayShift[]) {
  return [...shifts].sort((a, b) => start(a).getTime() - start(b).getTime())
}

// allMyShifts also has future shifts. Tidligere shows only ended shifts.
export function pastShifts(shifts: DayShift[], now: Date) {
  return shifts
    .filter(shift => end(shift) <= now)
    .sort((a, b) => start(b).getTime() - start(a).getTime())
}

export interface ShiftGroup {
  key: string
  label: string
  shifts: DayShift[]
}

function groupBy(
  shifts: DayShift[],
  keyOf: (date: Date) => string,
  labelOf: (date: Date) => string
) {
  const groups: ShiftGroup[] = []
  for (const shift of shifts) {
    const date = start(shift)
    const key = keyOf(date)
    const group = groups.find(g => g.key === key)
    if (group) group.shifts.push(shift)
    else groups.push({ key, label: labelOf(date), shifts: [shift] })
  }
  return groups
}

// ISO weeks, as in a Norwegian calendar. The year is added when it is not
// the year of `now`.
export function groupByWeek(shifts: DayShift[], now: Date) {
  return groupBy(
    shifts,
    date => `${getISOWeekYear(date)}-${getISOWeek(date)}`,
    date => {
      const year = getISOWeekYear(date)
      const week = `Uke ${getISOWeek(date)}`
      return year === getISOWeekYear(now) ? week : `${week}, ${year}`
    }
  )
}

export function groupByMonth(shifts: DayShift[]) {
  return groupBy(
    shifts,
    date => format(date, 'yyyy-MM'),
    date => {
      const label = format(date, 'LLLL yyyy', { locale: nb })
      return label.charAt(0).toUpperCase() + label.slice(1)
    }
  )
}
