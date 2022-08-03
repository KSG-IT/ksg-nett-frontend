import { ApolloProvider } from '@apollo/client/react'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import client from 'apollo-setup'
import { ThemeProvider } from 'styled-components'
import { theme } from 'theme'
import Bootstrap from './BootStrap'

library.add(fas)

function Root() {
  console.log(import.meta.env)

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <Bootstrap />
      </ThemeProvider>
    </ApolloProvider>
  )
}

export default Root
