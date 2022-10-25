import { AllUsersShallowQueryReturns } from 'modules/users/types'

export interface UserOption {
  value: string
  label: string
}

export const usersToSelectOption = (
  allActiveUsers?: AllUsersShallowQueryReturns['allActiveUsersList']
): UserOption[] =>
  allActiveUsers?.map(node => ({
    value: node.id,
    label: node.fullName,
  })) || []
