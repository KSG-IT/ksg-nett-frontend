import gql from 'graphql-tag'

export const DASHBOARD_DATA_QUERY = gql`
  query DashboardData {
    dashboardData {
      wantedList {
        id
        balance
        fullName
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
        }
      }
    }
  }
`
