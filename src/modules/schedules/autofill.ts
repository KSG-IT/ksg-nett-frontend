// Autofill and publish of a planning period. Autofill writes drafts for the
// empty slots of the period. Publish locks the drafts in the period's dates.
// See ksg-nett-backend/schedules/utils/autofill.py.
import { parseISO } from 'date-fns'
import { UnfilledReasonValues } from './consts'
import type {
  AutofillRunNode,
  PlanningPeriodNode,
  UnfilledSlotNode,
} from './types.graphql'

export function unfilledReasonLabel(reason: UnfilledReasonValues): string {
  switch (reason) {
    case UnfilledReasonValues.NO_ROLE_ON_ROSTER:
      return 'Ingen på rosteren har rollen'
    case UnfilledReasonValues.NO_CANDIDATES:
      return 'Ingen kan jobbe'
    case UnfilledReasonValues.BUSY_SAME_DAY:
      return 'Kandidatene har vakt samme dag'
    case UnfilledReasonValues.WEEKLY_LIMIT:
      return 'Kandidatene har nok vakter den uka'
    case UnfilledReasonValues.SHIFT_CAP:
      return 'Kandidatene har nådd maks vakter'
  }
}

// The API gives the runs newest first. A new run replaces the drafts of the
// earlier runs, so only the newest run says something about the plan.
export function latestRun(runs: AutofillRunNode[]): AutofillRunNode | null {
  return runs[0] ?? null
}

export type OpenUnfilledSlot = UnfilledSlotNode & {
  shiftSlot: NonNullable<UnfilledSlotNode['shiftSlot']>
}

// The slots of the run that are still empty: no user and no draft. A manager
// can fill a slot by hand after the run. Earliest shift first.
export function openUnfilled(run: AutofillRunNode): OpenUnfilledSlot[] {
  return run.unfilled
    .filter(
      (row): row is OpenUnfilledSlot =>
        row.shiftSlot !== null &&
        row.shiftSlot.user === null &&
        row.shiftSlot.draft === null
    )
    .sort(
      (a, b) =>
        parseISO(a.shiftSlot.shift.datetimeStart).getTime() -
        parseISO(b.shiftSlot.shift.datetimeStart).getTime()
    )
}

// Before the deadline, members can still change their answers. A run or a
// publish then works on answers that can change.
export function beforeDeadline(
  period: Pick<PlanningPeriodNode, 'deadline'>,
  now: Date
): boolean {
  return now < parseISO(period.deadline)
}

// Autofill is not offered on a published period (decision 2026-10-06).
export function canRunAutofill(
  period: Pick<PlanningPeriodNode, 'publishedAt'>
): boolean {
  return period.publishedAt === null
}

export function countLabel(count: number, one: string, many: string) {
  return `${count} ${count === 1 ? one : many}`
}
