import { Stack } from '@mantine/core'
import { ShiftDayWeek, ShiftNode } from 'modules/schedules/types.graphql'
import { useState } from 'react'
import { ShiftCardModal } from './ShiftCardModal'
import { ShiftDayWeekCard } from './ShiftDayWeekCard'

interface ShiftDayWeekListProps {
  shiftDayWeeks: ShiftDayWeek[]
  scheduleId: string
}

export const ShiftDayWeekList: React.FC<ShiftDayWeekListProps> = ({
  shiftDayWeeks,
  scheduleId,
}) => {
  const [openedShiftId, setOpenedShiftId] = useState<string | null>(null)
  const [shiftModalOpened, setShiftModalOpened] = useState(false)

  if (shiftDayWeeks.length === 0) {
    return <div>Ingen vakter den valgte uken</div>
  }

  function handleShiftModal(shiftId: string | null) {
    setOpenedShiftId(shiftId)
    setShiftModalOpened(shiftId !== null)
  }

  function handleCloseShiftModal() {
    handleShiftModal(null)
    setShiftModalOpened(false)
  }

  return (
    <Stack>
      {shiftDayWeeks.map((shiftDayWeek, index) => {
        return (
          <ShiftDayWeekCard
            key={index}
            shiftDayWeek={shiftDayWeek}
            scheduleId={scheduleId}
            setShiftModalCallback={handleShiftModal}
          />
        )
      })}
      <ShiftCardModal
        opened={shiftModalOpened}
        onClose={handleCloseShiftModal}
        shiftId={openedShiftId}
      />
    </Stack>
  )
}
