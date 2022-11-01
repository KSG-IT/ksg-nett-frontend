import gql from 'graphql-tag'

export const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ok
      token
      user {
        id
        username
        firstName
        lastName
        profileImage
        initials
        email
        balance
        biography
        homeTown
        studyAddress
        phone
        upvotedQuoteIds
        lastTransactions {
          name
          amount
          quantity
          timestamp
        }
        isSuperuser
        allPermissions
      }
    }
  }
`

export const RESET_My_PASSWORD_MUTATION = gql`
  mutation ResetMyPasswordMutation($username: String!) {
    resetMyPassword(username: $username) {
      ok
    }
  }
`

export const RESET_PASSWORD_BY_TOKEN_MUTATION = gql`
  mutation ResetPasswordByTokenMutation(
    $newPassword: String!
    $token: String!
  ) {
    resetPasswordByToken(token: $token, newPassword: $newPassword) {
      ok
      loginToken
    }
  }
`
