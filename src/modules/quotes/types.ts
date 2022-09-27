import { UserNode } from 'modules/users/types'
import { RelayEdgesWithPageInfo } from 'types/graphql'

export interface QuoteNode {
  id: string
  text: string
  reportedBy: UserNode
  tagged: Pick<UserNode, 'id' | 'profileImage' | 'initials' | 'fullName'>[]
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
  first: number
  after?: string
}

export interface PendingQuotesReturns {
  pendingQuotes: QuoteNode[]
}

export interface PopularQuotesReturns {
  popularQuotesCurrentSemester: QuoteNode[]
  popularQuotesAllTime: QuoteNode[]
  currentSemesterShorthand: `${'H' | 'V'}${number}`
}

/* ==== Mutation TYPING === */

export interface DeleteUserQuoteVoteVariables {
  quoteId: string
}

export interface DeleteUserQuoteVoteReturns {
  deleteUserQuoteVote: {
    found: boolean
    quoteSum: number
  }
}

export type CreateQuoteInput = {
  text: string
  context: string | null
  tagged: string[]
  createdAt: string
}

export type PatchQuoteInput = {
  text?: string
  context?: string
  reportedBy?: string
  tagged?: Pick<UserNode, 'id' | 'profileImage' | 'initials' | 'fullName'>[]
}

export interface PatchQuoteVariables {
  id: string
  input: PatchQuoteInput
}

export interface PatchQuoteReturns {}

export interface CreateQuoteVariables {
  input: CreateQuoteInput
}

export interface CreateQuoteReturns {
  quote: {
    id: string
  }
}

export type CreateQuoteVoteInput = {
  quote: string
  value: number
}
export interface CreateQuoteVoteVariables {
  input: CreateQuoteVoteInput
}

export interface CreateQuoteVoteReturns {
  createQuoteVote: {
    quoteVote: {
      id: string
      quote: {
        sum: number
      }
    }
  }
}
