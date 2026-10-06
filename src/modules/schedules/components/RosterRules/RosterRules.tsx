import { Button, Group, Text } from '@mantine/core'
import { modals } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import { IconPlus } from '@tabler/icons-react'
import { useState } from 'react'
import { useScheduleRosterMutations } from '../../mutations.hooks'
import { SelectOption, membershipTypeLabel } from '../../roster'
import { ScheduleRosterGroupingNode } from '../../types.graphql'
import { notifyError } from '../RosterForm'
import { RosterRulesTable } from './RosterRulesTable'
import { EditRuleModal } from './EditRuleModal'
import { NewRuleModal } from './NewRuleModal'

interface RosterRulesProps {
  scheduleId: string
  rules: ScheduleRosterGroupingNode[]
  positions: SelectOption[]
}

// The rules of the roster sync: who is on the roster, with which values
export const RosterRules: React.FC<RosterRulesProps> = ({
  scheduleId,
  rules,
  positions,
}) => {
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<ScheduleRosterGroupingNode | null>(
    null
  )
  const { deleteGrouping } = useScheduleRosterMutations()

  function handleDelete(rule: ScheduleRosterGroupingNode) {
    modals.openConfirmModal({
      title: 'Slette regelen?',
      children: (
        <Text size="sm">
          Regelen for {rule.internalGroupPosition.name} (
          {membershipTypeLabel(rule.positionType)}) slettes. Rosteren endres
          først når du synker.
        </Text>
      ),
      labels: { confirm: 'Slett', cancel: 'Avbryt' },
      confirmProps: { color: 'red' },
      onConfirm: () =>
        deleteGrouping({
          variables: { id: rule.id },
          onCompleted() {
            showNotification({ message: 'Regelen er slettet', color: 'green' })
          },
          onError: notifyError,
        }),
    })
  }

  return (
    <>
      <Group justify="space-between" gap="sm">
        <Text fw={700}>Regler</Text>
        <Button
          variant="default"
          leftSection={<IconPlus size={16} />}
          onClick={() => setCreating(true)}
        >
          Ny regel
        </Button>
      </Group>
      <RosterRulesTable
        rules={rules}
        onEdit={setEditing}
        onDelete={handleDelete}
      />
      <NewRuleModal
        scheduleId={scheduleId}
        positions={positions}
        opened={creating}
        onClose={() => setCreating(false)}
      />
      <EditRuleModal rule={editing} onClose={() => setEditing(null)} />
    </>
  )
}
