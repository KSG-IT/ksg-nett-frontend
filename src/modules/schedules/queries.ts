import { gql } from '@apollo/client'

export const MY_UPCOMING_SHIFTS = gql`
  query MyUpcomingShifts {
    myUpcomingShifts {
      id
      location
      filledSlots {
        id
        role
        user {
          id
          initials
          fullName
          profileImage
        }
      }

      datetimeStart
      datetimeEnd
    }
  }
`

export const ALL_MY_SHIFTS = gql`
  query AllMyShifts {
    allMyShifts {
      id
      location
      filledSlots {
        id
        role
        user {
          id
          initials
          fullName
          profileImage
        }
      }

      datetimeStart
      datetimeEnd
    }
  }
`