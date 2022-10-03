import {
  Card,
  createStyles,
  Divider,
  Grid,
  Group,
  Stack,
  Text,
  UnstyledButton,
} from '@mantine/core'
import { format } from 'util/date-fns/format'
import { getLocationValue, getRoleValue } from 'modules/schedules/util'
import { Link } from 'react-router-dom'
import { ShiftSlotRole, ShiftLocation } from 'modules/schedules/consts'

type UpcomingShiftNode = {
  role: ShiftSlotRole
  shift: {
    location: ShiftLocation
    datetimeStart: Date
    datetimeEnd: Date
    schedule: {
      name: string
    }
  }
}

interface ShiftProps {
  shifts: UpcomingShiftNode[]
}

const useStyles = createStyles(theme => ({
  card: {
    backgroundColor: theme.colors.white,
    borderTop: `5px solid ${theme.colors.brand}`,
  },
  shiftButton: {
    '&:hover': {
      transform: 'translate(0, -4px)',
    },
  },
}))

export const FutureShifts: React.FC<ShiftProps> = ({ shifts }) => {
  const { classes } = useStyles()
  const shiftCards = shifts.map(
    ({ shift: { datetimeEnd, datetimeStart, location }, role }, index) => (
      <UnstyledButton component={Link} key={index} to="/schedules/me">
        <Card className={classes.shiftButton} radius={'lg'} withBorder>
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
            {getRoleValue(role)}
          </Text>
          <Text color={'dark'} size={'xs'}>
            {getLocationValue(location)}
          </Text>
        </Card>
      </UnstyledButton>
    )
  )
  return (
    <Stack>
      <Text color={'dimmed'} weight={700} p={'xs'}>
        Neste vakter
      </Text>
      <Card withBorder radius={'md'} className={classes.card}>
        <Group>{shiftCards}</Group>
      </Card>
    </Stack>
  )
}
