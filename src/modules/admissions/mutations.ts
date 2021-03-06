import { gql } from 'graphql-tag'

export const CREATE_ADMISSION = gql`
  mutation CreateAdmission($input: CreateAdmissionInput!) {
    createAdmission(input: $input) {
      admission {
        id
      }
    }
  }
`

export const PATCH_ADMISSION = gql`
  mutation PatchAdmission($id: ID!, $input: PatchAdmissionInput!) {
    patchAdmission(id: $id, input: $input) {
      admission {
        id
      }
    }
  }
`

export const CREATE_APPLICATIONS = gql`
  mutation CreateApplications($emails: [String]) {
    createApplications(emails: $emails) {
      ok
      applicationsCreated
    }
  }
`

export const RE_SEND_APPLICATION_TOKEN = gql`
  mutation ReSendApplicationToken($email: String!) {
    reSendApplicationToken(email: $email) {
      ok
    }
  }
`

export const PATCH_APPLICANT = gql`
  mutation patchApplicant($id: ID!, $input: PatchApplicantInput!) {
    patchApplicant(id: $id, input: $input) {
      applicant {
        id
      }
    }
  }
`

export const PATCH_INTERVIEW = gql`
  mutation PatchInterview($id: ID!, $input: PatchInterviewInput!) {
    patchInterview(id: $id, input: $input) {
      interview {
        id
      }
    }
  }
`
