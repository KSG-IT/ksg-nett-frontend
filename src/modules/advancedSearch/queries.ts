import { gql } from '@apollo/client'

export const FETCH_USERS_ADVANCED_QUERY = gql`
  query AdvancedSearch(
    $query: String
    $status: [String]
    $gang: [String]
    $verv: [String]
    $konto: String
    $first: Int
    $after: String
  ) {
    user(
      query: $query
      status: $status
      gang: $gang
      verv: $verv
      konto: $konto
      first: $first
      after: $after
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      user {
        id
        firstName
        lastName
        profileImage
      }
    }
  }
`
