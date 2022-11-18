import gql from 'graphql-tag'

export const DASHBOARD_DATA_QUERY = gql`
  query DashboardData {
    dashboardData {
      wantedList {
        id
        balance
        getCleanFullName
        getFullWithNickName
        initials
        profileImage
      }
      lastQuotes {
        id
        text
        context
        tagged {
          id
          profileImage
          initials
          getFullWithNickName
          getCleanFullName
        }
        semester
        sum
      }
      myUpcomingShifts {
        roleDisplay
        shift {
          locationDisplay
          datetimeStart
          datetimeEnd
          schedule {
            name
          }
        }
      }
    }
  }
`
