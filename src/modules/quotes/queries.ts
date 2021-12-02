import { gql } from '@apollo/client'

export const APPROVED_QUOTES_QUERY = gql`
  query ApprovedQuotes($q: String) {
    approvedQuotes(q: $q) {
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
            profilePicture
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
        profilePicture
      }
    }
  }
`
