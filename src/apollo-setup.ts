import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client'
import { createUploadLink } from 'apollo-upload-client'
import { onError } from '@apollo/client/link/error'
import { setContext } from '@apollo/client/link/context'
import { getLoginToken } from 'util/auth'
import { API_URL } from 'util/env'

const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = getLoginToken()
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      }
    }
  })
  
// Log any GraphQL errors or network error that occurred
const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.map(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );
    if (networkError) console.log(`[Network error]: ${networkError}`);
  });
  
  const uploadLink = createUploadLink({
    uri: API_URL + "/graphql"
  })
  
  
  const client = new ApolloClient({
    link: ApolloLink.from([
      errorLink,
      authLink.concat(uploadLink)
    ]),
    cache: new InMemoryCache()
  })
  
  export default client
  