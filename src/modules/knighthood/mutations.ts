import { gql } from '@apollo/client'

export const ADD_USER_TO_KNIGHTHOOD_MUTATION = gql`
  mutation KnightUser($userId: ID!, $knightedDate: Date) {
    knightUser(userId: $userId, knightedDate: $knightedDate) {
      user {
        id
      }
    }
  }
`
