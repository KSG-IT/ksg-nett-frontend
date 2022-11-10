import { DayValues, LocationValues, RoleValues } from './consts'

export function parseShiftRole(role: RoleValues) {
  return (
    role.toLocaleLowerCase().slice(0, 1).toUpperCase() +
    role.toLocaleLowerCase().slice(1)
  )
}

export function parseLocation(location: LocationValues | null) {
  switch (location) {
    case LocationValues.BODEGAEN:
      return { name: 'Bodegaen', color: 'green' }
    case LocationValues.DAGLIGHALLEN_BAR:
      return { name: 'Daglighallen bar', color: 'orange' }
    case LocationValues.EDGAR:
      return { name: 'Edgar', color: 'red' }
    case LocationValues.KLUBBEN:
      return { name: 'Klubben', color: 'blue' }
    case LocationValues.LYCHE_BAR:
      return { name: 'Lyche bar', color: 'yellow' }
    case LocationValues.LYCHE_KJOKKEN:
      return { name: 'Lyche kjøkken', color: 'lime' }
    case LocationValues.RUNDHALLEN:
      return { name: 'Rundhallen', color: 'cyan' }
    case LocationValues.SELSKAPSSIDEN:
      return { name: 'Selskapssiden', color: 'indigo' }
    case LocationValues.STORSALEN:
      return { name: 'Storsalen', color: 'grape' }
    case LocationValues.STROSSA:
      return { name: 'Strossa', color: 'pink' }
    default:
      return { name: '', color: 'gray' }
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
