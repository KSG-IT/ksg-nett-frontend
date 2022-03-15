import { gql } from 'graphql-tag'

export const PATCH_INTERNAL_GROUP = gql`
  mutation PatchInternalGroup($id: ID!, $input: PatchInternalGroupInput!) {
    patchInternalGroup(id: $id, input: $input) {
      internalGroup {
        id
      }
    }
  }
`
