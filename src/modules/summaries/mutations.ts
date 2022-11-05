import { gql, useMutation } from '@apollo/client'
import {
  CreateSummaryMutationReturns,
  PatchSummaryInput,
  SummaryNode,
} from './types'

export const PATCH_SUMMARY = gql`
  mutation PatchSummary($id: ID!, $input: PatchSummaryInput!) {
    patchSummary(id: $id, input: $input) {
      summary {
        id
      }
    }
  }
`

export const CREATE_SUMMARY_MUTATION = gql`
  mutation CreateSumary($input: CreateSummaryInput!) {
    createSummary(input: $input) {
      summary {
        id
      }
    }
  }
`

export interface PatchSummaryReturns {
  patchSummary: { summary: Pick<SummaryNode, 'id'> }
}

interface PatchSummaryVariables {
  id: string
  input: PatchSummaryInput
}

export interface CreateSummaryReturns {
  createSummary: { summary: Pick<SummaryNode, 'id'> }
}

export function usePatchSummaryMutations() {
  const [patchSummary, { loading, error }] = useMutation<
    PatchSummaryReturns,
    PatchSummaryVariables
  >(PATCH_SUMMARY)

  const [createSummary, { loading: createSummaryLoading }] =
    useMutation<CreateSummaryReturns>(CREATE_SUMMARY_MUTATION)

  return {
    patchSummary,
    loading,
    error,
    createSummary,
    createSummaryLoading,
  }
}
