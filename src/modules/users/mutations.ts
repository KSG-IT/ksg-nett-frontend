import { gql } from '@apollo/client'

export const PATCH_USER_MUTATION = gql`
  mutation PatchUser($id: ID!, $input: PatchUserInput!) {
    patchUser(id: $id, input: $input) {
      user {
        id
      }
    }
  }
`

export const UPDATE_MY_INFO_MUTATION = gql`
  mutation UpdateMyInfo(
    $firstName: String
    $nickname: String
    $lastName: String
    $email: String
    $phone: String
    $study: String
    $studyAddress: String
    $homeTown: String
    $dateOfBirth: Date
  ) {
    updateMyInfo(
      firstName: $firstName
      nickname: $nickname
      lastName: $lastName
      email: $email
      phone: $phone
      study: $study
      studyAddress: $studyAddress
      homeTown: $homeTown
      dateOfBirth: $dateOfBirth
    ) {
      user {
        id
      }
    }
  }
`
