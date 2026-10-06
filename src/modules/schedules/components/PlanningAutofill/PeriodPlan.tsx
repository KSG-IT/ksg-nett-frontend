import { Divider, Stack, Text } from '@mantine/core'
import { parseISO } from 'date-fns'
import { format } from 'util/date-fns'
import { latestRun, openUnfilled } from '../../autofill'
import type { PlanningPeriodNode } from '../../types.graphql'
import { AutofillRunPanel } from './AutofillRunPanel'
import { PeriodPlanActions } from './PeriodPlanActions'

interface PeriodPlanProps {
  scheduleId: string
  period: PlanningPeriodNode
}

// The plan part of a period card: the newest autofill run with its empty
// slots, and the actions autofill, publish and "see in the grid".
export const PeriodPlan: React.FC<PeriodPlanProps> = ({
  scheduleId,
  period,
}) => {
  const run = latestRun(period.autofillRuns)
  const openSlots = run ? openUnfilled(run).length : 0
  return (
    <Stack gap="sm">
      <Divider />
      {run && <AutofillRunPanel scheduleId={scheduleId} run={run} />}
      {period.publishedAt && (
        <Text size="sm" c="dimmed">
          Publisert {format(parseISO(period.publishedAt), 'd. MMM, HH:mm')}
        </Text>
      )}
      <PeriodPlanActions
        scheduleId={scheduleId}
        period={period}
        openSlots={openSlots}
      />
    </Stack>
  )
}
