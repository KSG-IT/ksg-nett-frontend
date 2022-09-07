import { gql } from '@apollo/client'

export const APPROVED_QUOTES_QUERY = gql`
  query ApprovedQuotes($q: String, $first: Int, $after: String) {
    approvedQuotes(q: $q, first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          text
          context
          sum
          semester
          tagged {
            id
            initials
            profileImage
            fullName
          }
        }
      }
    }
  }
`

export const PNEDING_QUOTES_QUERY = gql`
  query PendingQuotes {
    pendingQuotes {
      id
      text
      context
      createdAt
      tagged {
        id
        initials
        profileImage
      }
    }
  }
`

export const POPULAR_QUOTES_QUERY = gql`
  query PopularQuotes {
    currentSemesterShorthand
    popularQuotesCurrentSemester {
      id
      text
      context
      sum
      semester
      tagged {
        id
        initials
        profileImage
      }
    }
    popularQuotesAllTime {
      id
      text
      context
      sum
      semester
      tagged {
        id
        initials
        profileImage
      }
    }
  }
`

export const POPULAR_QUOTES_ALL_TIME_QUERY = gql`
  query PopularQuotesAllTime {
    popularQuotesAllTime {
      id
      text
      context
      sum
      semester
      tagged {
        id
        initials
        profileImage
      }
    }
  }
`
