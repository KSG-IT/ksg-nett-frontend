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

export const ADD_USER_TO_USER_TYPE_MUTATION = gql`
  mutation AddUserToUserType($userTypeId: ID!, $userId: ID!) {
    addUserToUserType(userTypeId: $userTypeId, userId: $userId) {
      user {
        id
      }
    }
  }
`

export const REMOVE_USER_FROM_USER_TYPE_MUTATION = gql`
  mutation RemoveUserFromUserType($userTypeId: ID!, $userId: ID!) {
    removeUserFromUserType(userTypeId: $userTypeId, userId: $userId) {
      user {
        id
      }
    }
  }
`
