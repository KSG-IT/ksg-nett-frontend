import { Button, Group, Modal, NumberInput, Text } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { showNotification } from '@mantine/notifications'
import { add } from 'date-fns'
import { useShiftMutations } from 'modules/schedules/mutations.hooks'
import { NORMALIZED_SHIFTS_FROM_RANGE_QUERY } from 'modules/schedules/queries'
import { useState } from 'react'
import { format } from 'util/date-fns'
import { ScheduleTemplateSelect } from '../ScheduleTemplateSelect'

function getMondayOfWeekFromDate(date: Date) {
  date = new Date(date)
  const first = date.getDate() - date.getDay() + 1
  return new Date(date.setDate(first))
}

function getSundayOfWeekFromDate(date: Date) {
  date = new Date(date)
  const first = date.getDate() - date.getDay() + 1
  const last = first + 6
  return new Date(date.setDate(last))
}

interface ApplyScheduleTemplateModalProps {
  isOpen: boolean
  onCloseCallback: () => void
}

export const ApplyScheduleTemplateModal: React.FC<
  ApplyScheduleTemplateModalProps
> = ({ isOpen, onCloseCallback }) => {
  const { generateShiftsFromTemplate, generateShiftsFromTemplateLoading } =
    useShiftMutations()
  const [scheduleTemplateId, setScheduleTemplateId] = useState('')
  const [numberOfWeeks, setNumberOfWeeks] = useState(1)
  const [shiftsFrom, setShiftsFrom] = useState<Date | null>(new Date())

  function handleGenerate() {
    if (!shiftsFrom) return
    generateShiftsFromTemplate({
      variables: {
        scheduleTemplateId: scheduleTemplateId,
        startDate: format(shiftsFrom, 'yyyy-MM-dd'),
        numberOfWeeks: numberOfWeeks,
      },
      refetchQueries: [NORMALIZED_SHIFTS_FROM_RANGE_QUERY],
      onCompleted: () => {
        showNotification({
          title: 'Vakter opprettet',
          message: 'Vaktene ble opprettet',
          color: 'green',
        })
        onCloseCallback()
      },
      onError: ({ message }) => {
        showNotification({
          title: 'Noe gikk galt',
          message: message,
        })
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
      <DatePickerInput
        label="Startdato"
        value={shiftsFrom}
        onChange={setShiftsFrom}
      />
      <NumberInput
        label="Antall uker"
        value={numberOfWeeks}
        min={1}
        max={20}
        onChange={val => val && setNumberOfWeeks(val)}
      />

      <Text>
        Første vakt genererert fra{' '}
        {shiftsFrom &&
          format(getMondayOfWeekFromDate(shiftsFrom), 'EEEE dd.MMM')}
      </Text>
      <Text>
        Siste vakt generert til{' '}
        {shiftsFrom &&
          format(
            getSundayOfWeekFromDate(
              add(shiftsFrom, { weeks: numberOfWeeks - 1 })
            ),
            'EEE dd.MMM'
          )}
      </Text>
      <Group my="md" position="right">
        <Button color={'gray'} onClick={onCloseCallback}>
          Avbryt
        </Button>
        <Button
          color="samfundet-red"
          disabled={generateShiftsFromTemplateLoading}
          loading={generateShiftsFromTemplateLoading}
          onClick={handleGenerate}
        >
          Generer
        </Button>
      </Group>
    </Modal>
  )
}
