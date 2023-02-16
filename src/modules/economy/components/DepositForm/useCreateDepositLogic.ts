import { yupResolver } from '@hookform/resolvers/yup'
import { CreateDepositMutationReturns } from 'modules/economy/types.graphql'
import { useForm } from 'react-hook-form'
import { OnFormSubmit } from 'types/forms'
import * as yup from 'yup'

export type CreateDepositFormData = {
  amount: number
  description: string
  receipt: File | null
  createdAt?: string
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
  onSubmit: OnFormSubmit<CreateDepositFormData, CreateDepositMutationReturns>
}

export function useCreateDepositLogic(input: UseCreateDepositLogicInput) {
  const { defaultValues, onSubmit } = input
  const form = useForm<CreateDepositFormData>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(DepositCreateSchema),
  })

  async function handleSubmit(data: CreateDepositFormData) {
    await onSubmit(data).then(() => {
      form.reset()
    })
  }
  return {
    form,
    onSubmit: handleSubmit,
  }
}
