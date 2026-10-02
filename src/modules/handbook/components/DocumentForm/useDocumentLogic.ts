import { useRichTextEditor } from 'components/RichTextEditor'
import { OnFormSubmit } from 'types/forms'
import { CreateDocumentReturns, PatchDocumentReturns } from '../../mutations'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { showNotification } from '@mantine/notifications'
import { requiredString } from 'util/validation'
import { z } from 'zod'

const DocumentSchema = z.object({
  name: requiredString('Navn er påkrevd'),
  content: z.string(),
})

export type DocumentFormData = z.infer<typeof DocumentSchema>
export type DocumentCleanedData = DocumentFormData

interface DocumentLogicInput {
  defaultValues: DocumentFormData
  onSubmit: OnFormSubmit<
    DocumentCleanedData,
    PatchDocumentReturns | CreateDocumentReturns
  >
}

export function useDocumentLogic(input: DocumentLogicInput) {
  const { defaultValues, onSubmit } = input

  const editor = useRichTextEditor(defaultValues.content)

  const form = useForm<DocumentFormData>({
    mode: 'onSubmit',
    defaultValues,
    resolver: zodResolver(DocumentSchema),
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
