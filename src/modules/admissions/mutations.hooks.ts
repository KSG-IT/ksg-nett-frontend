import { useMutation } from '@apollo/client'
import { gql } from 'graphql-tag'
import { InternalGroupNode } from 'modules/organization/types'
import { DeleteMutationReturns, DeleteMutationVariables } from 'types/graphql'
import { ApplicantInterestNode, ApplicantNode, ApplicantStatus } from './types'

const PATCH_APPLICANT = gql`
  mutation PatchApplicant($id: ID!, $input: PatchApplicantInput!) {
    patchApplicant(id: $id, input: $input) {
      applicant {
        id
      }
    }
  }
`

const PATCH_INTERVIEW = gql`
  mutation PatchInterview($id: ID!, $input: PatchInterviewInput!) {
    patchInterview(id: $id, input: $input) {
      interview {
        id
      }
    }
  }
`

type PatchInterviewInput = {
  applicant?: {
    status: ApplicantStatus
  }
  notes?: string
  discussion?: string
  totalEvaluation?: 'VERY_GOOD' | 'GOOD' | 'MEDIUM' | 'POOR' | 'VERY_POOR'
}

interface PatchInterviewVariables {
  id: string
  input: PatchInterviewInput
}

interface PatchInterviewReturns {
  patchInterview: {
    id: string
  }
}

export const usePatchInterview = () => {
  const [patchInterview, { loading, error }] = useMutation<
    PatchInterviewReturns,
    PatchInterviewVariables
  >(PATCH_INTERVIEW, {
    refetchQueries: ['ApplicantQuery'],
  })

  return {
    patchInterview: patchInterview,
    loading: loading,
    error: error,
  }
}

type PatchApplicantInput = {
  status?: ApplicantStatus
  canCommitThreeSemesters?: boolean | null
  openForOtherPositions?: boolean | null
}

interface PatchApplicantVariables {
  id: string
  input: PatchApplicantInput
}
interface PatchApplicantReturns {
  applicant: {
    id: string
  }
}

export const usePatchApplicant = () => {
  const [patchApplicant, { loading, error }] = useMutation<
    PatchApplicantReturns,
    PatchApplicantVariables
  >(PATCH_APPLICANT, {
    refetchQueries: ['ApplicantQuery'],
  })

  return {
    patchApplicant: patchApplicant,
    loading: loading,
  }
}

interface CreateApplicantInterestReturns {
  applicantInterst: ApplicantInterestNode
}

type CreateApplicantInterestInput = {
  applicant: ApplicantNode | string
  internalGroup: InternalGroupNode | string
}

interface CreateApplicantInterestVariables {
  input: CreateApplicantInterestInput
}

const CREATE_APPLICANT_INTEREST = gql`
  mutation CreateApplicantInterest($input: CreateApplicantInterestInput!) {
    createApplicantInput(input: $input) {
      applicantInterest {
        id
      }
    }
  }
`

export const useCreateApplicantInterest = () => {
  const [createApplicantInterest, { loading, error }] = useMutation<
    CreateApplicantInterestReturns,
    CreateApplicantInterestVariables
  >(CREATE_APPLICANT_INTEREST)

  return {
    createApplicantInterest,
    loading,
    error,
  }
}

const DELETE_APPLICANT_INTEREST = gql`
  mutation DeleteApplicantInterrest($id: ID!) {
    deleteApplicantInterest(id: $id) {
      found
    }
  }
`

export const useDeleteApplicantInterest = () => {
  const [deleteApplicantInterest, { loading, error }] = useMutation<
    DeleteMutationReturns,
    DeleteMutationVariables
  >(DELETE_APPLICANT_INTEREST)

  return { deleteApplicantInterest, loading, error }
}
