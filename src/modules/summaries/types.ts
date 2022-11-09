import { UserNode } from 'modules/users/types'
import { RelayEdgesWithPageInfo } from 'types/graphql'

export enum SummaryType {
  DRIFT = 'DRIFT',
  BARSJEF = 'BARSJEF',
  DAGLIGHALLEN = 'DAGLIGHALLEN',
  STYRET = 'STYRET',
  SPRITBARSJEF = 'SPRITBARSJEF',
  HOVMESTER = 'HOVMESTER',
  KAFEANSVARLIG = 'KAFEANSVARLIG',
  SOUSCHEF = 'SOUSCHEF',
  ARRANGEMENT = 'ARRANGEMENT',
  OKONOMI = 'OKONOMI',
  KIT = 'KIT',
  ANNET = 'ANNET',
}

export interface SummaryNode {
  id: string
  contents: string
  participants: UserNode[]
  date: Date
  reporter: UserNode
  updatedAt: Date
  type: SummaryType
}

export type SummaryNodeShallow = Omit<SummaryNode, 'contents'>

/* === QUERY TYPES === */
export interface SummaryDetailQueryVariables {
  id: string
}

export interface SummaryDetailsQueryReturns {
  summary: SummaryNode | null
}

export interface AllSummariesQueryReturns {
  allSummaries: RelayEdgesWithPageInfo<SummaryNodeShallow>
}

export interface AllSummariesQueryVariables {
  q: string
  first?: number
  after?: string
}

/* === MUTATION TYPES === */

type CreateSummaryInput = {
  contents: string
  participants: string[]
  reporter: string
  type: SummaryType
  date: string
}

export type PatchSummaryInput = {
  contents: string
  participants: string[]
  reporter: string
  type: SummaryType
  date: string
}
export interface CreateSummaryMutationVariables {
  input: CreateSummaryInput
}

export interface CreateSummaryMutationReturns {
  patchSummary: {
    summary: {
      id: string
    }
  }
}

export interface PatchSummaryMutationVariables {
  id: string
  input: PatchSummaryInput
}

export interface PatchSummaryMutationReturns {
  createSummary: {
    summary: {
      id: string
    }
  }
}
