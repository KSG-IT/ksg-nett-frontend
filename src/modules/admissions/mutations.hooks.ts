import { useMutation } from '@apollo/client'
import { gql } from 'graphql-tag'
import { InternalGroupNode } from 'modules/organization/types'
import { DeleteMutationReturns, DeleteMutationVariables } from 'types/graphql'
import { ApplicantStatusValues, InterviewTotalEvaluationValues } from './consts'
import {
  CLOSE_ADMISSION_MUTATION,
  CREATE_APPLICANTS_FROM_CSV_DATA_MUTATION,
  CREATE_APPLICATIONS,
  DELETE_APPLICANT,
  LOCK_ADMISSION_MUTATION,
  PATCH_INTERVIEW_SCHEDULE_TEMPLATE,
  REMOVE_SELF_AS_INTERVIEWER,
  SET_SELF_AS_INTERVIEWER,
  UPLOAD_APPLICANTS_FILE_MUTATION,
} from './mutations'
import {
  ApplicantInterestNode,
  ApplicantNode,
  CreateApplicantsFromCSVDataReturns,
  CreateApplicantsFromCSVDataVariables,
  CreateApplicationsReturns,
  CreateApplicationsVariables,
  PatchApplicantReturns,
  PatchApplicantVariables,
  PatchInterviewScheduleTemplateReturns,
  PatchInterviewScheduleTemplateVariables,
  SetSelfAsInterviewerMutatationReturns,
  SetSelfAsInterviewerMutatationVariables,
} from './types.graphql'

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
    status: ApplicantStatusValues
  }
  notes?: string
  discussion?: string
  totalEvaluation?: InterviewTotalEvaluationValues
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

export const useInterviewMutations = () => {
  const [
    patchInterview,
    { loading: patchInterviewLoading, error: patchInterviewError },
  ] = useMutation<PatchInterviewReturns, PatchInterviewVariables>(
    PATCH_INTERVIEW,
    {
      refetchQueries: ['ApplicantQuery'],
    }
  )

  const [setSelfAsInterviewer] = useMutation<
    SetSelfAsInterviewerMutatationReturns,
    SetSelfAsInterviewerMutatationVariables
  >(SET_SELF_AS_INTERVIEWER)

  const [removeSelfAsInterviewer, { loading: removeSelfLoading }] = useMutation(
    REMOVE_SELF_AS_INTERVIEWER,
    {
      refetchQueries: ['InternalGroupApplicantsDataQuery'],
    }
  )

  return {
    patchInterview,
    patchInterviewLoading,
    patchInterviewError,

    setSelfAsInterviewer,

    removeSelfAsInterviewer,
    removeSelfLoading,
  }
}

export const useInterviewScheduleMutations = () => {
  const [patchInterviewSchedule] = useMutation<
    PatchInterviewScheduleTemplateReturns,
    PatchInterviewScheduleTemplateVariables
  >(PATCH_INTERVIEW_SCHEDULE_TEMPLATE)

  return {
    patchInterviewSchedule,
  }
}

// Refactor into a useApplicantMutation hook
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
    createApplicantInterest(input: $input) {
      applicantInterest {
        id
      }
    }
  }
`

// Refactor into a useApplicantInterestMutation hook
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

// Refactor into a useApplicantInterestMutation hook
export const useDeleteApplicantInterest = () => {
  const [deleteApplicantInterest, { loading, error }] = useMutation<
    DeleteMutationReturns,
    DeleteMutationVariables
  >(DELETE_APPLICANT_INTEREST)

  return { deleteApplicantInterest, loading, error }
}

interface ToggleApplicantWillBeAdmittedMutationReturns {
  toggleApplicantWillBeAdmitted: {
    success: boolean
  }
}

interface ToggleApplicantWillBeAdmittedMutationVariables {
  id: string
}

const TOGGLE_APPLICANT_WILL_BE_ADMITTED_MUTATION = gql`
  mutation ToggleApplicantWillBeAdmittedMutation($id: ID!) {
    toggleApplicantWillBeAdmitted(id: $id) {
      success
    }
  }
