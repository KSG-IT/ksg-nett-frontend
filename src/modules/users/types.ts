import { AvatarProps } from '@mantine/core'
import { BankAccountActivity } from 'modules/economy/types.graphql'
import { InternalGroupPositionNode } from 'modules/organization/types'
import {
  InternalGroupPositionMembershipNode,
  LegacyUserrWorkHistoryNode,
} from 'modules/organization/types.graphql'
import { QuoteNode } from 'modules/quotes/types.graphql'
import { UserTypeLogEntryActionValues } from './enums'

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
  aboutMe: string
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
  firstTimeLogin: boolean
  icalToken: string
  isAdministrator: boolean
  owesMoney: boolean
  bankAccountActivity: BankAccountActivity[]
  lastTransactions: BankAccountActivity[]
  upvotedQuoteIds: string[]
  internalGroupPositionMembershipHistory: InternalGroupPositionMembershipNode[]
  activeInternalGroupPosition: Pick<InternalGroupPositionNode, 'id' | 'name'>
  legacyWorkHistory: LegacyUserrWorkHistoryNode[]
  allPermissions: string[]
  isSuperUser: boolean
  allergies: AllergyNode[]
  notifyOnQuote: boolean
  notifyOnShift: boolean
  notifyOnDeposit: boolean
  canRewriteAboutMe: boolean
  bankAccount: {
    id: string
    cardUuid: string
  }
}

export type AllergyNode = {
  id: string
  name: string
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

export interface SearchbarUsersQueryVariables {
  searchString: string
}

export interface SearchbarUsersQueryReturns {
  searchbarUsers: Pick<
    UserNode,
    'id' | 'profileImage' | 'initials' | 'getCleanFullName'
  >[]
}

export interface AllUsersShallowQueryReturns {
  allActiveUsersList: Pick<
    UserNode,
    'id' | 'profileImage' | 'initials' | 'getCleanFullName' | 'phone'
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

export interface MySettingsQueryReturns {
  me: Pick<
    UserNode,
    | 'id'
    | 'firstName'
    | 'lastName'
    | 'nickname'
    | 'email'
    | 'phone'
    | 'dateOfBirth'
    | 'study'
    | 'studyAddress'
    | 'ksgStatus'
    | 'homeTown'
    | 'aboutMe'
    | 'allergies'
    | 'notifyOnQuote'
    | 'notifyOnDeposit'
    | 'notifyOnShift'
    | 'canRewriteAboutMe'
  >
  allAllergies: AllergyNode[]
}

export interface NewbiesQueryReturns {
  newbies: Pick<
    UserNode,
    'id' | 'fullName' | 'activeInternalGroupPosition' | 'profileImage'
  >[]
}

export interface PatchUserReturns {
  user: {
    id: string
  }
}

export interface UserThumbnailProps extends AvatarProps {
  user: Pick<
    UserNode,
    | 'id'
    | 'profileImage'
    | 'initials'
    | 'getFullWithNickName'
    | 'getCleanFullName'
    | 'firstName'
  >
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

export interface UpdateAboutMeReturns {
  user: Pick<UserNode, 'id'>
}
export interface UpdateAboutMeVariables {
  aboutMe: string
}

export interface UpdateMyAllergiesReturns {
  user: Pick<UserNode, 'id'>
}

export interface UpdateMyAllergiesVariables {
  allergyIds: string[]
}

export interface UpdateMyEmailNotificationsReturns {
  user: Pick<UserNode, 'id'>
}

export interface UpdateMyEmailNotificationsVariables {
  notifyOnQuote: boolean
  notifyOnDeposit: boolean
  notifyOnShift: boolean
}
