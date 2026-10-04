import { maxFileSize, requiredString } from 'util/validation'
import { z } from 'zod'
import { PatchInternalGroupUserHighlightReturns } from 'modules/organization/types.graphql'
import { OnFormSubmit } from 'types/forms'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const HighlightSchema = z.object({
  user: requiredString('Påkrevd'),
  internalGroup: requiredString('Påkrevd'),
  occupation: requiredString('Påkrevd'),
  description: requiredString('Påkrevd'),
  archived: z.boolean(),
  image: maxFileSize(),
})

export type HighlightFormData = z.infer<typeof HighlightSchema>

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
    resolver: zodResolver(HighlightSchema),
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
