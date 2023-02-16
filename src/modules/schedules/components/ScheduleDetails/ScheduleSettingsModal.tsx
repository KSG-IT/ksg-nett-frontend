import { Button, Group, Modal, Select, Stack, TextInput } from '@mantine/core'
import { ScheduleDisplayModeValues } from 'modules/schedules/consts'
import { useScheduleMutations } from 'modules/schedules/mutations.hooks'
import {
  ALL_SCHEDULES,
  NORMALIZED_SHIFTS_FROM_RANGE_QUERY,
  SCHEDULE_QUERY,
} from 'modules/schedules/queries'
import { ScheduleNode } from 'modules/schedules/types.graphql'
import { useState } from 'react'
import toast from 'react-hot-toast'

interface ScheduleSettingsModalProps {
  isOpen: boolean
  schedule: Pick<ScheduleNode, 'id' | 'name' | 'displayMode'>
  onCloseCallback: () => void
}

export const ScheduleSettingsModal: React.FC<ScheduleSettingsModalProps> = ({
  isOpen,
  schedule,
  onCloseCallback,
}) => {
  const [name, setName] = useState(schedule.name)
  const [displayMode, setDisplayMode] = useState(schedule.displayMode)

  const { patchSchedule } = useScheduleMutations()

  function handleSave() {
    patchSchedule({
      variables: {
        id: schedule.id,
        input: {
          name,
          displayMode,
        },
      },
      refetchQueries: [
        ALL_SCHEDULES,
        SCHEDULE_QUERY,
        NORMALIZED_SHIFTS_FROM_RANGE_QUERY,
      ],
      onError() {
        toast.error('Noe gikk galt')
      },
      onCompleted() {
        toast.success('Vatkplan oppdatert')
        onCloseCallback()
      },
    })
  }

  return (
    <Modal
      title="Innstillinger vaktplan"
      opened={isOpen}
      onClose={onCloseCallback}
    >
      <Stack>
        <TextInput value={name} onChange={evt => setName(evt.target.value)} />
        <Select
          value={displayMode}
          clearable={false}
          label="Visningsmodus"
          data={[
            {
              value: ScheduleDisplayModeValues.SINGLE_LOCATION,
              label: 'Ett lokale',
            },
            {
              value: ScheduleDisplayModeValues.MULTIPLE_LOCATIONS,
              label: 'Flere lokaler',
            },
          ]}
          onChange={evt => setDisplayMode(evt as ScheduleDisplayModeValues)}
        />

        <Group position="right">
          <Button color="gray" onClick={onCloseCallback}>
            Avbryt
          </Button>
          <Button onClick={handleSave}>Lagre</Button>
        </Group>
      </Stack>
    </Modal>
  )
}
