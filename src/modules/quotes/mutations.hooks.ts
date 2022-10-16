import { useMutation } from '@apollo/client'
import { APPROVE_QUOTE_MUTATION, INVALIDATE_QUOTE_MUTATION } from './mutations'
import {
  ApproveQuoteReturns,
  ApproveQuoteVariables,
  InvalidateQuoteReturns,
  InvalidateQuoteVariables,
} from './types.graphql'

export function useQuoteMutations() {
  const [approveQuote, { loading: approveQuoteLoading }] = useMutation<
    ApproveQuoteReturns,
    ApproveQuoteVariables
  >(APPROVE_QUOTE_MUTATION)

  const [invalidateQuote, { loading: invalidateQuoteLoading }] = useMutation<
    InvalidateQuoteReturns,
    InvalidateQuoteVariables
  >(INVALIDATE_QUOTE_MUTATION)

  return {
    approveQuote,
    approveQuoteLoading,
    invalidateQuote,
    invalidateQuoteLoading,
  }
}
