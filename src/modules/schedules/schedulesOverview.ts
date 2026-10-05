// Display logic for the schedules overview (/schedules).
import { differenceInCalendarDays, format } from 'date-fns'
import { nb } from 'date-fns/locale'

// A schedule with fewer planned days than this is marked, so the manager
// knows it is time to plan the next weeks.
export const SOON_DAYS = 10

export function planStatus(plannedUntil: string | null, now: Date) {
  if (!plannedUntil) return null
  const date = new Date(plannedUntil)
  const days = differenceInCalendarDays(date, now)
  return {
    label: `Planlagt til ${format(date, 'EEE d. MMM', { locale: nb })}`,
    days,
    soon: days < SOON_DAYS,
  }
}

export function slotStatus({
  filled,
  total,
}: {
  filled: number
  total: number
}) {
  return {
    open: total - filled,
    percent: total ? Math.round((filled / total) * 100) : 0,
  }
}

// The schedules the user manages (ScheduleNode.canManage) come first. The
// backend gives no numbers for the others.
export function splitByManagement<T extends { canManage: boolean }>(
  schedules: T[]
) {
  return {
    managed: schedules.filter(schedule => schedule.canManage),
    others: schedules.filter(schedule => !schedule.canManage),
  }
}
