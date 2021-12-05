import { UserNode } from 'modules/users'

export interface QuoteNode {
  id: string
  text: string
  reportedBy: UserNode
  tagged: UserNode[]
  verifiedBy: UserNode | null
  context: string
  sum: number
}
