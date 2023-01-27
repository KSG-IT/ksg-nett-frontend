import { useMutation } from '@apollo/client'
import { gql } from 'graphql-tag'
import { DELETE_DOCUMENT } from './queries'
import { DocumentNode, PatchDocumentInput } from './types.graphql'

export const PATCH_DOCUMENT = gql`
  mutation PatchDocument($id: ID!, $input: PatchDocumentInput!) {
    patchDocument(id: $id, input: $input) {
      document {
        id
      }
    }
  }
`

export const CREATE_DOCUMENT_MUTATION = gql`
  mutation CreateDocument($input: CreateDocumentInput!) {
    createDocument(input: $input) {
      document {
        id
      }
    }
  }
`

export interface PatchDocumentReturns {
  patchDocument: { document: Pick<DocumentNode, 'id'> }
}

export interface PatchDocumentVariables {
  id: string
  input: PatchDocumentInput
}

export interface CreateDocumentReturns {
  createDocument: { document: Pick<DocumentNode, 'id'> }
}

export interface DeleteDocumentVariables {
  id: string
}

export interface DeleteDocumentReturns {
  deleteDocument: { found: boolean }
}
