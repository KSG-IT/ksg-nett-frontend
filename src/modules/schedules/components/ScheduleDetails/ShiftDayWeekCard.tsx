import { Card, createStyles, Group, Paper, Stack, Title } from '@mantine/core'
import { IconDotsVertical } from '@tabler/icons'
import { ShiftDayWeek } from 'modules/schedules/types.graphql'
import toast from 'react-hot-toast'
import { format } from 'util/date-fns'
import { ShiftCard } from './ShiftCard'

interface ShiftDayWeekCardProps {
  shiftDayWeek: ShiftDayWeek
  scheduleId: string
}

export const ShiftDayWeekCard: React.FC<ShiftDayWeekCardProps> = ({
  shiftDayWeek,
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

    toast.error('Lol ikke implementert enda')
    console.error('Missing feature')
  }

  function handleDeleteShift() {
    // Should trigger a confirm delete dialog
    toast.error('Lol ikke implementert enda')
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
                <ShiftCard key={shift.id} shift={shift} />
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
