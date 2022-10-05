import { useDepositMutations } from '../mutations.hooks'
import { CreateDepositFormData } from './CreateDepositLogic'

export function useCreateDepositAPI() {
  const { createDeposit } = useDepositMutations()

  async function handleSubmit(data: CreateDepositFormData) {
    const input = {
      ...data,
    }
    return createDeposit({
      variables: {
        input: input,
      },
    })
  }

  const defaultValues = {
    amount: 0,
    description: '',
    receipt: null,
  }
  return {
    defaultValues,
    onSubmit: handleSubmit,
  }
}
