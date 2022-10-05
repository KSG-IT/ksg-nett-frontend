import { Button, Group, Modal } from '@mantine/core'
import { format } from 'util/date-fns'
import { useShiftTemplateMutations } from 'modules/schedules/mutations.hooks'
import { useState } from 'react'
import { ScheduleTemplateSelect } from '../ScheduleTemplateSelect'
import toast from 'react-hot-toast'
import {
  NORMALIZED_SHIFTS_FROM_RANGE_QUERY,
  SCHEDULE_QUERY,
} from 'modules/schedules/queries'
import { gql, useMutation } from '@apollo/client'

const TEMP_GENERATE = gql`
  mutation Generate($scheduleId: ID!, $startDate: Date!, $numberOfDays: Int!) {
    generate(
      scheduleTemplateId: $scheduleId
      startDate: $startDate
      numberOfWeeks: $numberOfDays
    ) {
      shiftsCreated
    }
  }
`

function useShiftMutations() {
  const [generate] = useMutation(TEMP_GENERATE)

  return { generate }
}

interface ApplyScheduleTemplateModalProps {
  isOpen: boolean
  onCloseCallback: () => void
}

export const ApplyScheduleTemplateModal: React.FC<
  ApplyScheduleTemplateModalProps
> = ({ isOpen, onCloseCallback }) => {
  const { generate } = useShiftMutations()
  const [scheduleTemplateId, setScheduleTemplateId] = useState<string>('')

  function handleGenerate() {
    generate({
      variables: {
        scheduleId: scheduleTemplateId,
        startDate: format(new Date(), 'yyyy-MM-dd'),
        numberOfDays: 2,
      },
      refetchQueries: [NORMALIZED_SHIFTS_FROM_RANGE_QUERY],
      onCompleted: () => {
        toast.success('Generated shifts')
        onCloseCallback()
      },
      onError: err => {
        toast.error(err.message)
      },
    })
  }
  return (
    <Modal
      opened={isOpen}
      onClose={onCloseCallback}
      title="Generer vaktplan fra mal"
    >
      <ScheduleTemplateSelect
        value={scheduleTemplateId}
        onChange={setScheduleTemplateId}
      />
      <Group my="md" position="right">
        <Button color={'gray'} onClick={onCloseCallback}>
          Avbryt
        </Button>
        <Button onClick={handleGenerate}>Generer</Button>
      </Group>
    </Modal>
  )
}
