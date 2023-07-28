import { ApolloProvider } from '@apollo/client/react'
import { MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { Notifications } from '@mantine/notifications'
import client from 'apollo-setup'
import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from 'routes'
import { theme } from 'theme'

function Root() {
  return (
    <ApolloProvider client={client}>
      <MantineProvider theme={theme}>
        <ModalsProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ModalsProvider>
        <Notifications />
      </MantineProvider>
    </ApolloProvider>
  )
}

export default Root
