import gql from 'graphql-tag'

export const ME_QUERY = gql`
  query Me {
    me {
      username
      firstName
      lastName
    }
  }
`