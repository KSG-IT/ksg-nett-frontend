import { gql } from '@apollo/client'

export const SUMMARY_QUERY = gql`
  query Summary($id: ID!) {
    summary(id: $id) {
      id
      contents
      participants {
        id
        profileImage
        initials
      }
      summaryType
      date
      updatedAt
      reporter {
        id
        profileImage
        initials
      }
    }
  }
`

export const ALL_SUMMARIES = gql`
  query AllSummaries($q: String) {
    allSummaries(q: $q) {
      edges {
        node {
          id
          participants {
            id
            profileImage
            initials
          }
          summaryType
          date
          updatedAt
        }
      }
    }
  }
`
