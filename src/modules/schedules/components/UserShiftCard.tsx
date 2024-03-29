import {
  Badge,
  Card,
  createStyles,
  Group,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core'
import { format } from 'util/date-fns'
import { UserThumbnail } from 'modules/users/components'
import { ShiftNode } from '../types.graphql'
import { parseLocation, parseShiftRole } from '../util'
import { useIsMobile } from 'util/hooks'
import { capitalizeFirstLetter } from 'util/parsing'

interface UserShiftCardProps {
  shift: Pick<
    ShiftNode,
    'id' | 'location' | 'datetimeStart' | 'filledSlots' | 'datetimeEnd' | 'name'
  >
  year?: boolean
}

export const UserShiftCard: React.FC<UserShiftCardProps> = ({
  shift,
  year,
}) => {
  const { classes } = useStyles()
  const isMobile = useIsMobile()
  const theme = useMantineTheme()
  return (
    <Card withBorder className={classes.card} shadow="md">
      <Group position={'apart'} mb={'md'}>
        <Stack align={'flex-start'} spacing={0}>
          <Badge variant={'filled'} radius={'sm'} color={theme.primaryColor}>
            {shift.name}
          </Badge>
          <Text weight={'thin'} color={'dimmed'}>
            {capitalizeFirstLetter(
              format(
                new Date(shift.datetimeStart),
                `cccc d. MMMM ${year ? 'yyyy' : ''}`
              )
            )}
          </Text>
        </Stack>
        <Stack spacing={0} align={'flex-end'}>
          {shift.location && (
            <Badge>{parseLocation(shift.location).name}</Badge>
          )}
          <Text align={'center'}>
            {format(new Date(shift.datetimeStart), 'HH:mm')} -{' '}
            {format(new Date(shift.datetimeEnd), 'HH:mm')}
          </Text>
        </Stack>
      </Group>
      <Group noWrap>
        {shift.filledSlots.map(slot => (
          <Stack spacing="xs" align={'center'}>
            <UserThumbnail
              user={slot.user}
              size={isMobile ? 'md' : 'lg'}
              radius={100}
            />
            <Badge variant={'outline'} size={isMobile ? 'sm' : 'sm'} my={0}>
              {parseShiftRole(slot.role)}
            </Badge>
            <Text my={0} size={isMobile ? 'sm' : 'sm'}>
              {slot.user.firstName}
            </Text>
          </Stack>
        ))}
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
    maxWidth: 700,
    overflowX: 'scroll',
  },
}))
