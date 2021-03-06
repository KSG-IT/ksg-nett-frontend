import { gql } from 'graphql-tag'

export const TOGGLE_APPLICANT_WILL_BE_ADMITTED_MUTATION = gql`
  mutation ToggleApplicantWillBeAdmittedMutation($id: ID!) {
    toggleApplicantWillBeAdmitted(id: $id) {
      success
    }
  }
`

export const CLOSE_ADMISSION_MUTATION = gql`
  mutation CloseAdmissionMutation {
    closeAdmission {
      failedUserGeneration {
        id
        fullName
      }
    }
  }
`

export const LOCK_ADMISSION_MUTATION = gql`
  mutation LockAdmissionMutation {
    lockAdmission {
      admission {
        id
      }
    }
  }
`
