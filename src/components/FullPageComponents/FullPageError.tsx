import { useApolloClient } from '@apollo/client'
import { Button, Center, Stack, Title } from '@mantine/core'
import { IconAlertTriangle, IconRefresh } from '@tabler/icons-react'
import { useState } from 'react'

interface ErrorFallbackProps {
  error?: Error
}

export const FullPageError: React.FC<ErrorFallbackProps> = ({ error }) => {
  const client = useApolloClient()
  const [retrying, setRetrying] = useState(false)

  // Runs the queries on this page again, so the user does not have to leave
  // the page or restart the installed app.
  async function handleRetry() {
    setRetrying(true)
    try {
      await client.refetchQueries({ include: 'active' })
    } catch (retryError) {
      console.log(retryError)
    } finally {
      setRetrying(false)
    }
  }

  return (
    <Center style={{ width: '100%', height: '100%' }}>
      <Stack align={'center'} gap={0}>
        <IconAlertTriangle size={200} />
        <Title order={2}>Noe gikk galt</Title>
        {error && <p>{error.message}</p>}
        <Button
          mt="md"
          leftSection={<IconRefresh size={18} />}
          loading={retrying}
          onClick={handleRetry}
        >
          Prøv igjen
        </Button>
      </Stack>
    </Center>
  )
}
