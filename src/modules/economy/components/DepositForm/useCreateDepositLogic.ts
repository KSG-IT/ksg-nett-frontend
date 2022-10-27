import { yupResolver } from '@hookform/resolvers/yup'
import { CreateDepositMutationReturns } from 'modules/economy/types.graphql'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { OnFormSubmit } from 'types/forms'
import { FILE_SIZE } from 'util/consts'
import * as yup from 'yup'

export type CreateDepositFormData = {
  amount: number
  description: string
  receipt: File | null
  createdAt?: string
}

const DepositCreateSchema = yup.object().shape({
  amount: yup.number().required('Amount is required'),
  description: yup.string().required('Description is required'),
  receipt: yup
    .mixed()
    .notRequired()
    .test(
      'FILE_SIZE',
      'Filstørrelse for stor, 1 MB maks.',
      value => !value || (value && value.size <= FILE_SIZE)
    ),
})

interface UseCreateDepositLogicInput {
  defaultValues: CreateDepositFormData
  onSubmit: OnFormSubmit<CreateDepositFormData, CreateDepositMutationReturns>
  onCompletedCallback: () => void
}

export function useCreateDepositLogic(input: UseCreateDepositLogicInput) {
  const { defaultValues, onSubmit, onCompletedCallback } = input
  const form = useForm<CreateDepositFormData>({
    mode: 'onSubmit',
    defaultValues,
    resolver: yupResolver(DepositCreateSchema),
  })

  const handleSubmit = async (data: CreateDepositFormData) => {
    await toast
      .promise(onSubmit(data), {
        success: 'Innskudd er sendt inn',
        loading: 'Lagrer...',
        error: 'Noe gikk galt',
      })
      .then(onCompletedCallback)
  }
  return {
    form,
    onSubmit: handleSubmit,
  }
}
