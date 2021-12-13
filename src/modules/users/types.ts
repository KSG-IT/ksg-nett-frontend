import { BankAccountActivity } from 'modules/economy/types'
import { RelayEdges } from 'types/graphql'

export type UserNode = {
  id: string
  firstName: string
  lastName: string
  fullName: string
  phone: string
  biography: string
  initials: string
  username: string
  balance: number
  email: string
  profileImage: string | null
  isStaff: boolean
  isSuperuser: boolean
  isActive: boolean
  needsPasswordChange: boolean
  isAdministrator: boolean
  bankAccountActivity: BankAccountActivity[]
  lastTransactions: BankAccountActivity[]
}

export interface UserQueryReturns {
  user: UserNode
}

export interface UserQueryVariables {
  id: string
}

export interface MeQueryReturns {
  me: UserNode | null
}

export interface AllUsersShallowQueryVariables {
  q: string
}

export interface AllUsersShallowQueryReturns {
  allActiveUsers: RelayEdges<
    Pick<UserNode, 'id' | 'fullName' | 'profileImage' | 'initials'>
  >
}
