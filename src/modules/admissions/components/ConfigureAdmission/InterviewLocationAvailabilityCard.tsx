import { useMutation } from '@apollo/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Group, Paper, Title } from '@mantine/core'
import { DatePicker, TimeRangeInput } from '@mantine/dates'
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
import { toast } from 'react-hot-toast'
import styled from 'styled-components'
import { DeleteMutationReturns, DeleteMutationVariables } from 'types/graphql'
import { InterviewLocationAvailabilityInline } from './InterviewLocationAvailabilityInline'
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const DeleteInterviewLocationIcon = styled(FontAwesomeIcon)`
  color: ${props => props.theme.colors.error};
  &:hover {
    cursor: pointer;
  }
`

const CardHeader = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 10px;
  align-items: center;
`

const InterviewLocationName = styled.h2`
  margin: 0;
`
interface InterviewLocationAvailabilityProps {
  interviewLocation: InterviewLocationNode
}

export const InterviewLocationAvailabilityCard: React.VFC<
  InterviewLocationAvailabilityProps
> = ({ interviewLocation }) => {
  const [from, setFrom] = useState<[Date, Date]>([new Date(), new Date()])
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
    onCompleted: () => {
      toast.success('Slettet Intervjulokale')
    },
  })

  function concatenateDateAndTime() {
    // We create two new datetime objects using the range of the time
    if (date === null) return
    const fromDate = new Date(date)
    fromDate.setHours(from[0].getHours())
    fromDate.setMinutes(from[0].getMinutes())
    fromDate.setSeconds(0)
    const toDate = new Date(date)
    toDate.setHours(from[1].getHours())
    toDate.setMinutes(from[1].getMinutes())
    toDate.setSeconds(0)

    return {
      fromDate,
      toDate,
    }
  }

  const handleCreateInterviewLocationAvailability = () => {
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
    <Paper p="lg">
      <CardHeader>
        <Title order={3}>{interviewLocation.name}</Title>
        <DeleteInterviewLocationIcon
          icon="times"
          size="lg"
          onClick={handleDeleteInterviewLocation}
        />
      </CardHeader>
      {/* Refactor this into a mantine table */}
      {interviewLocation.availability.map(availability => (
        <InterviewLocationAvailabilityInline
          availability={availability}
          key={availability.id}
        />
      ))}
      <Group>
        <DatePicker value={date} onChange={setDate} />
        <TimeRangeInput
          value={from}
          onChange={setFrom}
          // onChange={evt => setFrom(evt.target.value)}
        />
      </Group>

      <Button onClick={handleCreateInterviewLocationAvailability}>
        Legg til intervall
      </Button>
    </Paper>
  )
}
