import { Card, Group, Stack, Text, UnstyledButton } from '@mantine/core'
import { Link } from 'react-router-dom'
import { format } from 'util/date-fns'
import { UpcomingShiftNode } from '../types.graphql'
import { createStyles } from '@mantine/emotion'

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
          <Text fw={'bold'} size={'sm'} c="dimmed" tt="uppercase">
            {format(new Date(datetimeStart), 'dd.MMMM')}
          </Text>
          <Text>
            {format(new Date(datetimeStart), 'HH:mm')} -{' '}
            {format(new Date(datetimeEnd), 'HH:mm')}
          </Text>
          <Text size={'sm'} c={'maroon'}>
            {roleDisplay}
          </Text>
          <Text c={'dark'} size={'xs'}>
            {locationDisplay}
          </Text>
        </Card>
      </UnstyledButton>
    )
  )
  return (
    <Stack>
      <Text c={'dimmed'} fw={700}>
        Neste vakter
      </Text>
      <Card withBorder radius={'md'} className={classes.card}>
        {shiftCards.length > 0 ? (
          <Group>{shiftCards}</Group>
        ) : (
          <Text p={'lg'} ta="center" c={'dimmed'}>
            Du har ingen vakter for øyeblikket.
          </Text>
        )}
      </Card>
    </Stack>
  )
}

const useStyles = createStyles({
  card: {
    backgroundColor: 'white',
    borderTop: '5px solid var(--mantine-color-brand-6)',
  },
  shiftButton: {
    '&:hover': {
      transform: 'translate(0, -4px)',
    },
    width: '100%',
  },
})
