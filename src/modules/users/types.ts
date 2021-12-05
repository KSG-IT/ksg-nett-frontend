import { BankAccountActivity } from "modules/economy/types"

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
  profilePicture: string
  isStaff: boolean
  isSuperuser: boolean
  isActive: boolean
  needsPasswordChange: boolean
  profileImage: string | null
  isAdministrator: boolean
  bankAccountActivity: BankAccountActivity[]
  lastTransactions: BankAccountActivity[]
}


export interface UserQuery {
  user: UserNode
}

export interface UserQueryVariables {
  id: string
}