import { ApolloProvider } from '@apollo/client/react'
import { MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { Notifications } from '@mantine/notifications'
import client from 'apollo-setup'
import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from 'routes'
import { theme } from 'theme'
import { emotionTransform, MantineEmotionProvider } from '@mantine/emotion'

function Root() {
  return (
    <ApolloProvider client={client}>
      <MantineProvider theme={theme} stylesTransform={emotionTransform}>
        <MantineEmotionProvider>
          <ModalsProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </ModalsProvider>
          <Notifications />
        </MantineEmotionProvider>
      </MantineProvider>
    </ApolloProvider>
  )
}

export default Root
