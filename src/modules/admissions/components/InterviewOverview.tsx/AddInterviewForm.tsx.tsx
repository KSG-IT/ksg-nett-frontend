import { Button, Group, Stack } from '@mantine/core'
import { DatePickerInput, TimeInput } from '@mantine/dates'
import { showNotification } from '@mantine/notifications'
import { MessageBox } from 'components/MessageBox'
import { useInterviewMutations } from 'modules/admissions/mutations.hooks'
import { INTERVIEW_TABLE_OVERVIEW_QUERY } from 'modules/admissions/queries'
import { useState } from 'react'
import { InterviewLocationSelect } from '../InterviewLocationSelect'

interface AddInterviewFormProps {
  onCloseCallback?: () => void
}

export const AddInterviewForm: React.FC<AddInterviewFormProps> = ({
  onCloseCallback,
}) => {
  const [locationId, setLocationId] = useState('')
  const [date, setDate] = useState(new Date())
  const [timeSTart, setTimeStart] = useState('12:00')
  const [timeEnd, setTimeEnd] = useState('12:30')

  const { createInterview } = useInterviewMutations()

  function handleSubmit(evt: React.FormEvent) {
    evt.preventDefault()

    if (locationId === '') {
      showNotification({
        title: 'Noe gikk galt',
        message: 'Du må velge intervjulokale!',
        color: 'red',
      })
      return
    }

    const [startHours, startMinutes] = timeSTart.split(':')
    const [endHours, endMinutes] = timeEnd.split(':')

    const datetimeStart = new Date(date)
    datetimeStart.setHours(Number(startHours))
    datetimeStart.setMinutes(Number(startMinutes))
    datetimeStart.setSeconds(0)
    datetimeStart.setMilliseconds(0)

    const datetimeEnd = new Date(date)
    datetimeEnd.setHours(Number(endHours))
    datetimeEnd.setMinutes(Number(endMinutes))
    datetimeEnd.setSeconds(0)
    datetimeEnd.setMilliseconds(0)

    if (datetimeStart.getTime() >= datetimeEnd.getTime()) {
      showNotification({
        title: 'Noe gikk galt',
        message: 'Starttid må være før sluttid',
        color: 'red',
      })
      return
    }

    // duration has to be 30 minutes
    if (datetimeEnd.getTime() - datetimeStart.getTime() !== 30 * 60 * 1000) {
      showNotification({
        title: 'Noe gikk galt',
        message: 'Intervju må være 30 minutter',
        color: 'red',
      })
      return
    }

    // minutes have to be either 00 or 30, if not raise error
    if (datetimeStart.getMinutes() !== 0 && datetimeStart.getMinutes() !== 30) {
      showNotification({
        title: 'Noe gikk galt',
        message: 'Starttid må være hel eller halv',
        color: 'red',
      })
      return
    }

    createInterview({
      variables: {
        input: {
          location: locationId,
          interviewStart: datetimeStart.toISOString(),
          interviewEnd: datetimeEnd.toISOString(),
        },
      },
      refetchQueries: [INTERVIEW_TABLE_OVERVIEW_QUERY],
      onCompleted() {
        showNotification({
          title: 'Suksess',
          message: `Intervju i ${locationId} opprettet`,
        })
        onCloseCallback && onCloseCallback()
      },
      onError({ message }) {
        showNotification({
          title: 'Noe gikk galt',
          message: message,
          color: 'red',
        })
      },
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        <MessageBox type="warning">
          Ikke veldig godt laget. Intervjustart må være hel eller halv.
          Intervjuslutt må være en halvtime senere.
        </MessageBox>
        <InterviewLocationSelect onSelectCallback={setLocationId} />
        <DatePickerInput
          value={date}
          label="Dato"
          onChange={val => val && setDate(val)}
        />

        <Group>
          <TimeInput
            value={timeSTart}
            label="Intervjustart"
            onChange={evt => setTimeStart(evt.target.value)}
          />
          <TimeInput
            value={timeEnd}
            label="Intervjuslutt"
            onChange={evt => setTimeEnd(evt.target.value)}
          />
        </Group>
        <Button type="submit">Opprett</Button>
      </Stack>
    </form>
  )
}
