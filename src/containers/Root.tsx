import { ThemeProvider } from 'styled-components'
import { theme } from 'theme'
import { ApolloProvider } from '@apollo/client/react'
import client from 'apollo-setup'
import Bootstrap from './BootStrap'

function Root() {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <Bootstrap />
      </ThemeProvider>
    </ApolloProvider>
  )
}

export default Root
