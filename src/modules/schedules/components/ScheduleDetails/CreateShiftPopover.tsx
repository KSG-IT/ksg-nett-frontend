import { Button, Popover, Stack, TextInput } from '@mantine/core'
import { DatePickerInput, TimeInput } from '@mantine/dates'
import { showNotification } from '@mantine/notifications'
import { IconPlus } from '@tabler/icons-react'
import { format } from 'date-fns'
import { LocationValues } from 'modules/schedules/consts'
import { useShiftMutations } from 'modules/schedules/mutations.hooks'
import { NORMALIZED_SHIFTS_FROM_RANGE_QUERY } from 'modules/schedules/queries'
import { useState } from 'react'
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
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [shiftName, setShiftName] = useState<string>('')
  const { createShift, createShiftLoading } = useShiftMutations()
  function handleCreateShift() {
    if (!shiftDate || !startTime || !endTime || !shiftName) {
      return
    }

    const start = new Date(shiftDate)
    const end = new Date(shiftDate)

    const [startHours, startMinutes] = startTime.split(':')
    const [endHours, endMinutes] = endTime.split(':')

    start.setHours(Number(startHours))
    start.setMinutes(Number(startMinutes))
    start.setSeconds(0)
    end.setHours(Number(endHours))
    end.setMinutes(Number(endMinutes))
    end.setSeconds(0)

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
      onCompleted() {
        showNotification({
          title: 'Vakt opprettet',
          message: `${shiftName} opprettet`,
        })
        setIsOpen(false)
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
    <Popover opened={isOpen} onClose={() => setIsOpen(false)}>
      <Popover.Target>
        <Button
          color="samfundet-red"
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
          <DatePickerInput
            label="Dato"
            value={shiftDate}
            onChange={setShiftDate}
          />
          <TimeInput
            value={startTime}
            onChange={evt => setStartTime(evt.target.value)}
            label="Starttid"
          />
          <TimeInput
            value={endTime}
            onChange={evt => setEndTime(evt.target.value)}
            label="Sluttid"
          />
          <LocationSelect
            label="Lokale"
            value={location}
            onChange={setLocation}
          />

          <Button color="samfundet-red" onClick={handleCreateShift}>
            Lagre
          </Button>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  )
}
