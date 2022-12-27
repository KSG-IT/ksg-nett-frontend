import { gql } from '@apollo/client'

export const ALL_DOCUMENTS_QUERY = gql`
  query AllDocuments {
    allDocuments {
      id
      name
      createdAt
      updatedAt
    }
  }
`

export const DOCUMENT_DETAIL_QUERY = gql`
  query DocumentDetail($id: ID!) {
    document(id: $id) {
      id
      name
      content
      createdAt
      updatedAt
      createdBy {
        id
        profileImage
        getFullWithNickName
        initials
      }
      updatedBy {
        id
        profileImage
        getFullWithNickName
        initials
      }
    }
  }
`
