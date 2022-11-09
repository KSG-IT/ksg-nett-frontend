import {
  CreateSummaryMutationReturns,
  PatchSummaryMutationReturns,
  SummaryType,
} from '../../types'
import * as yup from 'yup'
import { OnFormSubmit } from '../../../../types/forms'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { formatISO } from 'date-fns'

export type SummaryFormData = {
  contents: string
  type: SummaryType
  participants: string[]
  reporter: string
  date: Date
}

export type SummaryCleanedData = Omit<SummaryFormData, 'date'> & {
  date: string
}

const SummarySchema = yup.object().shape({
  contents: yup.string().required('Innhold er påkrevd'),
  type: yup.string().required('Type er påkrevd'),
  participants: yup.array().of(yup.string()).required('Deltakere er påkrevd'),
  reporter: yup.string().required('Referent er påkrevd'),
  date: yup.date().required('Dato er påkrevd'),
})

interface SummaryLogicInput {
  defaultValues: SummaryFormData
  onSubmit: OnFormSubmit<
    SummaryCleanedData,
    PatchSummaryMutationReturns | CreateSummaryMutationReturns
  >
  onCompletedCallback: () => void
}

export function useSummaryLogic(input: SummaryLogicInput) {
  const { defaultValues, onSubmit, onCompletedCallback } = input
  const form = useForm<SummaryFormData>({
    mode: 'onSubmit',
    defaultValues,
    resolver: yupResolver(SummarySchema),
  })

  const handleSubmit = async (data: SummaryFormData) => {
    const cleanedData: SummaryCleanedData = {
      ...data,
      date: formatISO(new Date(data.date)),
    }
    await toast
      .promise(onSubmit(cleanedData), {
        loading: 'Lagrer referat',
        success: 'Referat lagret',
        error: 'Noe gikk galt',
      })
      .then(onCompletedCallback)
  }
  return {
    form,
    onSubmit: handleSubmit,
  }
}
