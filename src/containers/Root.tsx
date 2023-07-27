import { ApolloProvider } from '@apollo/client/react'
import { MantineProvider, MantineThemeOverride } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { Notifications } from '@mantine/notifications'
import client from 'apollo-setup'
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
      '#A03033',
      '#641b1e',
      '#3e0f11',
      '#1d0202',
    ],
  },
  primaryColor: 'samfundet-red',
  fontFamily: '"Inter"',
}

function Root() {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <MantineProvider theme={mtheme}>
          <ModalsProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </ModalsProvider>
          <Notifications />
        </MantineProvider>
      </ThemeProvider>
    </ApolloProvider>
  )
}

export default Root
