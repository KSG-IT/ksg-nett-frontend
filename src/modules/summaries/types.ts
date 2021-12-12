import { UserNode } from 'modules/users'
import { RelayEdgesWithPageInfo } from 'types/graphql'

export type SummaryType =
  | 'DRIFT'
  | 'BARSJEF'
  | 'STYRET'
  | 'SPRITBARSJEF'
  | 'OTHER'
  | 'HOVMESTER'
  | 'KAFEANSVARLIG'
  | 'SOUSCHEF'
  | 'ARRANGEMENT'
  | 'OKONOMI'

export interface SummaryNode {
  id: string
  contents: string
  participants: UserNode[]
  date: Date
  reporter: UserNode
  updatedAt: Date
  summaryType: SummaryType
}

export type SummaryNodeShallow = Omit<SummaryNode, 'contents'>

/* === QUERY TYPES === */
export interface SummaryQueryVariables {
  id: string
}

export interface SummaryQueryReturns {
  summary: SummaryNode
}

export interface AllSummariesQueryReturns {
  allSummaries: RelayEdgesWithPageInfo<SummaryNodeShallow>
}

export interface AllSummariesQueryVariables {
  q: string
}

/* === MUTATION TYPES === */

type CreateSummaryInput = {
  contents: String
  participants: String[]
  reporter: String
  summaryType: SummaryType
  date: String
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
