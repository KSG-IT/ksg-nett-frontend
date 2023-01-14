import {
  Badge,
  Card,
  createStyles,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { format } from 'util/date-fns'
import { UserThumbnail } from 'modules/users/components'
import { ShiftNode } from '../types.graphql'
import { parseLocation, parseShiftRole } from '../util'
import { useMobile } from 'util/isMobile'
import { useIsMobile } from '../../../util/hooks'
interface UserShiftCardProps {
  shift: Pick<
    ShiftNode,
    'id' | 'location' | 'datetimeStart' | 'filledSlots' | 'datetimeEnd' | 'name'
  >
}
export const UserShiftCard: React.FC<UserShiftCardProps> = ({ shift }) => {
  const { classes } = useStyles()
  const isMobile = useIsMobile()
  return (
    <Card withBorder className={classes.card} shadow="md">
      <Title align={isMobile ? 'center' : 'left'} order={3}>
        {shift.name}
      </Title>
      <Group>
        <Group>
          {shift.location && (
            <Text>
              <Text color={'dimmed'} weight={'bold'}>
                Hvor:
              </Text>
              {parseLocation(shift.location).name}
            </Text>
          )}

          <Text>
            <Text color={'dimmed'} weight={'bold'}>
              Når:
            </Text>
            {format(new Date(shift.datetimeStart), 'cccc d. MMMM yyyy')}
          </Text>
          <Text>
            <Text color={'dimmed'} weight={'bold'}>
              Oppmøte - Slutt:
            </Text>{' '}
            {format(new Date(shift.datetimeStart), 'HH:mm')} -{' '}
            {format(new Date(shift.datetimeEnd), 'HH:mm')}
          </Text>
        </Group>
        <Group noWrap className={classes.filledSlotsGroup}>
          {shift.filledSlots.map(slot => (
            <Stack spacing="xs" align={'center'}>
              <UserThumbnail
                user={slot.user}
                size={isMobile ? 'md' : 'lg'}
                radius={100}
                className={classes.userThumbnail}
              />
              <Badge variant={'outline'} my={0}>
                {parseShiftRole(slot.role)}
              </Badge>
              <Text my={0} size={isMobile ? 'xs' : 'sm'}>
                {slot.user.getCleanFullName}
              </Text>
            </Stack>
          ))}
        </Group>
      </Group>
    </Card>
  )
}

const useStyles = createStyles(theme => ({
  title: {
    color: theme.colors.gray[6],
    fontWeight: 'bold',
  },
  card: {
    borderTop: `4px solid ${theme.colors.brand}`,
    margin: `${theme.spacing.sm}px 0`,
    maxWidth: 900,
  },
  userThumbnail: {
    radius: '100%',
  },
  filledSlotsGroup: {
    overflowX: 'scroll',
  },
}))
