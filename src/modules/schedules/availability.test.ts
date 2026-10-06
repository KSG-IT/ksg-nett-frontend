import {
  DefaultAvailabilityValues,
  InterestSourceValues,
  PlanningPeriodStatusValues,
} from './consts'
import {
  answerFor,
  answerValue,
  localDate,
  planningBanner,
  PlanningBannerPeriod,
  weekRange,
} from './availability'

describe('availability answer defaults', () => {
  it('uses available as the normal roster default', () => {
    expect(answerFor(null, DefaultAvailabilityValues.AVAILABLE)).toBe(
      'AVAILABLE'
    )
    expect(
      answerValue('AVAILABLE', DefaultAvailabilityValues.AVAILABLE)
    ).toBeNull()
    expect(
      answerValue('AVAILABLE', DefaultAvailabilityValues.AVAILABLE, 'AVAILABLE')
    ).toBeNull()
  })
  it('uses not signed up as the opt-in default and allows opting in', () => {
    expect(answerFor(null, DefaultAvailabilityValues.OPT_IN)).toBe(
      'UNAVAILABLE'
    )
    expect(
      answerValue('UNAVAILABLE', DefaultAvailabilityValues.OPT_IN)
    ).toBeNull()
    expect(answerValue('AVAILABLE', DefaultAvailabilityValues.OPT_IN)).toBe(
      'AVAILABLE'
    )
  })
  it('requires an explicit available answer to override a prefilled unavailable row', () => {
    expect(answerFor('UNAVAILABLE', DefaultAvailabilityValues.AVAILABLE)).toBe(
      'UNAVAILABLE'
    )
    expect(
      answerValue(
        'AVAILABLE',
        DefaultAvailabilityValues.AVAILABLE,
        'UNAVAILABLE'
      )
    ).toBe('AVAILABLE')
  })
})

describe('planning banner', () => {
  const period = (
    changes: Partial<PlanningBannerPeriod> = {}
  ): PlanningBannerPeriod => ({
    dateFrom: '2026-10-19',
    dateTo: '2026-11-15',
    deadline: '2026-10-11T23:59:00+02:00',
    status: PlanningPeriodStatusValues.OPEN,
    myDefaultAvailability: DefaultAvailabilityValues.AVAILABLE,
    shifts: [{ myInterest: null }, { myInterest: null }],
    ...changes,
  })

  it('is not urgent before the day before the deadline', () => {
    expect(
      planningBanner(period(), new Date('2026-10-09T12:00:00+02:00'))
    ).toEqual({
      urgent: null,
      hasChanges: false,
      optIn: false,
      openShiftCount: 2,
    })
  })
  it('is urgent the day before and on the deadline day', () => {
    expect(
      planningBanner(period(), new Date('2026-10-10T08:00:00+02:00'))?.urgent
    ).toBe('TOMORROW')
    expect(
      planningBanner(period(), new Date('2026-10-11T08:00:00+02:00'))?.urgent
    ).toBe('TODAY')
  })
  it('is hidden after the deadline and for periods that are not open', () => {
    const now = new Date('2026-10-09T12:00:00+02:00')
    expect(
      planningBanner(period(), new Date('2026-10-12T00:00:00+02:00'))
    ).toBeNull()
    expect(
      planningBanner(period({ status: PlanningPeriodStatusValues.CLOSED }), now)
    ).toBeNull()
  })
  it('counts only manual answers as changes', () => {
    const now = new Date('2026-10-09T12:00:00+02:00')
    const prefilled = period({
      shifts: [
        {
          myInterest: {
            interestType: 'UNAVAILABLE',
            source: InterestSourceValues.UNAVAILABILITY,
          },
        },
      ],
    })
    const answered = period({
      shifts: [
        {
          myInterest: {
            interestType: 'INTERESTED',
            source: InterestSourceValues.MANUAL,
          },
        },
      ],
    })
    expect(planningBanner(prefilled, now)?.hasChanges).toBe(false)
    expect(planningBanner(answered, now)?.hasChanges).toBe(true)
  })
  it('does not count shifts the member cannot take', () => {
    const now = new Date('2026-10-09T12:00:00+02:00')
    const prefilled = period({
      shifts: [
        { myInterest: null },
        { myInterest: null },
        {
          myInterest: {
            interestType: 'UNAVAILABLE',
            source: InterestSourceValues.UNAVAILABILITY,
          },
        },
      ],
    })
    expect(planningBanner(prefilled, now)?.openShiftCount).toBe(2)
  })
  it('marks opt-in roster rows', () => {
    const optIn = period({
      myDefaultAvailability: DefaultAvailabilityValues.OPT_IN,
    })
    expect(
      planningBanner(optIn, new Date('2026-10-09T12:00:00+02:00'))?.optIn
    ).toBe(true)
  })
  it('labels the period with ISO weeks', () => {
    expect(weekRange('2026-10-19', '2026-11-15')).toBe('uke 43–46')
    expect(weekRange('2026-10-19', '2026-10-25')).toBe('uke 43')
  })
})

describe('answerValue with a note', () => {
  it('keeps a default answer that has a note, so the row keeps the note', () => {
    expect(
      answerValue(
        'AVAILABLE',
        DefaultAvailabilityValues.AVAILABLE,
        null,
        'kun etter 20'
      )
    ).toBe('AVAILABLE')
    expect(
      answerValue('UNAVAILABLE', DefaultAvailabilityValues.OPT_IN, null, ' x ')
    ).toBe('UNAVAILABLE')
  })
  it('still deletes a default answer without a note', () => {
    expect(
      answerValue('AVAILABLE', DefaultAvailabilityValues.AVAILABLE, null, '  ')
    ).toBeNull()
  })
})

describe('localDate', () => {
  it('uses the local date, not the UTC date', () => {
    // 00:30 local time, sent as UTC. East of UTC that is the day before.
    const halfPastMidnight = new Date(2026, 9, 24, 0, 30).toISOString()
    expect(localDate(halfPastMidnight)).toBe('2026-10-24')
  })
})
