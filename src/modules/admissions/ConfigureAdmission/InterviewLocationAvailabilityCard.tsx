import { useMutation } from '@apollo/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Card } from 'components/Card'
import { InterviewLocationNode } from 'modules/admissions/types'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import styled from 'styled-components'
import { DeleteMutationReturns, DeleteMutationVariables } from 'types/graphql'
import { InterviewLocationAvailabilityInline } from './InterviewLocationAvailabilityInline'
import {
  CREATE_INTERVIEW_LOCATION_AVAILABILITY,
  DELETE_INTERVIEW_LOCATION,
} from './mutations'
import {
  CreateInterviewLocationAvailabilityReturns,
  CreateInterviewLocationAvailabilityVariables,
} from './types'
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
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  const [createInterviewLocationAvailability] = useMutation<
    CreateInterviewLocationAvailabilityReturns,
    CreateInterviewLocationAvailabilityVariables
  >(CREATE_INTERVIEW_LOCATION_AVAILABILITY, {
    refetchQueries: ['AllInterviewLocations'],
  }) // Should probably split this into its own query

  const [deleteInterviewLocationMutation] = useMutation<
    DeleteMutationReturns,
    DeleteMutationVariables
  >(DELETE_INTERVIEW_LOCATION, { refetchQueries: ['AllInterviewLocations'] })

  const handleCreateInterviewLocationAvailability = () => {
    const fromDate = new Date(from)
    const toDate = new Date(to)
    if (fromDate.getTime() > toDate.getTime()) {
      toast.error('Tidspunkt fra må være før tidspunkt til')
      return
    }

    if (from === '' || to === '') return
    createInterviewLocationAvailability({
      variables: {
        input: {
          interviewLocation: interviewLocation.id,
          datetimeFrom: new Date(from),
          datetimeTo: new Date(to),
        },
      },
    })
  }

  const handleDeleteInterviewLocation = () => {
    deleteInterviewLocationMutation({ variables: { id: interviewLocation.id } })
  }

  return (
    <Card>
      <Wrapper>
        <CardHeader>
          <InterviewLocationName>
            {interviewLocation.name}
          </InterviewLocationName>
          <DeleteInterviewLocationIcon
            icon="times"
            size="lg"
            onClick={handleDeleteInterviewLocation}
          />
        </CardHeader>
        {interviewLocation.availability.map(availability => (
          <InterviewLocationAvailabilityInline
            availability={availability}
            key={availability.id}
          />
        ))}
        <input
          type="datetime-local"
          value={from}
          onChange={evt => setFrom(evt.target.value)}
        />
        <input
          type="datetime-local"
          value={to}
          onChange={evt => setTo(evt.target.value)}
        />
        <button onClick={handleCreateInterviewLocationAvailability}>
          Legg til intervall
        </button>
      </Wrapper>
    </Card>
  )
}
