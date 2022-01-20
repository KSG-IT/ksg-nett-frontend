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

export const CREATE_QUOTE_VOTE = gql`
  mutation CreateQuoteVote($input: CreateQuoteVoteInput!) {
    createQuoteVote(input: $input) {
      quoteVote {
        id
      }
    }
  }
`

export const DELETE_QUOTE_VOTE = gql`
  mutation DeleteQUoteVote($id: ID!) {
    deleteQuoteVote(id: $id) {
      quoteVote {
        found
      }
    }
  }
`
