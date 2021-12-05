import gql from 'graphql-tag'

export const IS_LOGGED_IN_QUERY = gql`
  query IsLoggedIn {
    isLoggedIn
  }
`
