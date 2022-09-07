import { ApolloProvider } from '@apollo/client/react'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { MantineProvider } from '@mantine/core'
import client from 'apollo-setup'
import { ThemeProvider } from 'styled-components'
import { theme } from 'theme'
import Bootstrap from './BootStrap'

library.add(fas)

function Root() {
  return (
    <ApolloProvider client={client}>
      <MantineProvider>
        <ThemeProvider theme={theme}>
          <Bootstrap />
        </ThemeProvider>
      </MantineProvider>
    </ApolloProvider>
  )
}

export default Root
