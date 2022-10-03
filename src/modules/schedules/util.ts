import {
  LocationValues,
  RoleValues,
  ShiftLocation,
  ShiftSlotRole,
} from './consts'

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

export function getLocationValue(location: ShiftLocation) {
  const indexOfLocation = Object.keys(ShiftLocation).indexOf(location)
  return Object.values(ShiftLocation)[indexOfLocation]
}

export function getRoleValue(role: ShiftSlotRole) {
  const indexOfRole = Object.keys(ShiftSlotRole).indexOf(role)
  return Object.values(ShiftSlotRole)[indexOfRole]
}
