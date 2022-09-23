import { gql } from '@apollo/client'

export const MY_UPCOMING_SHIFTS = gql`
  query MyUpcomingShifts {
    myUpcomingShifts {
      id
      location
      filledSlots {
        id
        role {
          id
          name
        }
        user {
          id
          initials
          fullName
        }
      }

      datetimeStart
      datetimeEnd
    }
  }
`
