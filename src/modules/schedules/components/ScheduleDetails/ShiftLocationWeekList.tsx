import { Stack } from '@mantine/core'
import { ShiftLocationWeek, ShiftNode } from 'modules/schedules/types.graphql'
import { useState } from 'react'
import { ShiftCardModal } from './ShiftCardModal'
import { ShiftLocationWeekCard } from './ShiftLocationWeekCard'

interface ShiftLocationWeekListProps {
  shiftLocationWeeks: ShiftLocationWeek[]
  scheduleId: string
}

export const ShiftLocationWeekList: React.FC<ShiftLocationWeekListProps> = ({
  shiftLocationWeeks,
  scheduleId,
}) => {
  const [openedShiftId, setOpenedShiftId] = useState<string | null>(null)

  if (shiftLocationWeeks.length === 0) {
    return <div>Ingen vakter den valgte uken</div>
  }
  return (
    <Stack>
      {shiftLocationWeeks.map((shiftLocationWeek, index) => (
        <ShiftLocationWeekCard
          key={index}
          shiftLocationWeek={shiftLocationWeek}
          scheduleId={scheduleId}
          setShiftModalCallback={setOpenedShiftId}
        />
      ))}
      <ShiftCardModal
        opened={openedShiftId !== null}
        onClose={() => setOpenedShiftId(null)}
        shiftId={openedShiftId}
      />
    </Stack>
  )
}
