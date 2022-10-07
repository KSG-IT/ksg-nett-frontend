import { Button, Group, Modal } from '@mantine/core'
import { DatePicker, TimeInput } from '@mantine/dates'
import { useState } from 'react'
import { ShiftRoleSelect } from '../ScheduleRoleSelect'
import { ScheduleSelect } from '../ScheduleSelect'

interface CreateShiftModalProps {
  isOpen: boolean
  onCloseCallback: () => void
}

export const CreateShiftModal: React.FC<CreateShiftModalProps> = ({
  isOpen,
  onCloseCallback,
}) => {
  const [scheduleId, setScheduleId] = useState('')

  return (
    <Modal title="Opprett nytt skift" opened={isOpen} onClose={onCloseCallback}>
      <ScheduleSelect value={scheduleId} onChange={setScheduleId} />
      <DatePicker />
      <TimeInput></TimeInput>
      <TimeInput></TimeInput>
      <Group>
        <Button></Button>
        <Button></Button>
      </Group>
    </Modal>
  )
}
