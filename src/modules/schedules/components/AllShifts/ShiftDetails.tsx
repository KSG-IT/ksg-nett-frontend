import { Anchor, Group, SimpleGrid, Text } from '@mantine/core'
import { UserThumbnail } from 'modules/users/components'
import { Link } from 'react-router-dom'
import { DayShift, DayShiftSlot } from '../../allShifts'
import { parseShiftRole } from '../../util'

interface ShiftDetailsProps {
  shift: DayShift
}

export const ShiftDetails: React.FC<ShiftDetailsProps> = ({ shift }) => (
  <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xs" verticalSpacing={6}>
    {shift.slots.map(slot => (
      <SlotLine key={slot.id} slot={slot} />
    ))}
  </SimpleGrid>
)

interface SlotLineProps {
  slot: DayShiftSlot
}

const SlotLine: React.FC<SlotLineProps> = ({ slot }) => {
  const role = parseShiftRole(slot.role)

  if (!slot.user) {
    return (
      <Text size="sm" c="dimmed">
        {role} · ledig
      </Text>
    )
  }

  return (
    <Group gap="xs" wrap="nowrap">
      <UserThumbnail user={slot.user} size={24} />
      <Text size="sm" truncate>
        <Anchor component={Link} to={`/users/${slot.user.id}`} c="inherit">
          {slot.user.getFullWithNickName}
        </Anchor>
        <Text span c="dimmed">
          {' '}
          · {role}
        </Text>
      </Text>
    </Group>
  )
}
