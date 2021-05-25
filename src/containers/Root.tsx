import { ThemeProvider } from 'styled-components'
import {theme} from 'theme'
import MainLayout from './MainLayout'
import { ApolloProvider } from '@apollo/client/react'
import client from 'apollo-setup'

function Root() {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <MainLayout />
      </ThemeProvider>
    </ApolloProvider>
  )
}

export default Root
