import { UserNode } from 'modules/users/types'

export type DocumentNode = {
  id: string
  name: string
  content: string
  createdAt: string
  updatedAt: string
  createdBy: UserNode
  updatedBy: UserNode
}

// ==== QUERIES ====

export interface AllDocumentsReturn {
  allDocuments: Pick<DocumentNode, 'id' | 'name' | 'createdAt' | 'updatedAt'>[]
}

export interface DocumentDetailReturn {
  document: DocumentNode | null
}

export interface DocumentDetailVariables {
  id: string
}

// ==== MUTATIONS ====

export type PatchDocumentInput = {
  name: string
  content: string
  createdBy?: string
  updatedBy?: string

  createdAt?: string
  updatedAt?: string
}

export type PatchDocumentMutationReturns = {
  patchDocument: { document: Pick<DocumentNode, 'id'> }
}
