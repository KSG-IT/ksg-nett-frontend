import { Group, Paper, ScrollArea, Text } from '@mantine/core'
import { format } from 'util/date-fns'
import { MegaChatShift } from '../types.graphql'

interface MegaChatShiftListProps {
  shifts: MegaChatShift[]
}

// The shifts running now, which a new mega chat takes its members from.
export const MegaChatShiftList: React.FC<MegaChatShiftListProps> = ({
  shifts,
}) => {
  if (shifts.length === 0) {
    return (
      <Text size="sm" c="dimmed">
        Ingen er på vakt nå.
      </Text>
    )
  }

  return (
    <Paper withBorder radius="md">
      <ScrollArea.Autosize mah={280}>
        {shifts.map(item => (
          <MegaChatShiftRow key={item.shift.id} item={item} />
        ))}
      </ScrollArea.Autosize>
    </Paper>
  )
}

interface MegaChatShiftRowProps {
  item: MegaChatShift
}

const MegaChatShiftRow: React.FC<MegaChatShiftRowProps> = ({ item }) => {
  const { shift, userCount } = item
  const start = format(new Date(shift.datetimeStart), 'HH:mm')
  const end = format(new Date(shift.datetimeEnd), 'HH:mm')

  return (
    <Group justify="space-between" wrap="nowrap" px="md" py="sm">
      <div style={{ minWidth: 0 }}>
        <Text size="sm" fw={600} truncate>
          {shift.name}
        </Text>
        <Text size="xs" c="dimmed">
          {start} – {end}
          {shift.locationDisplay && ` · ${shift.locationDisplay}`}
        </Text>
      </div>
      <Text size="sm" c="dimmed" style={{ flex: 'none' }}>
        {userCount} personer
      </Text>
    </Group>
  )
}
