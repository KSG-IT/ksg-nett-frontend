import { gql, useMutation } from '@apollo/client'
import { MutationHookOptions } from 'react-apollo'

const CREATE_SHIFT_MUTATION = gql`
  mutation CreateShift(
    $name: String!
    $description: String
    $schedule: ID!
    $start: DateTime!
    $end: DateTime!
  ) {
    createNewShift(
      input: {
        name: $name
        description: $description
        schedule: $schedule
        start: $start
        end: $end
      }
    ) {
      shift {
        id
      }
    }
  }
`

interface Shift {
  id: string
}

export const useCreateShiftMutation = (
  options: MutationHookOptions<Shift> = {}
) => useMutation(CREATE_SHIFT_MUTATION, options)
