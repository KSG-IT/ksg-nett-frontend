import { useMutation } from '@apollo/client'
import {
  CreateDocumentReturns,
  CREATE_DOCUMENT_MUTATION,
  DeleteDocumentReturns,
  DeleteDocumentVariables,
  PatchDocumentReturns,
  PatchDocumentVariables,
  PATCH_DOCUMENT,
} from './mutations'
import { DELETE_DOCUMENT } from './queries'

export function useDocumentMutations() {
  const [patchDocument, { loading: patchDocumentLoading }] = useMutation<
    PatchDocumentReturns,
    PatchDocumentVariables
  >(PATCH_DOCUMENT)

  const [createDocument, { loading: createDocumentLoading }] =
    useMutation<CreateDocumentReturns>(CREATE_DOCUMENT_MUTATION)

  const [deleteDocument, { loading: deleteDocumentLoading }] = useMutation<
    DeleteDocumentReturns,
    DeleteDocumentVariables
  >(DELETE_DOCUMENT)

  return {
    patchDocument,
    patchDocumentLoading,
    createDocument,
    createDocumentLoading,
    deleteDocument,
    deleteDocumentLoading,
  }
}
