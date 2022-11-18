import {
  LocationValues,
  ScheduleDisplayModeValues,
} from 'modules/schedules/consts'
import { ShiftNode } from 'modules/schedules/types.graphql'

type NormalizedShiftSlot = {}

type ShiftDay = {
  date: Date
  shifts: ShiftNode[]
}

type ShiftDayGrouping = {
  date: Date
  shifts: ShiftNode[]
  location: LocationValues | null
}

type ShiftWeek = {
  shiftDayGroupings: ShiftDayGrouping[]
}

interface ShiftWeekProps {
  shiftWeeks: ShiftWeek[]
  displayMode: ScheduleDisplayModeValues
}

export const ShiftWeek: React.FC<ShiftWeekProps> = () => {
  return <div></div>
}
