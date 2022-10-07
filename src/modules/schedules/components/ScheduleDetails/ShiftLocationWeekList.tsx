import { Stack } from '@mantine/core'
import { ShiftLocationWeek } from 'modules/schedules/types.graphql'
import { ShiftLocationWeekCard } from './ShiftLocationWeekCard'

interface ShiftLocationWeekListProps {
  shiftLocationWeeks: ShiftLocationWeek[]
}

export const ShiftLocationWeekList: React.FC<ShiftLocationWeekListProps> = ({
  shiftLocationWeeks,
}) => {
  if (shiftLocationWeeks.length === 0) {
    return <div>Ingen vakter den valgte uken</div>
  }
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
