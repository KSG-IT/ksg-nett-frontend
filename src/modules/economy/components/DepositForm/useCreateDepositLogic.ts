import { yupResolver } from '@hookform/resolvers/yup'
import { DepositMethodValues } from 'modules/economy/enums'
import {
  CreateDepositMutationReturns,
  CreateDepositMutationVariables,
} from 'modules/economy/types.graphql'
import { useForm } from 'react-hook-form'
import { OnFormSubmit } from 'types/forms'
import { format } from 'util/date-fns'
import * as yup from 'yup'

export type CreateDepositFormData = {
  amount: number
  dateOfTransfer: Date
  depositMethod: DepositMethodValues
}

const DepositCreateSchema = yup.object().shape({
  amount: yup
    .number()
    .required('Må sette sum')
    .max(30_000, 'Kan ikke være høyere enn 30 000')
    .min(1, 'Må minst være 1'),
})

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
    resolver: yupResolver(DepositCreateSchema),
  })

  async function handleSubmit(data: CreateDepositFormData) {
    let description = ''
    if (data.depositMethod === DepositMethodValues.BANK_TRANSFER) {
      // Write out date in YYYY-MM-DD format
      description = format(data.dateOfTransfer, 'd. MMMM')
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
