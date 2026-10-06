import { useQuery } from '@apollo/client'
import { Alert, Button, Group, Loader, Paper, Stack, Text } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconRefresh } from '@tabler/icons-react'
import { useScheduleRosterMutations } from '../../mutations.hooks'
import { ROSTER_SYNC_PREVIEW_QUERY } from '../../queries'
import {
  changeCountLabel,
  groupSyncPreview,
  syncChangeCount,
} from '../../roster'
import {
  RosterChangeNode,
  RosterSyncPreviewReturns,
  ScheduleIdVariables,
} from '../../types.graphql'
import { SyncGroupList } from './SyncGroupList'

interface RosterSyncPanelProps {
  scheduleId: string
}

// What a sync would do now, and the button that does it. Only for managers:
// the backend refuses the preview for other users.
export const RosterSyncPanel: React.FC<RosterSyncPanelProps> = ({
  scheduleId,
}) => {
  const { data, loading, error } = useQuery<
    RosterSyncPreviewReturns,
    ScheduleIdVariables
  >(ROSTER_SYNC_PREVIEW_QUERY, {
    variables: { id: scheduleId },
    fetchPolicy: 'cache-and-network',
  })
  const { syncRoster, syncRosterLoading } = useScheduleRosterMutations()

  const changes = data?.schedule?.rosterSyncPreview ?? []
  const count = syncChangeCount(changes)

  function handleSync() {
    syncRoster({
      variables: { scheduleId },
      onCompleted({ syncScheduleRoster }) {
        showNotification({
          title: 'Rosteren er synket',
          message: changeCountLabel(
            syncChangeCount(syncScheduleRoster.changes)
          ),
          color: 'green',
        })
      },
      onError({ message }) {
        showNotification({ title: 'Noe gikk galt', message, color: 'red' })
      },
    })
  }

  return (
    <Paper withBorder radius="md" p="md">
      <Stack gap="sm">
        <Group justify="space-between" gap="sm">
          <div>
            <Text fw={700}>Synk roster</Text>
            <Text size="sm" c="dimmed">
              Dette skjer når rosteren synkes med reglene nå
            </Text>
          </div>
          <Button
            leftSection={<IconRefresh size={16} />}
            disabled={count === 0}
            loading={syncRosterLoading}
            onClick={handleSync}
          >
            Synk roster ({changeCountLabel(count)})
          </Button>
        </Group>
        <SyncPreview
          changes={changes}
          loading={loading && !data}
          failed={error !== undefined}
        />
      </Stack>
    </Paper>
  )
}

interface SyncPreviewProps {
  changes: RosterChangeNode[]
  loading: boolean
  failed: boolean
}

const SyncPreview: React.FC<SyncPreviewProps> = ({
  changes,
  loading,
  failed,
}) => {
  if (failed) {
    return (
      <Alert color="red" variant="light">
        Kunne ikke hente forhåndsvisningen av synken
      </Alert>
    )
  }
  if (loading) return <Loader size="sm" />
  if (changes.length === 0) {
    return (
      <Text size="sm" c="dimmed">
        Rosteren følger reglene. Ingen endringer.
      </Text>
    )
  }
  return <SyncGroupList groups={groupSyncPreview(changes)} />
}
