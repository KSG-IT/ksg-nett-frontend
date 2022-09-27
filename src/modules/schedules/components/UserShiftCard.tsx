import { Card, createStyles, Group, Stack, Text } from '@mantine/core'
import { format } from 'date-fns'
import { UserThumbnail } from 'modules/users'
import { ShiftNode } from '../types.graphql'

const useUserShiftCardStyles = createStyles(theme => ({
  card: {
    maxWidth: 900,
  },
}))

interface UserShiftCardProps {
  shift: ShiftNode
}
export const UserShiftCard: React.FC<UserShiftCardProps> = ({ shift }) => {
  const { classes } = useUserShiftCardStyles()
  return (
    <Card my="md" className={classes.card} shadow="md">
      <Group>
        <Stack>
          {shift.location && (
            <Text>
              <Text weight={'bold'}>Hvor: </Text>
              {shift.location}
            </Text>
          )}
          <Text>
            {format(new Date(shift.datetimeStart), 'cccc d. MMMM yyyy')}
          </Text>
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
