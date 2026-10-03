import { format } from 'util/date-fns'
import { DayShift } from '../../allShifts'

export function shiftTime(shift: DayShift) {
  return `${format(new Date(shift.datetimeStart), 'HH:mm')}–${format(
    new Date(shift.datetimeEnd),
    'HH:mm'
  )}`
}
