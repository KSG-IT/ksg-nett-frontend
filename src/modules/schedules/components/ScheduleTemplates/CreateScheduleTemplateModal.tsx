import { onError } from '@apollo/client/link/error'
import { Button, Group, Modal, TextInput } from '@mantine/core'
import { useScheduleTemplateMutations } from 'modules/schedules/mutations.hooks'
import { ALL_SCHEDULE_TEMPLATES } from 'modules/schedules/queries'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { ScheduleSelect } from '../ScheduleSelect'

interface CreateScheduleTemplateModalProps {
  open: boolean
  onCloseCallback: () => void
}

export const CreateScheduleTemplateModal: React.FC<
  CreateScheduleTemplateModalProps
> = ({ open, onCloseCallback }) => {
  const [scheduleId, setScheduleId] = useState('')
  const [name, setName] = useState('')

  const { createScheduleTemplate, createScheduleTemplateLoading } =
    useScheduleTemplateMutations()

  function handleCreateScheduleTemplate() {
    createScheduleTemplate({
      variables: {
        input: {
          name,
          schedule: scheduleId,
        },
      },
      refetchQueries: [ALL_SCHEDULE_TEMPLATES],
      onCompleted: () => {
        toast.success('Vaktplanmal opprettet')
        onCloseCallback()
      },
      onError: error => {
        toast.error(error.message)
      },
    })
  }
  return (
    <Modal
      title="Opprett ny vaktplanmal"
      opened={open}
      onClose={onCloseCallback}
    >
      <TextInput
        label="Navn"
        value={name}
        onChange={e => setName(e.currentTarget.value)}
      />
      <ScheduleSelect value={scheduleId} onChange={setScheduleId} />
      <Group position="right" my="sm">
        <Button variant="outline" onClick={onCloseCallback}>
          Avbryt
        </Button>
        <Button onClick={handleCreateScheduleTemplate}>Opprett</Button>
      </Group>
    </Modal>
  )
}
