import { gql } from '@apollo/client'

export const MY_UPCOMING_SHIFTS = gql`
  query MyUpcomingShifts {
    myUpcomingShifts {
      id
      location
      name
      filledSlots {
        id
        role
        user {
          id
          initials
          getCleanFullName
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
      name
      filledSlots {
        id
        role
        user {
          id
          initials
          getFullWithNickName
          getCleanFullName
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
  query Schedule($id: ID!) {
    schedule(id: $id) {
      id
      name
      displayMode
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

export const NORMALIZED_SHIFTS_FROM_RANGE_QUERY = gql`
  query NormalizedShiftsFromRange(
    $scheduleId: ID!
    $shiftsFrom: Date!
    $numberOfWeeks: Int!
  ) {
    normalizedShiftsFromRange(
      scheduleId: $scheduleId
      shiftsFrom: $shiftsFrom
      numberOfWeeks: $numberOfWeeks
    ) {
      ... on ShiftDayWeek {
        date
        shiftDays {
          date
          shifts {
            id
            name
            isFilled
            schedule {
              id
              name
            }
            slots {
              id
              role
              user {
                id
                initials
                getFullWithNickName
                profileImage
              }
            }
            location
            datetimeStart
            datetimeEnd
          }
        }
      }
      ... on ShiftLocationWeek {
        date
        shiftDays {
          date
          locations {
            location
            shifts {
              id
              name
              isFilled
              schedule {
                id
                name
              }
              slots {
                id
                role
                user {
                  id
                  initials
                  getFullWithNickName
                  profileImage
                }
              }
              location
              datetimeStart
              datetimeEnd
            }
          }
        }
      }
    }
  }
`

export const ALL_SHIFTS = gql`
  query AllShifts($date: Date!) {
    allShifts(date: $date) {
      id
      name
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
    }
  }
`

export const ALL_USERS_WORKING_TODAY_AND_SOCI_PRODUCTS = gql`
  query AllUsersWorkingTodayAndSociProducts {
    allUsersWorkingToday {
      id
      initials
      fullName
    }
    defaultSociProducts {
      id
      name
    }
  }
`
