import gql from 'graphql-tag'

export const ME_QUERY = gql`
  query Me {
    me {
      id
      username
      firstName
      lastName
      profilePicture
      initials
      email
      balance
      biography
      studyAddress
      homeAddress
      phone
    }
  }
`

export const USER_QUERY = gql`
  query User($id: ID!) {
    user(id: $id) {
      fullName
      biography
      homeAddress
      studyAddress
      phone
      initials
      profilePicture
    }
  }
`