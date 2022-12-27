import { useMutation } from '@apollo/client'
import { DeleteMutationReturns, DeleteMutationVariables } from 'types/graphql'
import {
  APPROVE_QUOTE_MUTATION,
  CREATE_QUOTE_VOTE,
  DELETE_QUOTE,
  DELETE_USER_QUOTE_VOTE,
  INVALIDATE_QUOTE_MUTATION,
} from './mutations'
import {
  ApproveQuoteReturns,
  ApproveQuoteVariables,
  CreateQuoteVoteReturns,
  CreateQuoteVoteVariables,
  DeleteUserQuoteVoteReturns,
  DeleteUserQuoteVoteVariables,
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

  const [deleteQuote, { loading: deleteQuoteLoading }] = useMutation<
    DeleteMutationReturns,
    DeleteMutationVariables
  >(DELETE_QUOTE)

  const [upvote, { loading: upvoteLoading }] = useMutation<
    CreateQuoteVoteReturns,
    CreateQuoteVoteVariables
  >(CREATE_QUOTE_VOTE)

  const [deleteUpvote, { loading: deleteUpvoteLoading }] = useMutation<
    DeleteUserQuoteVoteReturns,
    DeleteUserQuoteVoteVariables
  >(DELETE_USER_QUOTE_VOTE)

  return {
    approveQuote,
    approveQuoteLoading,
    invalidateQuote,
    invalidateQuoteLoading,
    deleteQuote,
    deleteQuoteLoading,
    upvote,
    upvoteLoading,
    deleteUpvote,
    deleteUpvoteLoading,
  }
}
