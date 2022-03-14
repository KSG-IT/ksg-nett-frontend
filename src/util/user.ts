import { AllUsersShallowQueryReturns } from 'modules/users'

export interface UserOption {
  value: string
  label: string
}

export const usersToSelectOption = (
  allActiveUsers?: AllUsersShallowQueryReturns['allActiveUsers']
): UserOption[] =>
  allActiveUsers?.edges.map(({ node }) => ({
    value: node.id,
    label: node.fullName,
  })) || []
