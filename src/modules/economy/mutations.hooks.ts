import { useMutation } from '@apollo/client'
import { CREATE_DEPOSIT_MUTATION } from './mutations'
import { CreateDepositMutationReturns } from './types.graphql'

export function useDepositMutations() {
  const [createDeposit, { loading: createDepositLoading }] =
    useMutation<CreateDepositMutationReturns>(CREATE_DEPOSIT_MUTATION)

  return {
    createDeposit,
    createDepositLoading,
  }
}
