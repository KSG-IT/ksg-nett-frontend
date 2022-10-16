import { QuoteNode } from './types'

export interface ApproveQuoteReturns {
  quote: Pick<QuoteNode, 'id'>
}
export interface ApproveQuoteVariables {
  quoteId: string
}

export interface InvalidateQuoteReturns {
  quote: Pick<QuoteNode, 'id'>
}
export interface InvalidateQuoteVariables {
  quoteId: string
}
