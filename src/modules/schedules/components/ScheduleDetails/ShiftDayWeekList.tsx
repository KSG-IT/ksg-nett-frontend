import { Stack } from '@mantine/core'
import { ShiftDayWeek } from 'modules/schedules/types.graphql'
import { ShiftDayWeekCard } from './ShiftDayWeekCard'

interface ShiftDayWeekListProps {
  shiftDayWeeks: ShiftDayWeek[]
}

export const ShiftDayWeekList: React.FC<ShiftDayWeekListProps> = ({
  shiftDayWeeks,
}) => {
  return (
    <Stack>
      {shiftDayWeeks.map((shiftDayWeek, index) => {
        console.log(index)
        return <ShiftDayWeekCard key={index} shiftDayWeek={shiftDayWeek} />
      })}
    </Stack>
  )
}
