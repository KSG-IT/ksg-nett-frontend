import { useMutation } from '@apollo/client'
import { ADD_USER_TO_KNIGHTHOOD_MUTATION } from './mutations'
import {
  AddUserToKnightHoodReturns,
  AddUserToKnightHoodVariables,
} from './types'

export function useKnightHoodMutations() {
  const [addUserToKnightHood, { loading: addUserToKnightHoodLoading }] =
    useMutation<AddUserToKnightHoodReturns, AddUserToKnightHoodVariables>(
      ADD_USER_TO_KNIGHTHOOD_MUTATION
    )

  return {
    addUserToKnightHood,
    addUserToKnightHoodLoading,
  }
}
