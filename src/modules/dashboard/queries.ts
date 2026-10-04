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
      showStockMarketShortcut
      showFeedback
      showNewbies
      sociOrderSession {
        id
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
    }
  }
`
