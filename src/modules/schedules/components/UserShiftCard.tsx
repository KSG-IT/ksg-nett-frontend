import { Card, Group, Stack, Text } from '@mantine/core'
import { format } from 'date-fns'
import { UserThumbnail } from 'modules/users'
import { ShiftNode } from '../types.graphql'

interface UserShiftCardProps {
  shift: ShiftNode
}
export const UserShiftCard: React.FC<UserShiftCardProps> = ({ shift }) => {
  return (
    <Card my="md" style={{ maxWidth: 900 }} shadow="md">
      <Group>
        <Stack>
          <Text>{shift.location}</Text>
          <Text>{format(new Date(shift.datetimeStart), 'cccc d. MMMM')}</Text>
          <Text>Oppmøte {format(new Date(shift.datetimeStart), 'HH:mm')}</Text>
        </Stack>
        <Group>
          {shift.filledSlots.map(slot => (
            <Stack spacing="xs">
              <UserThumbnail user={slot.user} size="xl" />
              <Text my={0}>{slot.role.name}</Text>
              <Text my={0}>{slot.user.fullName}</Text>
            </Stack>
          ))}
        </Group>
      </Group>
    </Card>
  )
}
