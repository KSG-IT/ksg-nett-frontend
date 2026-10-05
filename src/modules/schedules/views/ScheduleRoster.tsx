import { useQuery } from '@apollo/client'
import { Button, Group, Stack, Text } from '@mantine/core'
import { modals } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import { IconUserPlus } from '@tabler/icons-react'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  AddEntryModal,
  EditEntryModal,
  RosterList,
  RosterSummaryTiles,
  RosterToolbar,
} from '../components/Roster'
import { notifyError } from '../components/RosterForm'
import { ManagersOnly, SchedulePageHeader } from '../components/ScheduleTabs'
import { useScheduleRosterMutations } from '../mutations.hooks'
import { SCHEDULE_ROSTER_QUERY } from '../queries'
import {
  EMPTY_ROSTER_FILTER,
  RosterFilter,
  countScale,
  filterRoster,
  rosterSummary,
} from '../roster'
import {
  ScheduleIdVariables,
  ScheduleRosterNode,
  ScheduleRosterReturns,
} from '../types.graphql'

// Roster (/schedules/:id/roster): who works on the schedule, and how much
const ScheduleRoster: React.FC = () => {
  const { id } = useParams() as { id: string }
  const [filter, setFilter] = useState<RosterFilter>(EMPTY_ROSTER_FILTER)
  const [editing, setEditing] = useState<ScheduleRosterNode | null>(null)
  const [adding, setAdding] = useState(false)
  const { data, loading, error } = useQuery<
    ScheduleRosterReturns,
    ScheduleIdVariables
  >(SCHEDULE_ROSTER_QUERY, {
    variables: { id },
    // A sync on the Regler page changes the roster
    fetchPolicy: 'cache-and-network',
  })
  const { removeEntry } = useScheduleRosterMutations()

  const schedule = data?.schedule
  if (error) return <FullPageError />
  if (!schedule) return loading ? <FullContentLoader /> : <FullPageError />

  if (!schedule.canManage) {
    return (
      <Stack gap="md">
        <SchedulePageHeader schedule={schedule} page="Roster" />
        <ManagersOnly />
      </Stack>
    )
  }

  const summary = rosterSummary(schedule.roster)
  const emptyMessage =
    schedule.roster.length === 0
      ? 'Rosteren er tom. Lag regler under Regler og synk, eller legg til personer manuelt.'
      : 'Ingen på rosteren passer med filteret.'
  const scale = {
    average: summary.average,
    max: countScale(schedule.roster, summary.average),
  }

  function handleRemove(row: ScheduleRosterNode) {
    modals.openConfirmModal({
      title: 'Fjerne fra rosteren?',
      children: (
        <Text size="sm">
          {row.user.fullName} fjernes fra rosteren. Neste synk legger personen
          til igjen hvis en regel passer.
        </Text>
      ),
      labels: { confirm: 'Fjern', cancel: 'Avbryt' },
      confirmProps: { color: 'red' },
      onConfirm: () =>
        removeEntry({
          variables: { id: row.id },
          onCompleted() {
            showNotification({
              message: `${row.user.fullName} er fjernet`,
              color: 'green',
            })
          },
          onError: notifyError,
        }),
    })
  }

  return (
    <Stack gap="md">
      <SchedulePageHeader schedule={schedule} page="Roster" />
      <RosterSummaryTiles summary={summary} />
      <Group justify="space-between" gap="sm">
        <Text size="sm" c="dimmed">
          Vakter telles fra siste opptak. Streken i stolpen er snittet for de
          tilgjengelige.
        </Text>
        <Button
          variant="default"
          leftSection={<IconUserPlus size={16} />}
          onClick={() => setAdding(true)}
        >
          Legg til person
        </Button>
      </Group>
      <RosterToolbar
        rows={schedule.roster}
        filter={filter}
        onChange={setFilter}
      />
      <RosterList
        rows={filterRoster(schedule.roster, filter)}
        scale={scale}
        onEdit={setEditing}
        onRemove={handleRemove}
        emptyMessage={emptyMessage}
      />
      <EditEntryModal row={editing} onClose={() => setEditing(null)} />
      <AddEntryModal
        scheduleId={schedule.id}
        rosterUserIds={schedule.roster.map(row => row.user.id)}
        opened={adding}
        onClose={() => setAdding(false)}
      />
    </Stack>
  )
}

export default ScheduleRoster
