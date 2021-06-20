export type UserNode = {
  id: string
  firstName: string
  lastName: string
  fullName: string
  phoneNumber: string
  initials: string
  username: string
  email: string
  isStaff: boolean
  isSuperuser: boolean
  isActive: boolean
  needsPasswordChange: boolean
  profilePicture: string | null
  isAdministrator: boolean
}