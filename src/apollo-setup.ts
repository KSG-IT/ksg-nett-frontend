import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { createUploadLink } from 'apollo-upload-client'
import { getLoginToken } from 'util/auth'
import { API_URL } from 'util/env'

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = getLoginToken()
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})
const languageLink = setContext((_, { headers }) => {
  const lang = '' // Can read this from localstorage when we implement some translation provider

  return {
    headers: {
      ...headers,
      'Accept-Language': lang ? lang : '',
    },
  }
})

// Log any GraphQL errors or network error that occurred
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    )
  if (networkError) console.log(`[Network error]: ${networkError}`)
})

const uploadLink = createUploadLink({
  uri: 'https://ksg-nett.no.samfundet.no/graphql/', //API_URL + '/graphql/',
})

const client = new ApolloClient({
  link: ApolloLink.from([
    authLink,
    errorLink,
    languageLink,
    //@ts-ignore
    uploadLink,
  ]),
  cache: new InMemoryCache(),
})

export default client
