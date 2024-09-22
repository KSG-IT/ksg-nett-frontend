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

export const UPDATE_ABOUT_ME_MUTATION = gql`
  mutation UpdateAboutMe($aboutMe: String) {
    updateAboutMe(aboutMe: $aboutMe) {
      user {
        id
      }
    }
  }
`

export const UPDATE_MY_ALLERGIES_MUTATION = gql`
  mutation UpdateMyAllergies($allergyIds: [ID!]) {
    updateMyAllergies(allergyIds: $allergyIds) {
      user {
        id
      }
    }
  }
`

export const UPDATE_MY_EMAIL_NOTIFICATIONS_MUTATION = gql`
  mutation UpdateMyEmailNotifications(
    $notifyOnDeposit: Boolean!
    $notifyOnQuote: Boolean!
    $notifyOnShift: Boolean!
  ) {
    updateMyEmailNotifications(
      notifyOnDeposit: $notifyOnDeposit
      notifyOnQuote: $notifyOnQuote
      notifyOnShift: $notifyOnShift
    ) {
      user {
        id
      }
    }
  }
`

export const UPDATE_MY_ADDRESS_MUTATION = gql`
  mutation UpdateMyAddress($studyAddress: String) {
    updateMyAddress(studyAddress: $studyAddress) {
      user {
        id
      }
    }
  }
`
export const INVITE_NEW_USER_MUTATION = gql`
  mutation InviteNewUserMutation(
    $email: String!
    $firstName: String!
    $lastName: String!
    $sendWelcomeEmail: Boolean!
  ) {
    inviteNewUser(
      email: $email
      firstName: $firstName
      lastName: $lastName
      sendWelcomeEmail: $sendWelcomeEmail
    ) {
      user {
        email
        firstName
        lastName
      }
    }
  }
`
