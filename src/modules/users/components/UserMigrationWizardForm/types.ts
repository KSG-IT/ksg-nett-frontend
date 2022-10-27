import { UserNode } from 'modules/users/types'

export type UserWizardData = Pick<
  UserNode,
  | 'id'
  | 'firstName'
  | 'nickname'
  | 'lastName'
  | 'dateOfBirth'
  | 'homeTown'
  | 'studyAddress'
  | 'legacyWorkHistory'
  | 'study'
  | 'phone'
  | 'bankAccount'
>
