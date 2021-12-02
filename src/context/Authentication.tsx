import { createContext, useContext, FC } from 'react'
import { UserNode } from '__generated__/graphql'

// const USER_PLACEHOLDER = {
//   id: '',
//   firstName: '',
//   lastName: '',
//   username: '',
//   fullName: '',
//   phoneNumber: '',
//   initials: '',
//   email: '',
//   isStaff: false,
//   isSuperuser: false,
//   isActive: false,
//   needsPasswordChange: false,
//   profilePicture: '',
//   isAdministrator: false,
// }

const AuthContext = createContext<UserNode | null>(null)

export const useAuth = () => useContext(AuthContext)!

type AuthProps = {
  user: UserNode
}

const AuthProvider: FC<AuthProps> = ({ user, children }) => (
  // TODO: Handle fetch of user here
  // https://github.com/Lekesoldat/ghostbills/blob/01b9c4c9044ed4393f481620b34f4c4c31b79aad/src/hooks/useFirebaseAuthentication.ts#L4
  <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
)

export default AuthProvider
