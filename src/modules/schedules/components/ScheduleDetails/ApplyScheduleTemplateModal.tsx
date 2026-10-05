import { useQuery } from '@apollo/client'
import {
  Alert,
  Button,
  Checkbox,
  Group,
  List,
  Modal,
  NumberInput,
  Stack,
  Text,
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { showNotification } from '@mantine/notifications'
import { useShiftMutations } from 'modules/schedules/mutations.hooks'
import {
  NORMALIZED_SHIFTS_FROM_RANGE_QUERY,
  TEMPLATE_GENERATION_PREVIEW_QUERY,
} from 'modules/schedules/queries'
import { generationSummary } from 'modules/schedules/templateGeneration'
import { TemplateGenerationPreviewReturns } from 'modules/schedules/types.graphql'
import { useEffect, useState } from 'react'
import { format } from 'util/date-fns'
import { ScheduleTemplateSelect } from '../ScheduleTemplateSelect'

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
  const [shiftsFrom, setShiftsFrom] = useState<string | null>(
    format(new Date(), 'yyyy-MM-dd')
  )
  const [confirmed, setConfirmed] = useState(false)

  const ready = Boolean(scheduleTemplateId && shiftsFrom)
  const { data: previewData } = useQuery<TemplateGenerationPreviewReturns>(
    TEMPLATE_GENERATION_PREVIEW_QUERY,
    {
      variables: { scheduleTemplateId, startDate: shiftsFrom, numberOfWeeks },
      skip: !isOpen || !ready,
      fetchPolicy: 'network-only',
    }
  )
  const preview = ready ? previewData?.templateGenerationPreview : undefined
  const summary = preview && generationSummary(preview)
  const blocked = Boolean(preview?.needsConfirmation && !confirmed)

  // A new choice needs a new confirmation
  useEffect(() => {
    setConfirmed(false)
  }, [scheduleTemplateId, shiftsFrom, numberOfWeeks])

  function handleGenerate() {
    if (!shiftsFrom) return
    generateShiftsFromTemplate({
      variables: {
        scheduleTemplateId: scheduleTemplateId,
        startDate: shiftsFrom,
        numberOfWeeks: numberOfWeeks,
        confirmDelete: confirmed,
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
        onChange={val => setShiftsFrom(val)}
      />
      <NumberInput
        label="Antall uker"
        value={numberOfWeeks}
        min={1}
        max={20}
        onChange={val => typeof val === 'number' && setNumberOfWeeks(val)}
      />

      {summary && (
        <Stack gap="xs" mt="md">
          <Text size="sm">{summary.create}</Text>
          {summary.replace && (
            <Text size="sm" c="dimmed">
              {summary.replace}
            </Text>
          )}
          {summary.losses.length > 0 && (
            <Alert color="orange" title="Dette blir slettet">
              <List size="sm">
                {summary.losses.map(loss => (
                  <List.Item key={loss}>{loss}</List.Item>
                ))}
              </List>
              <Checkbox
                mt="sm"
                label="Jeg forstår at dette slettes"
                checked={confirmed}
                onChange={event => setConfirmed(event.currentTarget.checked)}
              />
            </Alert>
          )}
        </Stack>
      )}
      <Group my="md" justify="flex-end">
        <Button color={'gray'} onClick={onCloseCallback}>
          Avbryt
        </Button>
        <Button
          color="samfundet-red"
          disabled={!ready || blocked || generateShiftsFromTemplateLoading}
          loading={generateShiftsFromTemplateLoading}
          onClick={handleGenerate}
        >
          Generer
        </Button>
      </Group>
    </Modal>
  )
}
