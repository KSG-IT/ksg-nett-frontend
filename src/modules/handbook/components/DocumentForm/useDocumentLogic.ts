import { OnFormSubmit } from 'types/forms'
import { CreateDocumentReturns, PatchDocumentReturns } from '../../mutations'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { showNotification } from '@mantine/notifications'
import StarterKit from '@tiptap/starter-kit'
import { Link } from '@mantine/tiptap'
import { useEditor } from '@tiptap/react'
import * as yup from 'yup'

export type DocumentFormData = {
  name: string
  content: string
}

export type DocumentCleanedData = {
  name: string
  content: string
}
const DocumentSchema = yup.object().shape({
  name: yup.string().required('Navn er påkrevd'),
})

interface DocumentLogicInput {
  defaultValues: DocumentFormData
  onSubmit: OnFormSubmit<
    DocumentCleanedData,
    PatchDocumentReturns | CreateDocumentReturns
  >
}

export function useDocumentLogic(input: DocumentLogicInput) {
  const { defaultValues, onSubmit } = input

  const editor = useEditor({
    extensions: [StarterKit, Link],
    content: defaultValues.content,
  })

  const form = useForm<DocumentFormData>({
    mode: 'onSubmit',
    defaultValues,
    resolver: yupResolver(DocumentSchema),
  })

  const handleSubmit = async (data: DocumentFormData) => {
    if (!editor) return

    if (editor.getHTML() === '<p><br></p>') {
      showNotification({
        title: 'Innhold er påkrevd',
        message: 'Innhold er påkrevd',
        color: 'red',
      })
      return
    }

    const cleanedData: DocumentCleanedData = {
      name: data.name,
      content: editor.getHTML(),
    }

    await onSubmit(cleanedData)
  }
  return { form, editor, onSubmit: handleSubmit }
}
