import { useQuery } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { Button, Stack } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { Link } from '@mantine/tiptap'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { RichTextEditor } from 'components/RichTextEditor'
import { useInterviewScheduleMutations } from 'modules/admissions/mutations.hooks'
import {
  INTERVIEW_SCHEDULE_TEMPLATE,
  INTERVIEW_TEMPLATE_QUERY,
} from 'modules/admissions/queries'
import { useState } from 'react'

interface DefaultInterviewNotesEditorProps {
  initialNotes: string
}

export const DefaultInterviewNotesEditor: React.FC<
  DefaultInterviewNotesEditorProps
> = ({ initialNotes }) => {
  const [scheduleId, setScheduleId] = useState('')

  useQuery(INTERVIEW_SCHEDULE_TEMPLATE, {
    onCompleted(data) {
      setScheduleId(data.interviewScheduleTemplate.id)
    },
    onError(err) {
      showNotification({
        title: 'Kunne ikke hente intervjumal',
        message: 'Prøv igjen senere',
      })
    },
  })

  const editor = useEditor({
    extensions: [StarterKit, Link],
    content: initialNotes,
  })

  const { patchInterviewSchedule, patchInterviewScheduleLoading } =
    useInterviewScheduleMutations()

  const handleSave = () => {
    if (!editor || !scheduleId) {
      showNotification({
        title: 'Kunne ikke lagre intervjumal',
        message: 'Prøv igjen senere',
      })
      return
    }

    patchInterviewSchedule({
      variables: {
        id: scheduleId,
        input: {
          defaultInterviewNotes: editor.getHTML(),
        },
      },
      refetchQueries: [INTERVIEW_TEMPLATE_QUERY],
      onCompleted() {
        showNotification({
          title: 'Lagret intervjumal',
          color: 'teal',
          message: 'Endringene er lagret',
        })
      },
      onError(err) {
        showNotification({
          title: 'Kunne ikke lagre intervjumal',
          color: 'red',
          message: err.message,
        })
      },
    })
  }

  return (
    <Stack>
      <RichTextEditor editor={editor} />
      <Button loading={patchInterviewScheduleLoading} onClick={handleSave}>
        Oppdater intervjumal
      </Button>
    </Stack>
  )
}
