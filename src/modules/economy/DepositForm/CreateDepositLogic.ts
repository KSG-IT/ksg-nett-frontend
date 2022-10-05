import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { OnFormSubmit } from 'types/forms'
import * as yup from 'yup'
import { CreateDepositMutationReturns } from '../types'

export type CreateDepositFormData = {
  amount: number
  description: string
  receipt: File | null
}

const DepositCreateSchema = yup.object().shape({
  amount: yup.number().required('Amount is required'),
  description: yup.string().required('Description is required'),
  receipt: yup.mixed().required('File is required'),
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
