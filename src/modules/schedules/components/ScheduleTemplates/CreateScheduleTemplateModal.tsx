import { Button, Group, Modal, TextInput } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useScheduleTemplateMutations } from 'modules/schedules/mutations.hooks'
import { ALL_SCHEDULE_TEMPLATES } from 'modules/schedules/queries'
import { useState } from 'react'
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
      onCompleted() {
        showNotification({
          title: 'Suksess',
          message: 'Vaktplanmal opprettet',
          color: 'green',
        })
        onCloseCallback()
      },
      onError({ message }) {
        showNotification({
          title: 'Noe gikk galt',
          message,
          color: 'red',
        })
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
        onChange={e => setName(e.target.value)}
      />
      <ScheduleSelect value={scheduleId} onChange={setScheduleId} />
      <Group position="right" my="sm">
        <Button variant="outline" onClick={onCloseCallback}>
          Avbryt
        </Button>
        <Button color="samfundet-red" onClick={handleCreateScheduleTemplate}>
          Opprett
        </Button>
      </Group>
    </Modal>
  )
}
