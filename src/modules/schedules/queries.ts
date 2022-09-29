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

export const ALL_SCHEDULES = gql`
  query AllSchedules {
    allSchedules {
      id
      name
    }
  }
`

export const ALL_SCHEDULE_TEMPLATES = gql`
  query AllScheduleTemplates {
    allScheduleTemplates {
      id
      name
      schedule {
        id
        name
      }
    }
  }
`
