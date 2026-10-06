import { Button, Group, Stack, Text } from '@mantine/core'
import { modals } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import { IconArrowBackUp } from '@tabler/icons-react'
import { parseISO } from 'date-fns'
import { format } from 'util/date-fns'
import { countLabel, openUnfilled } from '../../autofill'
import { usePlanningPeriodPlanMutations } from '../../mutations.hooks'
import type { AutofillRunNode } from '../../types.graphql'
import { UnfilledSlotList } from './UnfilledSlotList'

interface AutofillRunPanelProps {
  scheduleId: string
  run: AutofillRunNode
}

function runAuthor(run: AutofillRunNode) {
  return run.createdBy ? ` av ${run.createdBy.getCleanFullName}` : ''
}

// The newest autofill run of a period: when it ran, its drafts, and the slots
// it left empty that are still empty. The drafts of the run can be reverted.
export const AutofillRunPanel: React.FC<AutofillRunPanelProps> = ({
  scheduleId,
  run,
}) => {
  const { revertAutofillRun, revertAutofillRunLoading } =
    usePlanningPeriodPlanMutations(scheduleId)
  const rows = openUnfilled(run)
  const drafts = countLabel(run.draftCount, 'utkast', 'utkast')

  function handleRevert() {
    modals.openConfirmModal({
      title: 'Angre autofyll?',
      children: (
        <Text size="sm">
          {drafts} fra autofyll slettes. Utkast du har endret selv, og vakter
          som er låst inn, beholdes.
        </Text>
      ),
      labels: { confirm: 'Angre autofyll', cancel: 'Avbryt' },
      confirmProps: { color: 'red' },
      onConfirm: () =>
        revertAutofillRun({
          variables: { id: run.id },
          onCompleted: ({ revertAutofillRun }) =>
            showNotification({
              message: `${countLabel(
                revertAutofillRun.removedDrafts,
                'utkast',
                'utkast'
              )} slettet`,
            }),
          onError: ({ message }) =>
            showNotification({ title: 'Noe gikk galt', message, color: 'red' }),
        }),
    })
  }

  return (
    <Stack gap="xs">
      <Group justify="space-between" gap="xs" wrap="wrap">
        <div>
          <Text fw={600} size="sm">
            Autofyll {format(parseISO(run.createdAt), 'd. MMM, HH:mm')}
            {runAuthor(run)}
          </Text>
          <Text size="xs" c="dimmed">
            {drafts} igjen ·{' '}
            {countLabel(rows.length, 'tom plass', 'tomme plasser')}
          </Text>
        </div>
        {run.draftCount > 0 && (
          <Button
            size="compact-sm"
            variant="subtle"
            color="red"
            leftSection={<IconArrowBackUp size={14} />}
            loading={revertAutofillRunLoading}
            onClick={handleRevert}
          >
            Angre autofyll
          </Button>
        )}
      </Group>
      {rows.length > 0 && <UnfilledSlotList rows={rows} />}
    </Stack>
  )
}
