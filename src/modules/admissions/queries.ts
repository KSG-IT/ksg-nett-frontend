import { gql } from 'graphql-tag'

export const ACTIVE_ADMISSION_QUERY = gql`
  query ActiveAdmission {
    activeAdmission {
      id
      applicants {
        id
        email
        status
        fullName
      }
    }
  }
`

export const GET_APPLICATION_FROM_TOKEN = gql`
  query GetApplicantFromToken($token: String!) {
    getApplicantFromToken(token: $token) {
      id
      email
      status
      firstName
      lastName
      image
      phone
      study
      hometown
      address
    }
  }
`
