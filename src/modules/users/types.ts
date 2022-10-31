import { AvatarProps } from '@mantine/core'
import { BankAccountActivity } from 'modules/economy/types.graphql'
import { LegacyUserrWorkHistoryNode } from 'modules/organization/types.graphql'
import { QuoteNode } from 'modules/quotes/types.graphql'
import { RelayEdges } from 'types/graphql'
import { UserTypeLogEntryActionValues } from './enums'
import { InternalGroupPositionMembershipNode } from './UserManagement/types'

export type UserNode = {
  id: string
  firstName: string
  lastName: string
  nickname: string
  fullName: string
  getFullWithNickName: string
  getCleanFullName: string
  phone: string
  homeTown: string
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
  requiresMigrationWizard: boolean
  isAdministrator: boolean
  bankAccountActivity: BankAccountActivity[]
  lastTransactions: BankAccountActivity[]
  upvotedQuoteIds: string[]
  internalGroupPositionMembershipHistory: InternalGroupPositionMembershipNode[]
  legacyWorkHistory: LegacyUserrWorkHistoryNode[]
  allPermissions: string[]
  isSuperUser: boolean
  bankAccount: {
    id: string
    cardUuid: string
  }
}

export type UserTypeLogEntryNode = {
  id: string
  user: Pick<UserNode, 'id' | 'getCleanFullName'>
  timestamp: string
  doneBy: Pick<UserNode, 'id' | 'getCleanFullName'>
  action: UserTypeLogEntryActionValues
}

export type UserTypeNode = {
  id: string
  name: string
  description: string
  permissions: string[]
  users: Pick<UserNode, 'id' | 'getCleanFullName'>[]
  changelog: UserTypeLogEntryNode[]
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
  allActiveUsersList: Pick<
    UserNode,
    'id' | 'profileImage' | 'initials' | 'getCleanFullName'
  >[]
}

export interface AllUserTypesQueryReturns {
  allUserTypes: Pick<UserTypeNode, 'id' | 'name'>[]
}

export interface UserTypeDetailQueryReturns {
  userType: UserTypeNode
}

export interface MyWizardQueryReturns {
  me: Pick<
    UserNode,
    | 'id'
    | 'firstName'
    | 'lastName'
    | 'email'
    | 'phone'
    | 'dateOfBirth'
    | 'homeTown'
    | 'studyAddress'
    | 'study'
    | 'legacyWorkHistory'
    | 'nickname'
    | 'bankAccount'
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

export interface AddUserToUserTypeReturns {
  user: Pick<UserNode, 'id'>
}
export interface AddUserToUserTypeVariables {
  userId: string
  userTypeId: string
}

export interface RemoveUserFromUserTypeReturns {
  user: Pick<UserNode, 'id'>
}

export interface RemoveUserFromUserTypeVariables {
  userId: string
  userTypeId: string
}
