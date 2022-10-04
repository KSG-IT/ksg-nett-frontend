import { Stack } from '@mantine/core'
import { ShiftLocationWeek } from 'modules/schedules/types.graphql'
import { ShiftLocationWeekCard } from './ShiftLocationWeekCard'

interface ShiftLocationWeekListProps {
  shiftLocationWeeks: ShiftLocationWeek[]
}

export const ShiftLocationWeekList: React.FC<ShiftLocationWeekListProps> = ({
  shiftLocationWeeks,
}) => {
  return (
    <Stack>
      {shiftLocationWeeks.map((shiftLocationWeek, index) => (
        <ShiftLocationWeekCard
          key={index}
          shiftLocationWeek={shiftLocationWeek}
        />
      ))}
    </Stack>
  )
}
