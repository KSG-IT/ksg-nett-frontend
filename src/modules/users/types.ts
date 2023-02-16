import { AvatarProps } from '@mantine/core'
import { BankAccountActivity } from 'modules/economy/types.graphql'
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
  legacyWorkHistory: LegacyUserrWorkHistoryNode[]
  allPermissions: string[]
  isSuperUser: boolean
  allergies: AllergyNode[]
  themes: ThemeNode[]
  selectedTheme: ThemeNode
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

type Shade = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export type ThemeNode = {
  id: string
  name: string
  primaryShade: Shade
  colorScheme: string
  label: string
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
    | 'selectedTheme'
    | 'themes'
  >
  allAllergies: AllergyNode[]
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

export interface UpdateMyThemeReturns {
  user: Pick<UserNode, 'id'>
}

export interface UpdateMyThemeVariables {
  themeId: string
}

export interface UpdateMyEmailNotificationsVariables {
  notifyOnQuote: boolean
  notifyOnDeposit: boolean
  notifyOnShift: boolean
}
