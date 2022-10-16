import { useMutation } from '@apollo/client'
import { DeleteMutationReturns, DeleteMutationVariables } from 'types/graphql'
import {
  APPROVE_QUOTE_MUTATION,
  DELETE_QUOTE,
  INVALIDATE_QUOTE_MUTATION,
} from './mutations'
import {
  ApproveQuoteReturns,
  ApproveQuoteVariables,
  InvalidateQuoteReturns,
  InvalidateQuoteVariables,
  QuoteNode,
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

  const [deleteQuote, { loading: deleteQuoteLoading }] = useMutation<
    DeleteMutationReturns,
    DeleteMutationVariables
  >(DELETE_QUOTE)

  return {
    approveQuote,
    approveQuoteLoading,
    invalidateQuote,
    invalidateQuoteLoading,
    deleteQuote,
    deleteQuoteLoading,
  }
}
