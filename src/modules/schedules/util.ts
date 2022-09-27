import { RoleValues } from './consts'

export const parseShiftRole = (role: RoleValues) => {
  return (
    role.toLocaleLowerCase().slice(0, 1).toUpperCase() +
    role.toLocaleLowerCase().slice(1)
  )
}
