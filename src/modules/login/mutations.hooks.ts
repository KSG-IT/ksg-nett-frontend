import { useMutation } from '@apollo/client'
import { LOGIN_MUTATION } from './mutations'
import { LoginMutationReturns, LoginMutationVariables } from './types.graphql'

export function useLoginMutations() {
  const [login, { loading: loginLoading }] = useMutation<
    LoginMutationReturns,
    LoginMutationVariables
  >(LOGIN_MUTATION)

  return {
    login,
    loginLoading,
  }
}
