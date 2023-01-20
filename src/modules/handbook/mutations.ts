import { DocumentNode, PatchDocumentInput } from './types.graphql'
import { useMutation } from '@apollo/client'
import { gql } from 'graphql-tag'

export const PATCH_DOCUMENT = gql`
  mutation UpdateDocument($id: ID!, $input: UpdateDocumentInput!) {
    updateDocument(id: $id, input: $input) {
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

interface PatchDocumentVariables {
  id: string
  input: PatchDocumentInput
}

export interface CreateDocumentReturns {
  createDocument: { document: Pick<DocumentNode, 'id'> }
}

export function usePatchDocumentMutations() {
  const [patchDocument, { loading, error }] = useMutation<
    PatchDocumentReturns,
    PatchDocumentVariables
  >(PATCH_DOCUMENT)

  const [createDocument, { loading: createDocumentLoading }] =
    useMutation<CreateDocumentReturns>(CREATE_DOCUMENT_MUTATION)

  return {
    patchDocument,
    loading,
    error,
    createDocument,
    createDocumentLoading,
  }
}
