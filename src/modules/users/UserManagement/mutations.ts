import { gql } from 'graphql-tag'

export const ASSIGN_NEW_INTERNAL_GROUP_POSITION_MEMBERSHIP = gql`
  mutation AssignNewInternalGroupPositionMembership(
    $userId: ID!
    $internalGroupPositionId: ID!
    $internalGroupPositionType: InternalGroupPositionTypeEnum
  ) {
    assignNewInternalGroupPositionMembership(
      userId: $userId
      internalGroupPositionId: $internalGroupPositionId
      internalGroupPositionType: $internalGroupPositionType
    ) {
      internalGroupPositionMembership {
        id
      }
    }
  }
`
