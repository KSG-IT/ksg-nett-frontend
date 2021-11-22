import { ThemeProvider } from 'styled-components'
import { theme } from 'theme'
import { ApolloProvider } from '@apollo/client/react'
import client from 'apollo-setup'
import Bootstrap from './BootStrap'

function Root() {
  console.log('ENV:', process.env.REACT_APP_NODE_ENV + ' 🚀')
  console.log('URI:', process.env.REACT_APP_API_URL)
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <Bootstrap />
      </ThemeProvider>
    </ApolloProvider>
  )
}

export default Root
