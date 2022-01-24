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
