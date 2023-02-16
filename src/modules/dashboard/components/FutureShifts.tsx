import {
  Card,
  createStyles,
  Group,
  Stack,
  Text,
  UnstyledButton,
} from '@mantine/core'
import { Link } from 'react-router-dom'
import { format } from 'util/date-fns'
import { UpcomingShiftNode } from '../types.graphql'

interface ShiftProps {
  shifts: UpcomingShiftNode[]
}

export const FutureShifts: React.FC<ShiftProps> = ({ shifts }) => {
  const { classes } = useStyles()
  const shiftCards = shifts.map(
    (
      { shift: { datetimeEnd, datetimeStart, locationDisplay }, roleDisplay },
      index
    ) => (
      <UnstyledButton component={Link} key={index} to="/schedules/me">
        <Card p={'lg'} className={classes.shiftButton} radius={'lg'} withBorder>
          <Text
            weight={'bold'}
            size={'sm'}
            color="dimmed"
            transform="uppercase"
          >
            {format(new Date(datetimeStart), 'dd.MMMM')}
          </Text>
          <Text>
            {format(new Date(datetimeStart), 'HH:mm')} -{' '}
            {format(new Date(datetimeEnd), 'HH:mm')}
          </Text>
          <Text size={'sm'} color={'maroon'}>
            {roleDisplay}
          </Text>
          <Text color={'dark'} size={'xs'}>
            {locationDisplay}
          </Text>
        </Card>
      </UnstyledButton>
    )
  )
  return (
    <Stack>
      <Text color={'dimmed'} weight={700}>
        Neste vakter
      </Text>
      <Card withBorder radius={'md'} className={classes.card}>
        {shiftCards.length > 0 ? (
          <Group>{shiftCards}</Group>
        ) : (
          <Text p={'lg'} align="center" color={'dimmed'}>
            Du har ingen vakter for øyeblikket.
          </Text>
        )}
      </Card>
    </Stack>
  )
}

const useStyles = createStyles(theme => ({
  card: {
    backgroundColor: theme.colors.white,
    borderTop: `5px solid ${theme.colors[theme.primaryColor]}`,
  },
  shiftButton: {
    '&:hover': {
      transform: 'translate(0, -4px)',
    },
    width: '100%',
  },
}))
