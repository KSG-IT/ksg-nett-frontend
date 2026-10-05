import { parseISO } from 'date-fns'
import { format } from '../../util/date-fns'
import { z } from 'zod'
import { PlanningPeriodStatusValues } from './consts'
import type { SlotCoverageNode } from './types.graphql'

export const planningPeriodFormSchema = z
  .object({
    dateFrom: z.string().min(1, 'Velg startdato'),
    dateTo: z.string().min(1, 'Velg sluttdato'),
    deadline: z.string().min(1, 'Velg frist for tilgjengelighet'),
  })
  .refine(
    values => {
      if (!values.dateFrom || !values.dateTo) return true
      return values.dateTo >= values.dateFrom
    },
    {
      message: 'Sluttdato må være på eller etter startdato',
      path: ['dateTo'],
    }
  )

export type PlanningPeriodFormValues = z.infer<typeof planningPeriodFormSchema>

export function planningStatusLabel(
  status: PlanningPeriodStatusValues
): string {
  switch (status) {
    case PlanningPeriodStatusValues.OPEN:
      return 'Åpen'
    case PlanningPeriodStatusValues.CLOSED:
      return 'Fristen er gått ut'
    case PlanningPeriodStatusValues.PUBLISHED:
      return 'Publisert'
  }
}

export function planningPeriodLabel(dateFrom: string, dateTo: string): string {
  const from = parseISO(dateFrom)
  const to = parseISO(dateTo)
  const fromFormat =
    from.getFullYear() === to.getFullYear() ? 'd. MMM' : 'd. MMM yyyy'
  return `${format(from, fromFormat)}–${format(to, 'd. MMM yyyy')}`
}

// Mantine returns local picker values such as "2026-10-12 20:00:00". GraphQL
// DateTime requires ISO-8601, and the backend stores an aware timestamp.
export function toGraphqlDateTime(value: string): string {
  return parseISO(value.replace(' ', 'T')).toISOString()
}

// A negative number means that there are fewer candidates than open slots.
export function spareCandidates(
  coverage: Pick<SlotCoverageNode, 'candidateCount' | 'openSlotCount'>
): number {
  return coverage.candidateCount - coverage.openSlotCount
}
