import {
  Button,
  createStyles,
  Group,
  Paper,
  Stack,
  Text,
  Title,
  UnstyledButton,
} from '@mantine/core'
import { IconTrash } from '@tabler/icons'
import { ShiftDayWeek } from 'modules/schedules/types.graphql'
import { parseLocation } from 'modules/schedules/util'
import toast from 'react-hot-toast'
import { format } from 'util/date-fns'

interface ShiftDayWeekCardProps {
  shiftDayWeek: ShiftDayWeek
}

export const ShiftDayWeekCard: React.FC<ShiftDayWeekCardProps> = ({
  shiftDayWeek,
}) => {
  /**
   * This component renders the schedule using a week-centric approach. Meaning
   * it expects shift data which is normalized in order to display the shifts
   * for all days of the week
   */
  const { classes } = useShiftDayWeekCardStyles()

  function handleDeleteWeekShifts() {
    // Should trigger a confirm delete dialog

    toast.error('Lol ikke implementert enda')
    console.error('Missing feature')
  }

  function handleDeleteShift() {
    // Should trigger a confirm delete dialog
    toast.error('Lol ikke implementert enda')
    console.error('Missing feature')
  }
  console.log(shiftDayWeek)

  return (
    <Stack className={classes.wrapper}>
      <Group>
        <Title order={3}>Uke {format(new Date(shiftDayWeek.date), 'w')}</Title>
        <Button
          variant="light"
          color="red"
          leftIcon={<IconTrash />}
          onClick={handleDeleteWeekShifts}
        >
          Slett vakter for uke
        </Button>
      </Group>
      <Paper className={classes.card}>
        {shiftDayWeek.shiftDays.map((shiftDay, index) => (
          <div className={classes.dayColumn} key={shiftDay.date}>
            <Stack>
              <Title order={4}>
                {format(new Date(shiftDay.date), 'EEEE dd.MM')}
              </Title>
              {shiftDay.shifts.map((shift, index) => (
                <div
                  className={
                    shift.isFilled
                      ? classes.filledShift
                      : classes.notFilledShift
                  }
                >
                  <Group position="apart" align={'flex-end'}>
                    <Text>{shift.name}</Text>
                    <UnstyledButton>
                      <IconTrash
                        size="18px"
                        color="red"
                        onClick={handleDeleteShift}
                      />
                    </UnstyledButton>
                  </Group>
                  <Text>{parseLocation(shift.location)}</Text>

                  <Text>
                    {format(new Date(shift.datetimeStart), 'MM.dd')}{' '}
                    {format(new Date(shift.datetimeStart), 'HH:mm')}
                  </Text>
                  {shift.slots.map((slot, index) => (
                    <div key={index}>
                      <Text>{slot.role}</Text>
                      <Text>{slot?.user?.fullName}</Text>
                    </div>
                  ))}
                </div>
              ))}
            </Stack>
          </div>
        ))}
      </Paper>
    </Stack>
  )
}

const useShiftDayWeekCardStyles = createStyles(theme => ({
  wrapper: {
    width: '100%',
  },
  card: {
    width: '100%',
    display: 'inline-grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '2px',
  },
  dayColumn: {
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid red',
  },

  filledShift: {
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid green',
    marginBottom: theme.spacing.xs,
    backgroundColor: theme.colors.green[6],
    color: 'white',
  },
  notFilledShift: {
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid green',
    backgroundColor: theme.colors.red[6],
    marginBottom: theme.spacing.xs,
    color: 'white',
  },
}))
