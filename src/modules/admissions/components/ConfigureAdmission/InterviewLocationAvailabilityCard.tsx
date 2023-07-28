import { useMutation } from '@apollo/client'
import {
  Button,
  Group,
  Paper,
  Stack,
  Table,
  Title,
  UnstyledButton,
} from '@mantine/core'
import { DatePickerInput, TimeInput } from '@mantine/dates'
import { showNotification } from '@mantine/notifications'
import { IconX } from '@tabler/icons-react'
import {
  CREATE_INTERVIEW_LOCATION_AVAILABILITY,
  DELETE_INTERVIEW_LOCATION,
} from 'modules/admissions/mutations'
import {
  CreateInterviewLocationAvailabilityReturns,
  CreateInterviewLocationAvailabilityVariables,
  InterviewLocationNode,
} from 'modules/admissions/types.graphql'
import { useState } from 'react'
import { DeleteMutationReturns, DeleteMutationVariables } from 'types/graphql'
import { InterviewLocationAvailabilityInline } from './InterviewLocationAvailabilityInline'

interface InterviewLocationAvailabilityProps {
  interviewLocation: InterviewLocationNode
}

export const InterviewLocationAvailabilityCard: React.VFC<
  InterviewLocationAvailabilityProps
> = ({ interviewLocation }) => {
  const [timeFrom, setTimeFrom] = useState('12:00')
  const [timeTo, setTimeTo] = useState('20:00')
  const [date, setDate] = useState<Date | null>(new Date())

  const [createInterviewLocationAvailability] = useMutation<
    CreateInterviewLocationAvailabilityReturns,
    CreateInterviewLocationAvailabilityVariables
  >(CREATE_INTERVIEW_LOCATION_AVAILABILITY, {
    refetchQueries: ['AllInterviewLocations'],
  }) // Should probably split this into its own query

  const [deleteInterviewLocationMutation] = useMutation<
    DeleteMutationReturns,
    DeleteMutationVariables
  >(DELETE_INTERVIEW_LOCATION, {
    refetchQueries: ['AllInterviewLocations'],
    onCompleted() {
      showNotification({
        title: 'Suksess',
        message: `${interviewLocation.name} slettet`,
        color: 'green',
      })
    },
    onError({ message }) {
      showNotification({
        title: 'Noe gikk galt',
        message,
        color: 'red',
      })
    },
  })

  function concatenateDateAndTime() {
    if (!date) return null

    // We now have a date and two timeinputs of a "HH:mm" format
    // Need to extrapolate two datetime objects using the time strings and the date picked

    const fromDate = new Date(date)
    const toDate = new Date(date)

    const [fromHours, fromMinutes] = timeFrom.split(':')
    const [toHours, toMinutes] = timeTo.split(':')

    fromDate.setHours(parseInt(fromHours))
    fromDate.setMinutes(parseInt(fromMinutes))
    fromDate.setSeconds(0)

    toDate.setHours(parseInt(toHours))
    toDate.setMinutes(parseInt(toMinutes))
    toDate.setSeconds(0)

    return {
      fromDate,
      toDate,
    }
  }

  function handleCreateInterviewLocationAvailability() {
    const dates = concatenateDateAndTime()

    if (!dates) return

    const { fromDate, toDate } = dates

    createInterviewLocationAvailability({
      variables: {
        input: {
          interviewLocation: interviewLocation.id,
          datetimeFrom: fromDate,
          datetimeTo: toDate,
        },
      },
    })
  }

  const handleDeleteInterviewLocation = () => {
    deleteInterviewLocationMutation({ variables: { id: interviewLocation.id } })
  }

  concatenateDateAndTime()
  return (
    <Paper p="sm">
      <Stack>
        <Group position="apart">
          <Title order={3}>{interviewLocation.name}</Title>
          <UnstyledButton onClick={handleDeleteInterviewLocation}>
            <IconX />
          </UnstyledButton>
        </Group>
        <Table>
          <thead>
            <tr>
              <th>Dato</th>
              <th>Fra</th>
              <th>Til</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {interviewLocation.availability.map(availability => (
              <InterviewLocationAvailabilityInline
                availability={availability}
                key={availability.id}
              />
            ))}
          </tbody>
        </Table>
        <Group>
          <DatePickerInput value={date} label="Dag" onChange={setDate} />
          <Group>
            <TimeInput
              value={timeFrom}
              label="Fra"
              onChange={evt => setTimeFrom(evt.target.value)}
            />
            <TimeInput
              value={timeTo}
              label="Til"
              onChange={evt => setTimeTo(evt.target.value)}
            />
          </Group>
        </Group>

        <Button
          color="samfundet-red"
          onClick={handleCreateInterviewLocationAvailability}
        >
          Legg til tilgjengelighet
        </Button>
      </Stack>
    </Paper>
  )
}
