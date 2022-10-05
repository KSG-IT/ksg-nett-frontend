import { ApolloProvider } from '@apollo/client/react'
import { MantineProvider, MantineThemeOverride } from '@mantine/core'
import client from 'apollo-setup'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from 'routes'
import { ThemeProvider } from 'styled-components'
import { theme } from 'theme'

// TODO: Move this
const mtheme: MantineThemeOverride = {
  colors: {
    white: ['#fff'],
    brand: ['#A03033'],
    'samfundet-red': [
      '#ffe7ea',
      '#f2c2c3',
      '#e49c9e',
      '#d77578',
      '#ca4e52',
      '#b13538',
      '#8a282c',
      '#641b1e',
      '#3e0f11',
      '#1d0202',
    ],
  },
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
