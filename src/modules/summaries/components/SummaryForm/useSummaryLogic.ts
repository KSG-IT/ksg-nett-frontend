import { useRichTextEditor } from 'components/RichTextEditor'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  CreateSummaryMutationReturns,
  PatchSummaryMutationReturns,
} from 'modules/summaries/types'
import { useForm } from 'react-hook-form'
import { OnFormSubmit } from 'types/forms'
import { requiredIsoDate, requiredString } from 'util/validation'
import { z } from 'zod'
import { showNotification } from '@mantine/notifications'

const SummarySchema = z.object({
  contents: z.string(),
  internalGroup: z.string().nullable(),
  title: z.string().optional(),
  participants: z.array(z.string(), { error: 'Deltakere er påkrevd' }),
  reporter: requiredString('Referent er påkrevd'),
  date: requiredIsoDate('Dato er påkrevd'),
})

export type SummaryFormData = z.input<typeof SummarySchema>
export type SummaryCleanedData = z.output<typeof SummarySchema>

interface SummaryLogicInput {
  defaultValues: SummaryFormData
  onSubmit: OnFormSubmit<
    SummaryCleanedData,
    PatchSummaryMutationReturns | CreateSummaryMutationReturns
  >
}

export function useSummaryLogic(input: SummaryLogicInput) {
  const { defaultValues, onSubmit } = input

  const editor = useRichTextEditor(defaultValues.contents)

  const form = useForm<SummaryFormData, unknown, SummaryCleanedData>({
    mode: 'onSubmit',
    defaultValues,
    resolver: zodResolver(SummarySchema),
  })

  const handleSubmit = async (data: SummaryCleanedData) => {
    if (!editor) return

    if (editor.getHTML() === '<p><br></p>') {
      showNotification({
        title: 'Noe gikk galt',
        message: 'Du må skrive noe i referatet',
      })
      return
    }

    const cleanedData: SummaryCleanedData = {
      ...data,
      contents: editor.getHTML(),
    }

    if (cleanedData.internalGroup === 'other') {
      if (cleanedData.title === '') {
        showNotification({
          title: 'Noe gikk galt',
          message: 'Du må skrive noe i tittel',
        })
        return
      }
      cleanedData.internalGroup = null
    }

    await onSubmit(cleanedData)
  }
  return {
    form,
    editor,
    onSubmit: handleSubmit,
  }
}
