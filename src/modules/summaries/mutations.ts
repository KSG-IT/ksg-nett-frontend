import { gql } from '@apollo/client'

export const PATCH_SUMMARY = gql`
  mutation PatchSummary($id: ID!, $input: PatchSummaryInput!) {
    patchSummary(id: $id, input: $input) {
      summary {
        id
      }
    }
  }
`
