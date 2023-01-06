import { yupResolver } from '@hookform/resolvers/yup'
import { format } from 'date-fns'
import {
  CreateSummaryMutationReturns,
  PatchSummaryMutationReturns,
} from 'modules/summaries/types'
import { useForm } from 'react-hook-form'
import { OnFormSubmit } from 'types/forms'
import * as yup from 'yup'
import { RichTextEditor, Link } from '@mantine/tiptap'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { showNotification } from '@mantine/notifications'

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
}

export function useSummaryLogic(input: SummaryLogicInput) {
  const { defaultValues, onSubmit } = input

  const editor = useEditor({
    extensions: [StarterKit, Link],
    content: defaultValues.contents,
  })

  const form = useForm<SummaryFormData>({
    mode: 'onSubmit',
    defaultValues,
    resolver: yupResolver(SummarySchema),
  })

  const handleSubmit = async (data: SummaryFormData) => {
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
      date: format(new Date(data.date), 'yyyy-MM-dd'),
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
