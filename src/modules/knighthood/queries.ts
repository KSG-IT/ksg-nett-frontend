import { gql } from '@apollo/client'

export const ALL_KNIGHTHOODS_QUERY = gql`
  query AllKnighthoods {
    allKnighthoods {
      id
      description
      knightedAt
      user {
        id
        getCleanFullName
      }
    }
  }
`