`

export const useToggleApplicantWillBeAdmitted = () => {
  const [toggleApplicantWillBeAdmitted, { error, loading }] = useMutation<
    ToggleApplicantWillBeAdmittedMutationReturns,
    ToggleApplicantWillBeAdmittedMutationVariables
  >(TOGGLE_APPLICANT_WILL_BE_ADMITTED_MUTATION)

  return {
    toggleApplicantWillBeAdmitted,
    loading,
    error,
  }
}

const GIVE_APPLICANT_TO_INTERNAL_GROUP_MUTATION = gql`
  mutation GiveApplicantToInternalGroup($applicantInterestId: ID!) {
    giveApplicantToInternalGroup(applicantInterestId: $applicantInterestId) {
      success
    }
  }
`

interface GiveApplicantToInternalGroupMutationReturns {
  success: boolean
}

interface GiveApplicantToInternalGroupMutationVariables {
  applicantInterestId: string
}

export const useGiveApplicantToInternalGroupMutation = () => {
  const [giveApplicantToInternalGroupMutation, { error, loading }] =
    useMutation<
      GiveApplicantToInternalGroupMutationReturns,
      GiveApplicantToInternalGroupMutationVariables
    >(GIVE_APPLICANT_TO_INTERNAL_GROUP_MUTATION)

  return {
    giveApplicantToInternalGroupMutation,
    error,
    loading,
  }
}

const RESET_APPLICANT_INTERNAL_GROUP_POSITION_OFFER = gql`
  mutation ResetApplicantInternalGroupPositionOffer($applicantInterestId: ID!) {
    resetApplicantInternalGroupPositionOffer(
      applicantInterestId: $applicantInterestId
    ) {
      applicantInterest {
        id
        applicant {
          id
          fullName
        }
      }
    }
  }
`

interface ResetApplicantInternalGroupPositionOfferReturns {
  applicantInterest: {
    id: string
    applicant: Pick<ApplicantNode, 'id' | 'fullName'>
  }
}
interface ResetApplicantInternalGroupPositionOfferVariables {
  applicantInterestId: string
}

export const useResetApplicantInternalGroupPositionOffer = () => {
  const [resetApplicantInternalGroupPositionOfferMutation, { loading, error }] =
    useMutation<
      ResetApplicantInternalGroupPositionOfferReturns,
      ResetApplicantInternalGroupPositionOfferVariables
    >(RESET_APPLICANT_INTERNAL_GROUP_POSITION_OFFER)

  return {
    resetApplicantInternalGroupPositionOfferMutation,
    loading,
    error,
  }
}

// === APPLICANT MUTATIONS ===
export const useApplicantMutations = () => {
  const [patchApplicant, { loading: patchApplicantLoading }] = useMutation<
    PatchApplicantReturns,
    PatchApplicantVariables
  >(PATCH_APPLICANT)

  const [deleteApplicant, { loading: deleteApplicantLoading }] = useMutation<
    DeleteMutationReturns,
    DeleteMutationVariables
  >(DELETE_APPLICANT)

  const [createApplicants, { loading: createApplicantsLoading }] = useMutation<
    CreateApplicationsReturns,
    CreateApplicationsVariables
  >(CREATE_APPLICATIONS, { refetchQueries: ['ActiveAdmission'] })

  const [uploadApplicantCSVDataMutation] = useMutation(
    UPLOAD_APPLICANTS_FILE_MUTATION
  )

  const [
    createApplicantsFromCSVDataMutation,
    { loading: createApplicantsFromCSVLoading },
  ] = useMutation<
    CreateApplicantsFromCSVDataReturns,
    CreateApplicantsFromCSVDataVariables
  >(CREATE_APPLICANTS_FROM_CSV_DATA_MUTATION)

  return {
    patchApplicant,
    patchApplicantLoading,
    deleteApplicant,
    deleteApplicantLoading,
    createApplicants,
    createApplicantsLoading,
    uploadApplicantCSVDataMutation,
    createApplicantsFromCSVDataMutation,
    createApplicantsFromCSVLoading,
  }
}

export const useAdmissionMutations = () => {
  const [closeAdmission, { loading: closeAdmissionLoading }] = useMutation(
    CLOSE_ADMISSION_MUTATION
  )
  const [lockAdmission, { loading: lockAdmissionLoading }] = useMutation(
    LOCK_ADMISSION_MUTATION
  )

  return {
    closeAdmission,
    closeAdmissionLoading,
    lockAdmission,
    lockAdmissionLoading,
  }
}
