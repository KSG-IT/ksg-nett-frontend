import { UserThumbnailProps } from 'modules/users/types'

export type DocumentNode = {
  id: string
  name: string
  content: string
  createdAt: string
  updatedAt: string
  createdBy: UserThumbnailProps['user']
  updatedBy: UserThumbnailProps['user']
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
