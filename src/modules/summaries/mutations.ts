import { gql, useMutation } from '@apollo/client'
import { PatchSummaryInput, SummaryNode } from './types'

export const PATCH_SUMMARY = gql`
  mutation PatchSummary($id: ID!, $input: PatchSummaryInput!) {
    patchSummary(id: $id, input: $input) {
      summary {
        id
      }
    }
  }
`

export const CREATE_SUMMARY = gql`
  mutation CreateSumary($input: CreateSummaryInput!) {
    createSummary(input: $input) {
      summary {
        id
      }
    }
  }
`

interface PatchSummaryReturns {
  summary: Pick<SummaryNode, 'id'>
}

interface PatchSummaryVariables {
  id: string
  input: PatchSummaryInput
}

export function usePatchSummaryMutations() {
  const [patchSummary, { loading, error }] = useMutation<
    PatchSummaryReturns,
    PatchSummaryVariables
  >(PATCH_SUMMARY)

  return {
    patchSummary,
    loading,
    error,
  }
}
