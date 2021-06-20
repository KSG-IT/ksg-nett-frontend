
import { useContext } from 'react'
import UserContext from 'context/UserContext'
import { UserNode } from 'modules/users/types'

export const useUser = (): UserNode  => {
  const user = useContext(UserContext)
  return user
}