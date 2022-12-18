import { createStyles, Group, Paper, Stack, Text, Title } from '@mantine/core'
import { ShiftLocationWeek, ShiftNode } from 'modules/schedules/types.graphql'
import { parseLocation } from 'modules/schedules/util'
import { format } from 'util/date-fns'
import { ShiftCard } from './ShiftCard'

interface ShiftLocationWeekCardProps {
  shiftLocationWeek: ShiftLocationWeek
  setShiftModalCallback: (shift: string | null) => void
  scheduleId: string
}

export const ShiftLocationWeekCard: React.FC<ShiftLocationWeekCardProps> = ({
  shiftLocationWeek,
  setShiftModalCallback,
  scheduleId,
}) => {
  /**
   * This component renders the schedule using a location-centric approach. Meaning
   * it expects shift data which is normalized in order to display the shifts
   * for multiple locations 2-4 days of the week.
   */
  const { classes } = useShiftDayWeekCardStyles()

  return (
    <Stack>
      <Title order={3}>
        Uke {format(new Date(shiftLocationWeek.date), 'w')}
      </Title>
      {shiftLocationWeek.shiftDays.map(shiftDay => (
        <Stack key={shiftDay.date} className={classes.week}>
          <Title order={4}>
            {format(new Date(shiftDay.date), 'EEEE dd.MM')}
          </Title>

          <Paper className={classes.card}>
            <Group align="flex-start">
              {shiftDay.locations.map(location => (
                <div className={classes.locationColumn} key={location.location}>
                  <Text>{parseLocation(location.location).name}</Text>
                  {location.shifts.map(shift => (
                    <ShiftCard
                      key={shift.id}
                      shift={shift}
                      setShiftModalCallback={setShiftModalCallback}
                    />
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
    backgroundColor: '#F8F9FA',
  },
  week: {
    overflow: 'scroll',
  },
  locationColumn: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '270px',
  },
}))
