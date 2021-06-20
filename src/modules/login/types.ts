import { UserNode } from 'modules/users/types'

// MUTATION TYPINGS
export interface LoginMutationVariables {
  username: string
  password: string
}

export interface LoginMutationReturn {
  login: {
    ok: boolean
    token: string
    user: UserNode
  }
}

// QUERY TYPINGS
export interface IsLoggedInQueryReturn {
  isLoggedIn: boolean
}
