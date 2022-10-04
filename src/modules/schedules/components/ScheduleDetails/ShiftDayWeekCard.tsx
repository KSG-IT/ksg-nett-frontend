import { createStyles, Paper, Stack, Text, Title } from '@mantine/core'
import { ShiftDayWeek } from 'modules/schedules/types.graphql'
import { format } from 'util/date-fns'

interface ShiftDayWeekCardProps {
  shiftDayWeek: ShiftDayWeek
}

export const ShiftDayWeekCard: React.FC<ShiftDayWeekCardProps> = ({
  shiftDayWeek,
}) => {
  const { classes } = useShiftDayWeekCardStyles()

  return (
    <Stack className={classes.wrapper}>
      <Title order={3}>Uke {format(new Date(shiftDayWeek.date), 'w')}</Title>
      <Paper className={classes.card}>
        {shiftDayWeek.shiftDays.map((shiftDay, index) => (
          <div className={classes.dayColumn} key={index}>
            <Stack>
              <Title order={4}>
                {format(new Date(shiftDay.date), 'EEEE dd.MM')}
              </Title>
              {shiftDay.shifts.map((shift, index) => (
                <div className={classes.shift} key={index}>
                  <Text>{shift.name}</Text>
                  <Text>
                    {format(new Date(shift.datetimeStart), 'MM.dd')}{' '}
                    {format(new Date(shift.datetimeStart), 'HH:mm')}
                  </Text>
                  {shift.slots.map((slot, index) => (
                    <>
                      <Text key={index}>{slot.role}</Text>
                      <Text key={index}>{slot?.user?.fullName}</Text>
                    </>
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

  shift: {
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid green',
    marginBottom: theme.spacing.xs,
  },
}))
