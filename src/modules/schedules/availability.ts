import {
  differenceInCalendarDays,
  format,
  getISOWeek,
  isBefore,
  parseISO,
} from 'date-fns'
import {
  DefaultAvailabilityValues,
  InterestSourceValues,
  PlanningPeriodStatusValues,
} from './consts'

export type AvailabilityAnswer = 'INTERESTED' | 'AVAILABLE' | 'UNAVAILABLE'

export function answerFor(
  interestType: AvailabilityAnswer | null | undefined,
  defaultAvailability?: string | null
): AvailabilityAnswer {
  if (interestType) return interestType
  return defaultAvailability === DefaultAvailabilityValues.OPT_IN
    ? 'UNAVAILABLE'
    : 'AVAILABLE'
}

// The interestType to send. Null deletes the row, so the default answer is
// sent as null, except when there is a note: the row keeps the note.
export function answerValue(
  answer: AvailabilityAnswer,
  defaultAvailability?: string | null,
  currentAnswer?: AvailabilityAnswer | null,
  note = ''
) {
  if (note.trim()) return answer
  const isDefault =
    defaultAvailability === DefaultAvailabilityValues.OPT_IN
      ? answer === 'UNAVAILABLE'
      : answer === 'AVAILABLE'
  return isDefault && (!currentAnswer || currentAnswer === answer)
    ? null
    : answer
}

export type PlanningBannerPeriod = {
  dateFrom: string
  dateTo: string
  deadline: string
  status: string
  myDefaultAvailability: string | null
  shifts: {
    myInterest: { interestType: AvailabilityAnswer; source: string } | null
  }[]
}

export type PlanningBanner = {
  // The day before the deadline and the deadline day are urgent
  urgent: 'TODAY' | 'TOMORROW' | null
  hasChanges: boolean
  optIn: boolean
  // Shifts the member has not marked as unavailable, also by the pre-fill
  openShiftCount: number
}

export function planningBanner(
  period: PlanningBannerPeriod,
  now: Date = new Date()
): PlanningBanner | null {
  const deadline = parseISO(period.deadline)
  if (period.status !== PlanningPeriodStatusValues.OPEN) return null
  if (!isBefore(now, deadline)) return null
  const days = differenceInCalendarDays(deadline, now)
  return {
    urgent: days === 0 ? 'TODAY' : days === 1 ? 'TOMORROW' : null,
    // Pre-filled answers come from the weekly unavailability, not the user
    hasChanges: period.shifts.some(
      shift => shift.myInterest?.source === InterestSourceValues.MANUAL
    ),
    optIn: period.myDefaultAvailability === DefaultAvailabilityValues.OPT_IN,
    openShiftCount: period.shifts.filter(
      shift => shift.myInterest?.interestType !== 'UNAVAILABLE'
    ).length,
  }
}

// The local date of a datetime from the API, which comes in UTC. A shift at
// 00:30 local time belongs to that day, not the day before.
export function localDate(datetime: string) {
  return format(parseISO(datetime), 'yyyy-MM-dd')
}

export function weekRange(dateFrom: string, dateTo: string) {
  const first = getISOWeek(parseISO(dateFrom))
  const last = getISOWeek(parseISO(dateTo))
  return first === last ? `uke ${first}` : `uke ${first}–${last}`
}
