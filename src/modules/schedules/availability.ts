import {
  differenceInCalendarDays,
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

export function answerValue(
  answer: AvailabilityAnswer,
  defaultAvailability?: string | null,
  currentAnswer?: AvailabilityAnswer | null
) {
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
  shifts: { myInterest: { source: string } | null }[]
}

export type PlanningBanner = {
  // The day before the deadline and the deadline day are urgent
  urgent: 'TODAY' | 'TOMORROW' | null
  hasChanges: boolean
  optIn: boolean
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
  }
}

export function weekRange(dateFrom: string, dateTo: string) {
  const first = getISOWeek(parseISO(dateFrom))
  const last = getISOWeek(parseISO(dateTo))
  return first === last ? `uke ${first}` : `uke ${first}–${last}`
}
