import { useMutation } from '@apollo/client'
import { Button, Group, Menu, Text } from '@mantine/core'
import { modals } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import { IconChevronDown, IconLock } from '@tabler/icons-react'
import { DraftRange } from '../../drafts'
import { DISCARD_DRAFT_MUTATION, LOCK_DRAFT_MUTATION } from '../../mutations'
import { SCHEDULE_V2_QUERY } from '../../queries'
import {
  DiscardDraftReturns,
  DraftRangeVariables,
  LockDraftReturns,
} from '../../types.graphql'

interface DraftActionsProps {
  scheduleId: string
  // The dates of the visible weeks, and their name ("uke 41–43")
  range: DraftRange
  period: string
  // The drafts in the visible weeks, and in the whole schedule
  visible: number
  total: number
}

function changes(count: number) {
  return `${count} ${count === 1 ? 'endring' : 'endringer'}`
}

// A manager locks or discards the drafts of the visible weeks, or of the whole
// schedule. The whole schedule shows only when drafts exist outside the weeks.
export const DraftActions: React.FC<DraftActionsProps> = ({
  scheduleId,
  range,
  period,
  visible,
  total,
}) => {
  const [lock, { loading: locking }] = useMutation<
    LockDraftReturns,
    DraftRangeVariables
  >(LOCK_DRAFT_MUTATION, { refetchQueries: [SCHEDULE_V2_QUERY] })
  const [discard, { loading: discarding }] = useMutation<
    DiscardDraftReturns,
    DraftRangeVariables
  >(DISCARD_DRAFT_MUTATION, { refetchQueries: [SCHEDULE_V2_QUERY] })
  const outside = total - visible

  function variables(whole: boolean): DraftRangeVariables {
    return whole ? { scheduleId } : { scheduleId, ...range }
  }

  function handleError({ message }: { message: string }) {
    showNotification({ title: 'Noe gikk galt', message, color: 'red' })
  }

  function handleLock(whole: boolean) {
    modals.openConfirmModal({
      title: `Låse inn ${changes(whole ? total : visible)}?`,
      children: (
        <Text size="sm">
          {whole
            ? 'Hele vaktplanen'
            : period.charAt(0).toUpperCase() + period.slice(1)}{' '}
          blir synlig for medlemmene. Hvert medlem med varsling på får én e-post
          med de nye vaktene.
        </Text>
      ),
      labels: { confirm: 'Lås inn og varsle', cancel: 'Avbryt' },
      onConfirm: () =>
        lock({
          variables: variables(whole),
          onCompleted({ lockDraft }) {
            showNotification({
              message: `${lockDraft.changedSlots} plasser låst inn. ${lockDraft.notifiedUsers} varslet på e-post.`,
            })
          },
          onError: handleError,
        }),
    })
  }

  function handleDiscard(whole: boolean) {
    modals.openConfirmModal({
      title: `Forkaste ${changes(whole ? total : visible)}?`,
      children: (
        <Text size="sm">
          Utkastene slettes. Vaktplanen som medlemmene ser, endres ikke.
        </Text>
      ),
      labels: { confirm: 'Forkast', cancel: 'Avbryt' },
      confirmProps: { color: 'red' },
      onConfirm: () =>
        discard({
          variables: variables(whole),
          onCompleted({ discardDraft }) {
            showNotification({
              message: `${changes(discardDraft.discarded)} forkastet`,
            })
          },
          onError: handleError,
        }),
    })
  }

  return (
    <Group gap="xs" wrap="wrap">
      {visible > 0 && (
        <Button
          size="compact-sm"
          leftSection={<IconLock size={14} />}
          loading={locking}
          disabled={discarding}
          onClick={() => handleLock(false)}
        >
          Lås inn {period} ({visible})
        </Button>
      )}
      {outside > 0 && (
        <Button
          size="compact-sm"
          variant="default"
          loading={locking}
          disabled={discarding}
          onClick={() => handleLock(true)}
        >
          Lås inn alle ({total})
        </Button>
      )}
      <Menu position="bottom-start" withinPortal>
        <Menu.Target>
          <Button
            size="compact-sm"
            variant="subtle"
            color="red"
            rightSection={<IconChevronDown size={14} />}
            loading={discarding}
            disabled={locking}
          >
            Forkast
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          {visible > 0 && (
            <Menu.Item onClick={() => handleDiscard(false)}>
              Forkast {period} ({visible})
            </Menu.Item>
          )}
          {outside > 0 && (
            <Menu.Item onClick={() => handleDiscard(true)}>
              Forkast alle ({total})
            </Menu.Item>
          )}
        </Menu.Dropdown>
      </Menu>
    </Group>
  )
}
