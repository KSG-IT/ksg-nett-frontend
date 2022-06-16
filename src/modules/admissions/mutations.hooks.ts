import { useMutation } from '@apollo/client'
import { gql } from 'graphql-tag'
import { ApplicantStatus } from './types'

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
