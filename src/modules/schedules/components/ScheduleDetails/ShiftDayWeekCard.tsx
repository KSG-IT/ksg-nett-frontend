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
import { IconPlus, IconTrash } from '@tabler/icons'
import { ShiftDayWeek } from 'modules/schedules/types.graphql'
import { parseLocation } from 'modules/schedules/util'
import toast from 'react-hot-toast'
import { format } from 'util/date-fns'
import { CreateShiftPopover } from './CreateShiftPopover'
import { ShiftCard } from './ShiftCard'
import { ShiftWeek } from './ShiftWeek'

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

      <Paper className={classes.card}>
        {shiftDayWeek.shiftDays.map(shiftDay => (
          <div className={classes.dayColumn} key={shiftDay.date}>
            <Stack>
              <Title order={4}>
                {format(new Date(shiftDay.date), 'EEEE dd.MM')}
              </Title>
              {shiftDay.shifts.map(shift => (
                <ShiftCard key={shift.id} shift={shift} />
              ))}
            </Stack>
            <CreateShiftPopover scheduleId={scheduleId} date={shiftDay.date} />
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
}))
