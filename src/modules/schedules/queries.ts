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

export const SCHEDULE_QUERY = gql`
  query Schedule($id: ID!, $shiftsFrom: Date!, $numberOfWeeks: Int!) {
    schedule(id: $id) {
      id
      shiftsFromRange(shiftsFrom: $shiftsFrom, numberOfWeeks: $numberOfWeeks) {
        id
        location
        datetimeStart
        datetimeEnd
        slots {
          id
          role
          user {
            id
            initials
            fullName
            profileImage
          }
        }
      }
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

export const SCHEDULE_TEMPLATE_QUERY = gql`
  query ScheduleTemplate($id: ID!) {
    scheduleTemplate(id: $id) {
      id
      name
      schedule {
        id
        name
      }
      shiftTemplates {
        id
        location
        timeStart
        timeEnd
        day
        duration
        shiftSlotTemplates {
          id
          count
          role
        }
      }
    }
  }
`
