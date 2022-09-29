import { gql } from '@apollo/client'

export const PATCH_USER_MUTATION = gql`
  mutation PatchUser($id: ID!, $input: PatchUserInput!) {
    patchUser(id: $id, input: $input) {
      user {
        id
      }
    }
  }
`
