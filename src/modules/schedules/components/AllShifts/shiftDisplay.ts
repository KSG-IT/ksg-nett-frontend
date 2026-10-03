import { format } from 'util/date-fns'
import { DayShift } from '../../allShifts'
import { parseLocation } from '../../util'

export function shiftTime(shift: DayShift) {
  return `${format(new Date(shift.datetimeStart), 'HH:mm')}–${format(
    new Date(shift.datetimeEnd),
    'HH:mm'
  )}`
}

// The location name and its Mantine colour, as in parseLocation.
export function shiftLocation(shift: DayShift) {
  const { name, color } = parseLocation(shift.location)
  return { name: name || 'Uten lokale', color }
}

// Light background and text colour for a location, from Mantine's variables.
export function locationStyle(color: string) {
  return {
    backgroundColor: `var(--mantine-color-${color}-light)`,
    color: `var(--mantine-color-${color}-light-color)`,
  }
}
