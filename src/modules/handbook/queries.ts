import { gql } from '@apollo/client'

export const ALL_DOCUMENTS_QUERY = gql`
  query AllDocuments {
    allDocuments {
      id
      name
      createdAt
      updatedAt
      updatedBy {
        firstName
        getCleanFullName
      }
    }
  }
`
export const DELETE_DOCUMENT = gql`
  mutation DeleteDocument($id: ID!) {
    deleteDocument(id: $id) {
      found
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
