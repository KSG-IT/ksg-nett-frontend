import { Button, Stack } from '@mantine/core'
import { DatePicker, TimeRangeInput } from '@mantine/dates'
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
  const [time, setTime] = useState<[Date, Date]>([new Date(), new Date()])

  const { createInterview } = useInterviewMutations()

  function handleSubmit(evt: React.FormEvent) {
    evt.preventDefault()

    const [startTime, endTime] = time
    const datetimeStart = new Date(date)
    datetimeStart.setHours(startTime.getHours())
    datetimeStart.setMinutes(startTime.getMinutes())
    datetimeStart.setSeconds(0)
    datetimeStart.setMilliseconds(0)

    const datetimeEnd = new Date(date)
    datetimeEnd.setHours(endTime.getHours())
    datetimeEnd.setMinutes(endTime.getMinutes())
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
        <DatePicker
          value={date}
          onChange={val => val && setDate(val)}
          label="Dato"
        />
        <TimeRangeInput
          value={time}
          onChange={val => val && setTime(val)}
          label="Intervjutid"
        />
        <Button type="submit">Opprett</Button>
      </Stack>
    </form>
  )
}
