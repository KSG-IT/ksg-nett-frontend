import { formatISO } from 'date-fns'
import { useDepositMutations } from 'modules/economy/mutations.hooks'
import { CreateDepositFormData } from './useCreateDepositLogic'

export function useCreateDepositAPI() {
  const { createDeposit } = useDepositMutations()

  async function handleSubmit(data: CreateDepositFormData) {
    const input = {
      ...data,
      createdAt: formatISO(new Date()),
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
