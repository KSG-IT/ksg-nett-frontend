import { UserNode } from 'modules/users'
import { RelayEdgesWithPageInfo } from 'types/graphql'

type SummaryType =
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
