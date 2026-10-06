import { PlanningPeriodStatusValues } from './consts'
import {
  planningPeriodFormSchema,
  planningPeriodLabel,
  planningStatusLabel,
  spareCandidates,
  toGraphqlDateTime,
} from './planning'

describe('planning helpers', () => {
  it('labels the planning period statuses', () => {
    expect(planningStatusLabel(PlanningPeriodStatusValues.OPEN)).toBe('Åpen')
    expect(planningStatusLabel(PlanningPeriodStatusValues.CLOSED)).toBe(
      'Fristen er gått ut'
    )
    expect(planningStatusLabel(PlanningPeriodStatusValues.PUBLISHED)).toBe(
      'Publisert'
    )
  })

  it('shows a compact period within one year', () => {
    expect(planningPeriodLabel('2026-10-01', '2026-10-14')).toBe(
      '1. okt.–14. okt. 2026'
    )
  })

  it('shows the full year on both dates across different years', () => {
    expect(planningPeriodLabel('2026-12-28', '2027-01-10')).toBe(
      '28. des. 2026–10. jan. 2027'
    )
  })

  it('finds the spare candidates of a coverage row', () => {
    expect(spareCandidates({ candidateCount: 2, openSlotCount: 3 })).toBe(-1)
    expect(spareCandidates({ candidateCount: 4, openSlotCount: 2 })).toBe(2)
  })

  it('converts the local datetime picker value to an ISO timestamp', () => {
    const result = toGraphqlDateTime('2026-10-12 20:00:00')
    expect(result).toContain('T')
    expect(result).toMatch(/Z$/)
    expect(new Date(result).getTime()).not.toBeNaN()
  })

  describe('planningPeriodFormSchema', () => {
    it('accepts valid date range and deadline', () => {
      const parsed = planningPeriodFormSchema.safeParse({
        dateFrom: '2026-10-01',
        dateTo: '2026-10-14',
        deadline: '2026-10-08 20:00:00',
      })
      expect(parsed.success).toBe(true)
    })

    it('rejects empty fields', () => {
      const parsed = planningPeriodFormSchema.safeParse({
        dateFrom: '',
        dateTo: '',
        deadline: '',
      })
      expect(parsed.success).toBe(false)
    })

    it('rejects dateTo before dateFrom', () => {
      const parsed = planningPeriodFormSchema.safeParse({
        dateFrom: '2026-10-14',
        dateTo: '2026-10-01',
        deadline: '2026-10-08 20:00:00',
      })
      expect(parsed.success).toBe(false)
      if (!parsed.success) {
        expect(parsed.error.issues[0].message).toBe(
          'Sluttdato må være på eller etter startdato'
        )
      }
    })
  })
})
