import { UserNode } from 'modules/users'
import create from 'zustand'
export const LOGIN_TOKEN_KEY = 'login-token'
interface Store {
  user: UserNode | null
  setUser: (user: UserNode) => void
  token: string
  setToken: (token: string) => void
}

export const useStore = create<Store>(set => ({
  user: null,
  setUser: (user: UserNode) => set(() => ({ user: user })),
  token: '',
  setToken: token => {
    localStorage.setItem(LOGIN_TOKEN_KEY, token)
    set(() => ({ token: token }))
  },
}))
