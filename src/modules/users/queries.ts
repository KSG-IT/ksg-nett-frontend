import gql from 'graphql-tag'

export const ME_QUERY = gql`
  query Me {
    me {
      id
      username
      firstName
      lastName
      profilePicture
      fullName
      initials
      email
      balance
      biography
      studyAddress
      homeAddress
      phone
      lastTransactions {
        # Is this an issue if we cache the activity?
        # This will become large at some point
        name
        amount
        quantity
        timestamp
      }
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
