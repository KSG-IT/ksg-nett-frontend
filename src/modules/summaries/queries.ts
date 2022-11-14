import { gql } from '@apollo/client'

export const SUMMARY_QUERY = gql`
  query Summary($id: ID!) {
    summary(id: $id) {
      id
      contents
      title
      participants {
        id
        profileImage
        initials
        getFullWithNickName
      }
      internalGroup {
        id
        name
      }
      displayName
      date
      updatedAt
      reporter {
        id
        profileImage
        initials
        getFullWithNickName
      }
    }
  }
`

export const ALL_SUMMARIES = gql`
  query AllSummaries($q: String, $first: Int, $after: String) {
    allSummaries(q: $q, first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          displayName
          reporter {
            id
            profileImage
            initials
            getCleanFullName
            getFullWithNickName
          }
          participants {
            id
            profileImage
            initials
            getCleanFullName
            getFullWithNickName
          }
          date
          updatedAt
        }
      }
    }
  }
`
