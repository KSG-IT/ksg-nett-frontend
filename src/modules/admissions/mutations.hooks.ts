import { useMutation } from '@apollo/client'
import { PATCH_APPLICANT, PATCH_INTERVIEW } from './mutations'
import { ApplicantStatus } from './types'

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

interface PatchApplicantVariables {
  id: string
  input: {
    status?: ApplicantStatus
    canCommitThreeSemesters?: boolean | null
    openForOtherPositions?: boolean | null
  }
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
  }
}
