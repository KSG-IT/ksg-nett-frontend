import * as yup from 'yup'
import { FILE_SIZE } from 'util/consts'
import { PatchInternalGroupUserHighlightReturns } from 'modules/organization/types.graphql'
import { OnFormSubmit } from 'types/forms'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

export type HighlightFormData = {
  user: string
  internalGroup: string
  occupation: string
  description: string
  archived: boolean
  image?: File | null
}

const HighlightSchema = yup.object().shape({
  user: yup.string().required(),
  internalGroup: yup.string().required(),
  occupation: yup.string().required(),
  description: yup.string().required(),
  archived: yup.boolean().required(),
  image: yup
    .mixed()
    .nullable()
    .notRequired()
    .test(
      'FILE_SIZE',
      `Filstørrelse for stor, 1 MB maks.`,
      value => !value || (value && value.size <= FILE_SIZE)
    ),
})

interface UseEditHighlightLogicInput {
  defaultValues: HighlightFormData
  onSubmit: OnFormSubmit<
    HighlightFormData,
    PatchInternalGroupUserHighlightReturns
  >
}

export function useEditHighlightLogic(input: UseEditHighlightLogicInput) {
  const { defaultValues, onSubmit } = input
  const form = useForm<HighlightFormData>({
    mode: 'onSubmit',
    defaultValues,
    resolver: yupResolver(HighlightSchema),
  })

  const handleSubmit = async (data: HighlightFormData) => {
    const highlightData = { ...data }
    await onSubmit(highlightData)
  }
  return {
    form,
    onSubmit: handleSubmit,
  }
}
