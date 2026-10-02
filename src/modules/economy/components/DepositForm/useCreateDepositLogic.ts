import { zodResolver } from '@hookform/resolvers/zod'
import { DepositMethodValues } from 'modules/economy/enums'
import {
  CreateDepositMutationReturns,
  CreateDepositMutationVariables,
} from 'modules/economy/types.graphql'
import { useForm } from 'react-hook-form'
import { OnFormSubmit } from 'types/forms'
import { format } from 'util/date-fns'
import { z } from 'zod'

const DepositCreateSchema = z.object({
  amount: z
    .number({ error: 'Må sette sum' })
    .max(30_000, 'Kan ikke være høyere enn 30 000')
    .min(1, 'Må minst være 1'),
  dateOfTransfer: z.string(),
  depositMethod: z.enum(DepositMethodValues),
})

export type CreateDepositFormData = z.infer<typeof DepositCreateSchema>

interface UseCreateDepositLogicInput {
  defaultValues: CreateDepositFormData
  onSubmit: OnFormSubmit<
    CreateDepositMutationVariables,
    CreateDepositMutationReturns
  >
}

export function useCreateDepositLogic(input: UseCreateDepositLogicInput) {
  const { defaultValues, onSubmit } = input
  const form = useForm<CreateDepositFormData>({
    mode: 'onChange',
    defaultValues,
    resolver: zodResolver(DepositCreateSchema),
  })

  async function handleSubmit(data: CreateDepositFormData) {
    let description = ''
    if (data.depositMethod === DepositMethodValues.BANK_TRANSFER) {
      // Write out date in YYYY-MM-DD format
      description = format(new Date(data.dateOfTransfer), 'd. MMMM')
    }

    const parsedData = {
      amount: data.amount,
      depositMethod: data.depositMethod,
      description,
    }

    await onSubmit(parsedData).then(() => {
      form.reset()
    })
  }
  return {
    form,
    onSubmit: handleSubmit,
  }
}
