import { gql } from '@apollo/client'

export const ADD_USER_TO_KNIGHTHOOD_MUTATION = gql`
  mutation KnightUser($userId: ID!, $knightedAt: Date) {
    knightUser(userId: $userId, knightedAt: $knightedAt) {
      user {
        id
      }
    }
  }
`
