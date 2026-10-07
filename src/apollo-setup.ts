import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { createUploadLink } from 'apollo-upload-client'
import * as Sentry from '@sentry/react'
import {
  getLoginToken,
  hasSavedLoginToken,
  isNotLoggedInError,
  removeLoginToken,
} from 'util/auth'
import { API_URL } from 'util/env'
import { createQueryRetryLink } from 'util/retryLink'

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
  // The token expired while the app was open. Log out and show the login page.
  if (hasSavedLoginToken() && isNotLoggedInError(graphQLErrors)) {
    removeLoginToken()
    Sentry.setUser(null)
    window.location.assign('/login')
    return
  }

  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    )
  if (networkError) console.log(`[Network error]: ${networkError}`)
})

const retryLink = createQueryRetryLink()

const uploadLink = createUploadLink({
  uri: API_URL + '/graphql/',
})

const client = new ApolloClient({
  link: ApolloLink.from([
    authLink,
    errorLink,
    languageLink,
    retryLink,
    //@ts-ignore
    uploadLink,
  ]),
  cache: new InMemoryCache(),
})

export default client
