import { yupResolver } from '@hookform/resolvers/yup'
import { format } from 'date-fns'
import {
  CreateSummaryMutationReturns,
  PatchSummaryMutationReturns,
} from 'modules/summaries/types'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { OnFormSubmit } from 'types/forms'
import * as yup from 'yup'

export type SummaryFormData = {
  contents: string
  internalGroup: string | null
  participants: string[]
  reporter: string
  title?: string
  date: Date
}

export type SummaryCleanedData = Omit<SummaryFormData, 'date'> & {
  date: string
}

const SummarySchema = yup.object().shape({
  contents: yup.string().required('Innhold er påkrevd'),
  internalGroup: yup.string(),
  title: yup.string(),
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
    console.table(data)
    const cleanedData: SummaryCleanedData = {
      ...data,
      date: format(new Date(data.date), 'yyyy-MM-dd'),
    }

    if (cleanedData.internalGroup === 'other') {
      if (cleanedData.title === '') {
        toast.error('Tittel eller internt gruppenavn må være satt')
        return
      }
      cleanedData.internalGroup = null
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
