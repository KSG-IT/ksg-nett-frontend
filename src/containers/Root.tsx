import { ThemeProvider } from 'styled-components'
import { theme } from 'theme'
import { ApolloProvider } from '@apollo/client/react'
import client from 'apollo-setup'
import Bootstrap from './BootStrap'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'

library.add(fas)

function Root() {
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
