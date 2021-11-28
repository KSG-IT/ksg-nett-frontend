import { UserNode } from 'modules/users'

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
  updated_at: Date
  summaryType: SummaryType
}
