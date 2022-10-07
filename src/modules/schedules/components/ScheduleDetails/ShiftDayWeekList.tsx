import { Stack } from '@mantine/core'
import { ShiftDayWeek } from 'modules/schedules/types.graphql'
import { ShiftDayWeekCard } from './ShiftDayWeekCard'

interface ShiftDayWeekListProps {
  shiftDayWeeks: ShiftDayWeek[]
}

export const ShiftDayWeekList: React.FC<ShiftDayWeekListProps> = ({
  shiftDayWeeks,
}) => {
  if (shiftDayWeeks.length === 0) {
    return <div>Ingen vakter den valgte uken</div>
  }

  return (
    <Stack>
      {shiftDayWeeks.map((shiftDayWeek, index) => {
        return <ShiftDayWeekCard key={index} shiftDayWeek={shiftDayWeek} />
      })}
    </Stack>
  )
}
