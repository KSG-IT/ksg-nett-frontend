import { UserNode } from 'modules/users/types'
import create from 'zustand'
export const LOGIN_TOKEN_KEY = 'login-token'

export const UserPlaceholder: UserNode = {
  id: '',
  firstName: '',
  lastName: '',
  fullName: '',
  phone: '',
  aboutMe: '',
  initials: '',
  nickname: '',
  getFullWithNickName: '',
  getCleanFullName: '',
  username: '',
  balance: 0,
  email: '',
  profileImage: null,
  isSuperuser: false,
  isActive: false,
  isStaff: false,
  inRelationship: false,
  requiresMigrationWizard: false,
  firstTimeLogin: false,
  isAdministrator: false,
  bankAccountActivity: [],
  lastTransactions: [],
  upvotedQuoteIds: [],
  owesMoney: false,
  allPermissions: [],
  dateOfBirth: '',
  studyAddress: '',
  ksgStatus: '',
  study: '',
  icalToken: '',
  taggedAndVerifiedQuotes: [],
  internalGroupPositionMembershipHistory: [],
  activeInternalGroupPosition: {
    id: '',
    name: '',
  },
  allergies: [],
  notifyOnQuote: false,
  notifyOnShift: false,
  notifyOnDeposit: false,
  canRewriteAboutMe: false,
  legacyWorkHistory: [],
  homeTown: '',
  bankAccount: {
    id: '',
    cardUuid: '',
  },
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
