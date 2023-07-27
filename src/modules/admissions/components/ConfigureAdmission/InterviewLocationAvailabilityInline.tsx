import { useMutation } from '@apollo/client'
import { Group, UnstyledButton } from '@mantine/core'
import { IconTrash } from '@tabler/icons-react'
import { DELETE_INTERVIEW_LOCATION_AVAILABILITY } from 'modules/admissions/mutations'
import { ALL_INTERVIEW_LOCATIONS_QUERY } from 'modules/admissions/queries'
import { InterviewLocationAvailabilityNode } from 'modules/admissions/types.graphql'
import { DeleteMutationReturns, DeleteMutationVariables } from 'types/graphql'
import { format } from 'util/date-fns'

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
    refetchQueries: [ALL_INTERVIEW_LOCATIONS_QUERY],
  })

  const handleDeleteInterviewLocationAvailability = () => {
    deleteInterviewLocationAvailability()
  }

  return (
    <tr>
      <td>{format(new Date(availability.datetimeFrom), 'dd MMMM')}</td>
      <td>{format(new Date(availability.datetimeFrom), 'HH:mm')}</td>
      <td>{format(new Date(availability.datetimeTo), 'HH:mm')}</td>
      <td>
        <UnstyledButton onClick={handleDeleteInterviewLocationAvailability}>
          <IconTrash />
        </UnstyledButton>
      </td>
    </tr>
  )
}
