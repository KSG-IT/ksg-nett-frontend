import { useMutation } from '@apollo/client'
import {
  LOGIN_MUTATION,
  RESET_My_PASSWORD_MUTATION,
  RESET_PASSWORD_BY_TOKEN_MUTATION,
} from './mutations'
import {
  LoginMutationReturns,
  LoginMutationVariables,
  ResetMyPasswordReturns,
  ResetMyPasswordVariables,
  ResetPassworsByTokenReturns,
  ResetPassworsByTokenVariables,
} from './types.graphql'

export function useLoginMutations() {
  const [login, { loading: loginLoading }] = useMutation<
    LoginMutationReturns,
    LoginMutationVariables
  >(LOGIN_MUTATION)

  const [resetPassword, { loading: resetPasswordLoading }] = useMutation<
    ResetMyPasswordReturns,
    ResetMyPasswordVariables
  >(RESET_My_PASSWORD_MUTATION)

  const [resetPasswordByToken, { loading: resetPasswordByTokenLoading }] =
    useMutation<ResetPassworsByTokenReturns, ResetPassworsByTokenVariables>(
      RESET_PASSWORD_BY_TOKEN_MUTATION
    )
  return {
    login,
    loginLoading,
    resetPassword,
    resetPasswordLoading,
    resetPasswordByToken,
    resetPasswordByTokenLoading,
  }
}
