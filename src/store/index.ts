import { UserNode } from 'modules/users'
import create from 'zustand'
export const LOGIN_TOKEN_KEY = 'login-token'

export const UserPlaceholder: UserNode = {
  id: '',
  firstName: '',
  lastName: '',
  fullName: '',
  phone: '',
  biography: '',
  initials: '',
  username: '',
  balance: 0,
  email: '',
  profileImage: null,
  isSuperuser: false,
  isActive: false,
  isStaff: false,
  inRelationship: false,
  needsPasswordChange: false,
  isAdministrator: false,
  bankAccountActivity: [],
  lastTransactions: [],
  upvotedQuoteIds: [],
  isSuperUser: false,
  allPermissions: [],
}

interface Store {
  user: UserNode
  setUser: (user: UserNode) => void
  token: string
  setToken: (token: string) => void
  sidebarOpen: boolean
  toggleSidebarOpen: () => void
}

export const useStore = create<Store>(set => ({
  user: UserPlaceholder,
  setUser: (user: UserNode) => set(() => ({ user: user })),
  token: '',
  setToken: token => {
    localStorage.setItem(LOGIN_TOKEN_KEY, token)
    set(() => ({ token: token }))
  },
  sidebarOpen: false,
  toggleSidebarOpen: () => {
    set(state => ({ sidebarOpen: !state.sidebarOpen }))
  },
}))
