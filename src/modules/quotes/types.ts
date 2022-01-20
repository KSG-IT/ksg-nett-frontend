import { UserNode } from 'modules/users'
import { RelayEdgesWithPageInfo } from 'types/graphql'

export interface QuoteNode {
  id: string
  text: string
  reportedBy: UserNode
  tagged: Pick<UserNode, 'id' | 'profileImage' | 'initials'>[]
  verifiedBy: UserNode | null
  context: string
  sum: number
  semester: `${'H' | 'V'}${number}`
  createdAt: Date
}

/* ==== QUERY TYPING === */
export interface ApprovedQuotesReturns {
  approvedQuotes: RelayEdgesWithPageInfo<QuoteNode>
}

export interface ApprovedQuotesVariables {
  q: string
}

export interface PendingQuotesReturns {
  pendingQuotes: QuoteNode[]
}

/* ==== Mutation TYPING === */

export type CreateQuoteInput = {
  text: string
  context: string | null
  tagged: string[]
}

export interface CreateQuoteVariables {
  input: CreateQuoteInput
}

export interface CreateQuoteReturns {
  quote: {
    id: string
  }
}

export interface DeleteQuoteVoteVariables {
  id: string
}

export interface DeleteQuoteVoteReturns {
  found: boolean
}

export type CreateQuoteVoteInput = {
  quote: string
  value: number
  caster: string
}
export interface CreateQuoteVoteVariables {
  input: CreateQuoteVoteInput
}

export interface CreateQuoteVoteReturns {
  quote: Pick<QuoteNode, 'id'>
}
