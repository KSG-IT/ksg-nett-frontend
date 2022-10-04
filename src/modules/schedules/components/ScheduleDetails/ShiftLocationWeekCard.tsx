import { createStyles, Group, Paper, Stack, Text, Title } from '@mantine/core'
import { ShiftLocationWeek } from 'modules/schedules/types.graphql'
import { parseLocation } from 'modules/schedules/util'
import { format } from 'util/date-fns'

interface ShiftLocationWeekCardProps {
  shiftLocationWeek: ShiftLocationWeek
}

export const ShiftLocationWeekCard: React.FC<ShiftLocationWeekCardProps> = ({
  shiftLocationWeek,
}) => {
  const { classes } = useShiftDayWeekCardStyles()

  return (
    <Stack style={{ width: '100%' }}>
      <Title order={3}>
        Uke {format(new Date(shiftLocationWeek.date), 'w')}
      </Title>

      {shiftLocationWeek.shiftDays.map((shiftDay, index) => (
        <Stack>
          <Title order={4}>
            {format(new Date(shiftDay.date), 'EEEE dd.MM')}{' '}
          </Title>
          <Paper className={classes.card}>
            <Group align="flex-start">
              {shiftDay.locations.map(location => (
                <div className={classes.locationColumn}>
                  <Text>{parseLocation(location.location)}</Text>
                  {location.shifts.map(shift => (
                    <div className={classes.shift} key={index}>
                      <Text>{shift.name}</Text>
                      <Text>
                        {format(new Date(shift.datetimeStart), 'MM.dd')}-
                        {format(new Date(shift.datetimeStart), 'HH:mm')}
                      </Text>
                      {shift.slots.map(slot => (
                        <Text>{slot.role}</Text>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </Group>
          </Paper>
        </Stack>
      ))}
    </Stack>
  )
}

const useShiftDayWeekCardStyles = createStyles(theme => ({
  card: {
    width: '100%',
    display: 'inline-grid',
  },
  locationColumn: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    border: '1px solid red',
  },

  shift: {
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid green',
    marginBottom: theme.spacing.xs,
  },
}))
