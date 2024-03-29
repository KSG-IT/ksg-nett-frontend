import { gql } from '@apollo/client'

export const CREATE_QUOTE = gql`
  mutation CreateQuote($input: CreateQuoteInput!) {
    createQuote(input: $input) {
      quote {
        id
      }
    }
  }
`

export const APPROVE_QUOTE_MUTATION = gql`
  mutation ApproveQuote($quoteId: ID!) {
    approveQuote(quoteId: $quoteId) {
      quote {
        id
      }
    }
  }
`

export const INVALIDATE_QUOTE_MUTATION = gql`
  mutation InvalidateQuote($quoteId: ID!) {
    invalidateQuote(quoteId: $quoteId) {
      quote {
        id
      }
    }
  }
`

export const DELETE_USER_QUOTE_VOTE = gql`
  mutation DeleteUserQuoteVote($quoteId: ID!) {
    deleteUserQuoteVote(quoteId: $quoteId) {
      found
      quoteSum
    }
  }
`

export const PATCH_QUOTE = gql`
  mutation PatchQuote($id: ID!, $input: PatchQuoteInput!) {
    patchQuote(id: $id, input: $input) {
      quote {
        id
        __typename
        text
        context
        createdAt
        verifiedBy {
          id
        }
        reportedBy {
          id
        }
        tagged {
          id
          initials
          profileImage
        }
      }
    }
  }
`

export const DELETE_QUOTE = gql`
  mutation DeleteQuote($id: ID!) {
    deleteQuote(id: $id) {
      found
    }
  }
`

export const CREATE_QUOTE_VOTE = gql`
  mutation CreateQuoteVote($input: CreateQuoteVoteInput!) {
    createQuoteVote(input: $input) {
      quoteVote {
        id
        quote {
          id
          sum
        }
      }
    }
  }
`
