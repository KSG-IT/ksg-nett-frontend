import { Group, Stack, Text } from '@mantine/core'
import { Badge } from 'components/Badge'
import { RosterChangeKindValues } from '../../consts'
import { SyncGroup } from '../../roster'
import classes from './RosterRules.module.css'

const KIND_COLORS: Record<RosterChangeKindValues, string> = {
  ADD: 'green',
  CHANGE: 'blue',
  REMOVE: 'red',
  KEEP: 'gray',
  CONFLICT: 'orange',
}

interface SyncGroupListProps {
  groups: SyncGroup[]
}

export const SyncGroupList: React.FC<SyncGroupListProps> = ({ groups }) => (
  <div className={classes.syncGroups}>
    {groups.map(group => (
      <SyncGroupItem key={group.kind} group={group} />
    ))}
  </div>
)

interface SyncGroupItemProps {
  group: SyncGroup
}

const SyncGroupItem: React.FC<SyncGroupItemProps> = ({ group }) => {
  const withMessage = group.changes.filter(change => change.message)
  return (
    <Stack gap={4} className={classes.syncGroup} data-kind={group.kind}>
      <Group gap="xs">
        <Badge color={KIND_COLORS[group.kind]} variant="light">
          {group.changes.length}
        </Badge>
        <Text fw={600} size="sm">
          {group.label}
        </Text>
      </Group>
      <Text size="sm">
        {group.changes.map(change => change.user.fullName).join(', ')}
      </Text>
      {withMessage.length > 0 && <ChangeMessages changes={withMessage} />}
    </Stack>
  )
}

interface ChangeMessagesProps {
  changes: SyncGroup['changes']
}

// The backend explains a conflict, for example which rules match
const ChangeMessages: React.FC<ChangeMessagesProps> = ({ changes }) => (
  <>
    {changes.map(change => (
      <Text key={change.user.id} size="xs" c="dimmed">
        {change.user.fullName}: {change.message}
      </Text>
    ))}
  </>
)
