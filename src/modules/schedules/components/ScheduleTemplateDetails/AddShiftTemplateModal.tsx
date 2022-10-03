import { Button, Group, Input, Modal, Select, TextInput } from '@mantine/core'
import { TimeInput } from '@mantine/dates'
import { DaySelect } from 'components/Select'
import { format } from 'util/date-fns'
import { DayValues, LocationValues } from 'modules/schedules/consts'
import { useShiftTemplateMutations } from 'modules/schedules/mutations.hooks'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { SCHEDULE_TEMPLATE_QUERY } from 'modules/schedules/queries'
import { useParams } from 'react-router-dom'

const locationOptions = [
  { value: LocationValues.BODEGAEN, label: 'Bodegaen' },
  { value: LocationValues.DAGLIGHALLEN_BAR, label: 'Daglighallen bar' },
  { value: LocationValues.LYCHE_BAR, label: 'Lyche bar' },
  { value: LocationValues.LYCHE_KJOKKEN, label: 'Lyche kjøkken' },
  { value: LocationValues.STROSSA, label: 'Strossa' },
  { value: LocationValues.STORSALEN, label: 'Storsalen' },
  { value: LocationValues.KLUBBEN, label: 'Klubben' },
  { value: LocationValues.RUNDHALLEN, label: 'Rundhallen' },
]

interface AddShiftTemplateModalParams {
  templateId: string
}

interface AddShiftTemplateModalProps {
  open: boolean
  onCloseCallback: () => void
}

export const AddShiftTemplateModal: React.FC<AddShiftTemplateModalProps> = ({
  open,
  onCloseCallback,
}) => {
  const { templateId } = useParams<
    keyof AddShiftTemplateModalParams
  >() as AddShiftTemplateModalParams
  const [name, setName] = useState('')

  const [day, setDay] = useState(DayValues.MONDAY)
  const [startTime, setStartTime] = useState(new Date())
  const [endTime, setEndTime] = useState(new Date())
  const [location, setLocation] = useState<LocationValues | null>(null)

  const { createShiftTemplate, createShiftTemplateLoading } =
    useShiftTemplateMutations()

  function handleCreateShiftTemplate() {
    const timeStart = `${format(startTime, 'HH:mm')}:00`
    const timeEnd = `${format(endTime, 'HH:mm')}:00`
    const locationInput = location ?? null

    const input = {
      name,
      day,
      timeStart,
      timeEnd,
      location: locationInput,
      scheduleTemplate: templateId,
    }

    createShiftTemplate({
      variables: {
        input,
      },
      refetchQueries: [SCHEDULE_TEMPLATE_QUERY],
      onError: error => {
        toast.error(error.message)
      },
      onCompleted: () => {
        toast.success('Vakt lagt til')
        onCloseCallback()
      },
    })
  }

  return (
    <Modal
      title="Opprett nytt standarshift"
      opened={open}
      onClose={onCloseCallback}
    >
      <TextInput
        label="Navn på vakt"
        value={name}
        onChange={e => setName(e.currentTarget.value)}
      />
      <DaySelect value={day} onChangeCallback={setDay} />
      <TimeInput
        value={startTime}
        label="Tidspunkt start"
        onChange={time => setStartTime(time)}
      ></TimeInput>
      <TimeInput
        value={endTime}
        label="Tidspunkt slutt"
        onChange={time => setEndTime(time)}
      ></TimeInput>
      <Select
        clearable
        placeholder="Ikke noe lokale valgt "
        label="Lokale"
        value={location}
        data={locationOptions}
        onChange={evt => setLocation(evt as LocationValues)}
      />

      <Group position="right" my="md">
        <Button color="gray" onClick={onCloseCallback}>
          Avbryt
        </Button>
        <Button
          loading={createShiftTemplateLoading}
          onClick={handleCreateShiftTemplate}
        >
          Opprett
        </Button>
      </Group>
    </Modal>
  )
}
