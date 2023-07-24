import { Card, createStyles, Group, Paper, Stack, Title } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconDotsVertical } from '@tabler/icons'
import { ShiftDayWeek } from 'modules/schedules/types.graphql'
import { format } from 'util/date-fns'
import { ShiftCard } from './ShiftCard'

interface ShiftDayWeekCardProps {
  shiftDayWeek: ShiftDayWeek
  scheduleId: string
  setShiftModalCallback: (shift: string | null) => void
}

export const ShiftDayWeekCard: React.FC<ShiftDayWeekCardProps> = ({
  shiftDayWeek,
  setShiftModalCallback,
  scheduleId,
}) => {
  /**
   * This component renders the schedule using a week-centric approach. Meaning
   * it expects shift data which is normalized in order to display the shifts
   * for all days of the week
   */
  const { classes } = useShiftDayWeekCardStyles()

  function handleDeleteWeekShifts() {
    // Should trigger a confirm delete dialog

    showNotification({
      title: 'Lol ikke implementert enda',
      message: 'Lol ikke implementert enda',
      color: 'red',
    })
    console.error('Missing feature')
  }

  function handleDeleteShift() {
    // Should trigger a confirm delete dialog
    showNotification({
      title: 'Lol ikke implementert enda',
      message: 'Lol ikke implementert enda',
      color: 'red',
    })
    console.error('Missing feature')
  }

  return (
    <Stack className={classes.wrapper}>
      <Title order={3}>Uke {format(new Date(shiftDayWeek.date), 'w')}</Title>
      <Paper p={'xs'} className={classes.card}>
        {shiftDayWeek.shiftDays.map(shiftDay => (
          <Card
            ml={'xs'}
            p={'xs'}
            className={classes.dayColumn}
            key={shiftDay.date}
          >
            <Stack>
              <Group position="apart">
                <Title
                  transform="capitalize"
                  color="gray.9"
                  weight={900}
                  order={5}
                >
                  {format(new Date(shiftDay.date), 'EEEE dd.MM')}
                </Title>
                <IconDotsVertical />
              </Group>
              {shiftDay.shifts.map(shift => (
                <ShiftCard
                  key={shift.id}
                  shift={shift}
                  setShiftModalCallback={setShiftModalCallback}
                />
              ))}
            </Stack>
          </Card>
        ))}
      </Paper>
    </Stack>
  )
}

// #F6F5F8
// #F1F3F5
const useShiftDayWeekCardStyles = createStyles(theme => ({
  wrapper: {
    width: '100%',
  },
  card: {
    width: '100%',
    display: 'flex',
    gap: '2px',
    backgroundColor: theme.colors.gray[0],
    overflow: 'scroll',
  },

  dayColumn: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '270px',
    backgroundColor: theme.colors.gray[1],
    borderRadius: theme.radius.md,
  },
}))
