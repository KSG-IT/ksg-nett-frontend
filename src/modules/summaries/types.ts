import { UserNode } from 'modules/users'
import { RelayEdgesWithPageInfo } from 'types/graphql'

export type SummaryType =
  | 'DRIFT'
  | 'BARSJEF'
  | 'STYRET'
  | 'SPRITBARSJEF'
  | 'ANNET'
  | 'HOVMESTER'
  | 'KAFEANSVARLIG'
  | 'SOUSCHEF'
  | 'ARRANGEMENT'
  | 'OKONOMI'

export enum SummaryTypeEnum {
  drift = 'drift',
  barsjef = 'barsjef',
  styret = 'styret',
  spritbarsjef = 'spritbarsjef',
  annet = 'annet',
  arrangement = 'arrangement',
  okonomi = 'okonomi',
  kafeansvarlig = 'kafeansvarlig',
  hovmester = 'hovmester',
  souschef = 'souschef',
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
  first?: number
  after?: string
}

/* === MUTATION TYPES === */

type CreateSummaryInput = {
  contents: String
  participants: String[]
  reporter: String
  type: SummaryTypeEnum
  date: string
}

type PatchSummaryInput = {
  contents: String
  participants: String[]
  reporter: String
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
      type: SummaryTypeEnum
    }
  }
}
