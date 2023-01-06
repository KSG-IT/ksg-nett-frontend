import { showNotification } from '@mantine/notifications'
import { Link } from '@mantine/tiptap'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { RichTextEditor } from 'components/RichTextEditor'
import { useInterviewMutations } from 'modules/admissions/mutations.hooks'
import React, { useEffect, useState } from 'react'
import { useDebounce } from 'util/hooks'

interface InterviewNoteBoxProps {
  interviewId: string
  initialValue: string
  field: 'notes' | 'discussion'
}

export const InterviewNoteBox: React.VFC<InterviewNoteBoxProps> = ({
  interviewId,
  initialValue,
  field,
}) => {
  /**
   * Executes a mutation saving the contents of the textarea to the database
   * after a given timeout from the last change.
   */
  const editor = useEditor({
    extensions: [StarterKit, Link],
    content: initialValue,
  })

  const [lastSavedValue, setLastSavedValue] = useState(initialValue)
  const debouncedValue = useDebounce(editor?.getHTML() ?? '', 5000)

  const { patchInterview } = useInterviewMutations()

  useEffect(() => {
    const input = {
      // This notation dynamically creates a property on the input object
      // meaning it could either be 'notes' or 'discussion' fields so we can
      // use the same input object for both.
      [field]: debouncedValue,
    }

    if (lastSavedValue === debouncedValue) {
      return
    }
    patchInterview({
      variables: { id: interviewId, input: input },
      onCompleted() {
        setLastSavedValue(debouncedValue)
      },
      onError() {
        showNotification({
          title: 'Noe gikk galt',
          message: 'Kunne ikke lagre intervjunotater',
        })
      },
    })
  }, [debouncedValue])

  return <RichTextEditor editor={editor} />
}
