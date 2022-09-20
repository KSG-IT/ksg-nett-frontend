import { ApolloProvider } from '@apollo/client/react'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { MantineProvider, MantineThemeOverride } from '@mantine/core'
import client from 'apollo-setup'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from 'routes'
import { ThemeProvider } from 'styled-components'
import { theme } from 'theme'

library.add(fas)

// TODO: Move this
const mtheme: MantineThemeOverride = {
  colors: { white: ['#fff'], brand: ['#A03033'] },
}

function Root() {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <MantineProvider theme={mtheme}>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
          <Toaster />
        </MantineProvider>
      </ThemeProvider>
    </ApolloProvider>
  )
}

export default Root
