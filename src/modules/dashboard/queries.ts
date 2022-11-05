import gql from 'graphql-tag'

export const DASHBOARD_DATA_QUERY = gql`
  query DashboardData {
    dashboardData {
      wantedList {
        id
        balance
        fullName
        initials
        profileImage
      }
      lastSummaries {
        id
        date
        type
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
