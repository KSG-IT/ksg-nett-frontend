import { AvatarProps } from '@mantine/core'
import { BankAccountActivity } from 'modules/economy/types.graphql'
import { QuoteNode } from 'modules/quotes/types'
import { RelayEdges } from 'types/graphql'
import { InternalGroupPositionMembershipNode } from './UserManagement/types'

export type UserNode = {
  id: string
  firstName: string
  lastName: string
  fullName: string
  phone: string
  hometown: string
  homeAddress: string
  biography: string
  initials: string
  username: string
  dateOfBirth: string
  studyAddress: string
  ksgStatus: string
  study: string
  balance: number
  email: string
  taggedAndVerifiedQuotes: QuoteNode[]
  profileImage: string | null
  isStaff: boolean
  isSuperuser: boolean
  isActive: boolean
  inRelationship: boolean
  needsPasswordChange: boolean
  isAdministrator: boolean
  bankAccountActivity: BankAccountActivity[]
  lastTransactions: BankAccountActivity[]
  upvotedQuoteIds: string[]
  internalGroupPositionMembershipHistory: InternalGroupPositionMembershipNode[]

  allPermissions: string[]
  isSuperUser: boolean
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
  q?: string
}

export interface AllUsersShallowQueryReturns {
  allActiveUsers: RelayEdges<
    Pick<UserNode, 'id' | 'fullName' | 'profileImage' | 'initials'>
  >
}

export interface PatchUserReturns {
  user: {
    id: string
  }
}

export interface UserThumbnailProps extends AvatarProps {
  user: Pick<UserNode, 'id' | 'profileImage' | 'initials' | 'fullName'>
}
