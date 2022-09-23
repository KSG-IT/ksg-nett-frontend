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
        fullName
        initials
        email
        balance
        biography
        studyAddress
        homeAddress
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
