import { gql } from 'graphql-tag'

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
