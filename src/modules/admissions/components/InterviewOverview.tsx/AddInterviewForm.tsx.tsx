import { Button, Select, Stack } from '@mantine/core'
import { DatePicker, TimeRangeInput } from '@mantine/dates'
import { showNotification } from '@mantine/notifications'
import { useInterviewMutations } from 'modules/admissions/mutations.hooks'
import { INTERVIEW_OVERRVIEW_QUERY } from 'modules/admissions/views'
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

    console.log([datetimeStart, datetimeEnd])

    createInterview({
      variables: {
        input: {
          location: locationId,
          interviewStart: datetimeStart.toISOString(),
          interviewEnd: datetimeEnd.toISOString(),
        },
      },
      refetchQueries: [INTERVIEW_OVERRVIEW_QUERY],
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
        <InterviewLocationSelect onSelectCallback={setLocationId} />
        <DatePicker value={date} onChange={val => val && setDate(val)} />
        <TimeRangeInput value={time} onChange={val => val && setTime(val)} />
        <Button type="submit">Opprett</Button>
      </Stack>
    </form>
  )
}
