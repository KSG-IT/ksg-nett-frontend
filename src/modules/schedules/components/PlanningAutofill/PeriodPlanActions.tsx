import { Button, Group, Stack, Text } from '@mantine/core'
import { modals } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import { IconSend, IconSparkles } from '@tabler/icons-react'
import { Link } from 'react-router-dom'
import { beforeDeadline, canRunAutofill, countLabel } from '../../autofill'
import { usePlanningPeriodPlanMutations } from '../../mutations.hooks'
import { planningPeriodLabel } from '../../planning'
import type { PlanningPeriodNode } from '../../types.graphql'

interface PeriodPlanActionsProps {
  scheduleId: string
  period: PlanningPeriodNode
  // Slots of the newest run that are still empty
  openSlots: number
}

// Before the deadline, members can still change their answers.
const DeadlineWarning: React.FC = () => (
  <Text size="sm" c="orange" fw={600}>
    Fristen har ikke gått ut. Medlemmene kan fortsatt endre svarene sine.
  </Text>
)

function handleError({ message }: { message: string }) {
  showNotification({ title: 'Noe gikk galt', message, color: 'red' })
}

// Autofill writes drafts for the empty slots of the period. Publish locks the
// drafts in the period's dates and emails the members with new shifts. Both
// are hidden for a published period; the v2 grid can still lock new drafts.
export const PeriodPlanActions: React.FC<PeriodPlanActionsProps> = ({
  scheduleId,
  period,
  openSlots,
}) => {
  const {
    runAutofill,
    runAutofillLoading,
    publishPeriod,
    publishPeriodLoading,
  } = usePlanningPeriodPlanMutations(scheduleId)
  const busy = runAutofillLoading || publishPeriodLoading
  const dates = planningPeriodLabel(period.dateFrom, period.dateTo)

  function handleRunAutofill() {
    const early = beforeDeadline(period, new Date())
    modals.openConfirmModal({
      title: 'Kjøre autofyll?',
      children: (
        <Stack gap="xs">
          {early && <DeadlineWarning />}
          <Text size="sm">
            Autofyll fyller de tomme plassene i {dates} med utkast. Utkast fra
            en tidligere autofyll i perioden erstattes. Utkast du har satt selv,
            beholdes.
          </Text>
          <Text size="sm">Medlemmene ser ingenting før du publiserer.</Text>
        </Stack>
      ),
      labels: {
        confirm: early ? 'Kjør likevel' : 'Kjør autofyll',
        cancel: 'Avbryt',
      },
      confirmProps: { color: early ? 'orange' : undefined },
      onConfirm: () =>
        runAutofill({
          variables: { planningPeriodId: period.id },
          onCompleted: ({ runAutofill }) =>
            showNotification({
              title: 'Autofyll er ferdig',
              message: `${countLabel(
                runAutofill.autofillRun.draftCount,
                'utkast',
                'utkast'
              )}. ${countLabel(
                runAutofill.autofillRun.unfilled.length,
                'plass',
                'plasser'
              )} er tomme.`,
            }),
          onError: handleError,
        }),
    })
  }

  function handlePublish() {
    const early = beforeDeadline(period, new Date())
    modals.openConfirmModal({
      title: `Publisere ${dates}?`,
      children: (
        <Stack gap="xs">
          {early && <DeadlineWarning />}
          <Text size="sm">
            Utkastene i perioden låses inn og blir synlige for medlemmene. Hvert
            medlem med varsling på får én e-post med de nye vaktene.
          </Text>
          {openSlots > 0 && (
            <Text size="sm">
              {countLabel(openSlots, 'plass', 'plasser')} er fortsatt tomme.
            </Text>
          )}
        </Stack>
      ),
      labels: { confirm: 'Publiser og varsle', cancel: 'Avbryt' },
      onConfirm: () =>
        publishPeriod({
          variables: { id: period.id },
          onCompleted: ({ publishPlanningPeriod }) =>
            showNotification({
              title: 'Perioden er publisert',
              message: `${publishPlanningPeriod.changedSlots} plasser låst inn. ${publishPlanningPeriod.notifiedUsers} varslet på e-post.`,
            }),
          onError: handleError,
        }),
    })
  }

  return (
    <Group gap="xs" wrap="wrap">
      <Button
        size="compact-sm"
        variant="default"
        component={Link}
        to={`/schedules/${scheduleId}/v2?from=${period.dateFrom}`}
      >
        Se i vaktplanen
      </Button>
      {canRunAutofill(period) && (
        <Button
          size="compact-sm"
          variant="light"
          leftSection={<IconSparkles size={14} />}
          loading={runAutofillLoading}
          disabled={busy}
          onClick={handleRunAutofill}
        >
          Kjør autofyll
        </Button>
      )}
      {period.publishedAt === null && (
        <Button
          size="compact-sm"
          leftSection={<IconSend size={14} />}
          loading={publishPeriodLoading}
          disabled={busy}
          onClick={handlePublish}
        >
          Publiser
        </Button>
      )}
    </Group>
  )
}
