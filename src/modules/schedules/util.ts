import { DayValues, LocationValues, RoleValues } from './consts'

export function parseShiftRole(role: RoleValues) {
  return (
    role.toLocaleLowerCase().slice(0, 1).toUpperCase() +
    role.toLocaleLowerCase().slice(1)
  )
}

export function parseLocation(location: LocationValues) {
  switch (location) {
    case LocationValues.BODEGAEN:
      return 'Bodegaen'
    case LocationValues.DAGLIGHALLEN_BAR:
      return 'Daglighallen bar'
    case LocationValues.EDGAR:
      return 'Edgar'
    case LocationValues.KLUBBEN:
      return 'Klubben'
    case LocationValues.LYCHE_BAR:
      return 'Lyche bar'
    case LocationValues.LYCHE_KJOKKEN:
      return 'Lyche kjøkken'
    case LocationValues.RUNDHALLEN:
      return 'Rundhallen'
    case LocationValues.SELSKAPSSIDEN:
      return 'Selskapssiden'
    case LocationValues.STORSALEN:
      return 'Storsalen'
    case LocationValues.STROSSA:
      return 'Strossa'
    default:
      return ''
  }
}

export function parseDay(day: DayValues) {
  switch (day) {
    case DayValues.MONDAY:
      return 'Mandag'
    case DayValues.TUESDAY:
      return 'Tirsdag'
    case DayValues.WEDNESDAY:
      return 'Onsdag'
    case DayValues.THURSDAY:
      return 'Torsdag'
    case DayValues.FRIDAY:
      return 'Fredag'
    case DayValues.SATURDAY:
      return 'Lørdag'
    case DayValues.SUNDAY:
      return 'Søndag'
    default:
      return ''
  }
}
