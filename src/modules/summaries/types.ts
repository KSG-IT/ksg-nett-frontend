import { UserNode } from 'modules/users'
import { RelayEdgesWithPageInfo } from 'types/graphql'

export enum SummaryType {
  DRIFT = 'DRIFT',
  BARSJEF = 'BARSJEF',
  DAGLIGHALLEN = 'DAGLIGHALLEN',
  STYRET = 'STYRET',
  SPRITBARSJEF = 'SPRITBARSJEF',
  HOVMESTER = 'HOVMSTER',
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
  participants: String[]
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
  createSummary: {
    summary: {
      id: String
    }
  }
}

export interface PatchSummaryMutationVariables {
  id: string
  input: PatchSummaryInput
}

export interface PatchSummaryMutationReturns {
  patchSummary: {
    summary: {
      id: string
      contents: string
      participants: string[]
      report: string[]
      date: Date
      type: SummaryType
    }
  }
}
