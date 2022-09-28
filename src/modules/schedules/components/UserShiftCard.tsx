import { Card, createStyles, Group, Stack, Text } from '@mantine/core'
import { format } from 'util/date-fns'
import { UserThumbnail } from 'modules/users/components'
import { ShiftNode } from '../types.graphql'
import { parseLocation, parseShiftRole } from '../util'

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
    <Card className={classes.card} shadow="md">
      <Group>
        <Stack>
          {shift.location && (
            <Text>
              <Text weight={'bold'}>Hvor: </Text>
              {parseLocation(shift.location)}
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
              <Text my={0}>{parseShiftRole(slot.role)}</Text>
              <Text my={0}>{slot.user.fullName}</Text>
            </Stack>
          ))}
        </Group>
      </Group>
    </Card>
  )
}
