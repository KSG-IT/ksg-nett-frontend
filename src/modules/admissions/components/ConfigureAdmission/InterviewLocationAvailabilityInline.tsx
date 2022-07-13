import { useMutation } from '@apollo/client'
import { format } from 'date-fns'
import { DELETE_INTERVIEW_LOCATION_AVAILABILITY } from 'modules/admissions/mutations'
import { InterviewLocationAvailabilityNode } from 'modules/admissions/types.graphql'
import styled from 'styled-components'
import { DeleteMutationReturns, DeleteMutationVariables } from 'types/graphql'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`

interface InterviewLocationAvailabilityInlineProps {
  availability: InterviewLocationAvailabilityNode
}
export const InterviewLocationAvailabilityInline: React.VFC<
  InterviewLocationAvailabilityInlineProps
> = ({ availability }) => {
  const [deleteInterviewLocationAvailability] = useMutation<
    DeleteMutationReturns,
    DeleteMutationVariables
  >(DELETE_INTERVIEW_LOCATION_AVAILABILITY, {
    variables: { id: availability.id },
    refetchQueries: ['AllInterviewLocations'],
  })

  const handleDeleteInterviewLocationAvailability = () => {
    deleteInterviewLocationAvailability()
  }
  /*
    Easiest way to about this is to not make the inline availabilities editable. This way we don't
    need to care about managing some global state and we simply just hit a "generate" button which uses
    all the settings available in the database
  */
  return (
    <Wrapper>
      <label>Tilgjengelig fra</label>{' '}
      <span>{format(new Date(availability.datetimeFrom), 'MM.dd HH:mm')}</span>{' '}
      <label>Til</label>
      <span>{format(new Date(availability.datetimeTo), 'MM.dd HH:mm')}</span>
      <button onClick={handleDeleteInterviewLocationAvailability}>Slett</button>
    </Wrapper>
  )
}
