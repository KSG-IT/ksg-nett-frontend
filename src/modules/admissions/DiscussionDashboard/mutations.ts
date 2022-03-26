import { gql } from 'graphql-tag'

export const PATCH_INTERNAL_GROUP_POSITION_PRIORITY = gql`
  mutation PatchInternalGroupPositionPriority(
    $id: ID!
    $input: PatchInternalGroupPositionPriorityInput!
  ) {
    patchInternalGroupPositionPriority(id: $id, input: $input) {
      internalGroupPositionPriority {
        id
      }
    }
  }
`
