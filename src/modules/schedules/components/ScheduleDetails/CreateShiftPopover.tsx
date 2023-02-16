import { Button, Popover, Stack, TextInput } from '@mantine/core'
import { DatePicker, TimeInput } from '@mantine/dates'
import { IconPlus } from '@tabler/icons'
import { format } from 'date-fns'
import { LocationValues } from 'modules/schedules/consts'
import { useShiftMutations } from 'modules/schedules/mutations.hooks'
import { NORMALIZED_SHIFTS_FROM_RANGE_QUERY } from 'modules/schedules/queries'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { LocationSelect } from '../LocationSelect'

interface CreateShiftPopoverProps {
  scheduleId: string
  date: string
}

export const CreateShiftPopover: React.FC<CreateShiftPopoverProps> = ({
  scheduleId,
  date,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [location, setLocation] = useState<LocationValues | null>(null)
  const [shiftDate, setShiftDate] = useState<Date | null>(
    new Date(format(new Date(date), 'yyyy-MM-dd'))
  )
  const [startTime, setStartTime] = useState<Date | null>(new Date())
  const [endTime, setEndTime] = useState<Date | null>(new Date())
  const [shiftName, setShiftName] = useState<string>('')
  const { createShift, createShiftLoading } = useShiftMutations()
  function handleCreateShift() {
    if (!shiftDate || !startTime || !endTime || !shiftName) {
      return
    }

    // Merge date and time
    const start = new Date(shiftDate)
    start.setHours(startTime.getHours())
    start.setMinutes(startTime.getMinutes())
    const end = new Date(date)
    end.setHours(endTime.getHours())
    end.setMinutes(endTime.getMinutes())

    // if end is less than start it means it's the next day
    if (end < start) {
      end.setDate(end.getDate() + 1)
    }

    createShift({
      variables: {
        input: {
          schedule: scheduleId,
          location,
          datetimeStart: start,
          datetimeEnd: end,
          name: shiftName,
        },
      },
      refetchQueries: [NORMALIZED_SHIFTS_FROM_RANGE_QUERY],
      onError() {
        toast.error('Noe gikk galt')
      },
      onCompleted() {
        toast.success('Skiftet ble opprettet')
        setIsOpen(false)
      },
    })
  }

  return (
    <Popover opened={isOpen} onClose={() => setIsOpen(false)}>
      <Popover.Target>
        <Button
          variant="subtle"
          leftIcon={<IconPlus />}
          loading={createShiftLoading}
          onClick={() => setIsOpen(true)}
        >
          Opprett vakt
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack>
          <TextInput
            label="Navn på vakt"
            value={shiftName}
            onChange={evt => setShiftName(evt.target.value)}
          />
          <DatePicker label="Dato" value={shiftDate} onChange={setShiftDate} />
          <TimeInput
            value={startTime}
            onChange={setStartTime}
            label="Starttid"
          />
          <TimeInput value={endTime} onChange={setEndTime} label="Sluttid" />
          <LocationSelect
            label="Lokale"
            value={location}
            onChange={setLocation}
          />

          <Button onClick={handleCreateShift}>Lagre</Button>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  )
}
