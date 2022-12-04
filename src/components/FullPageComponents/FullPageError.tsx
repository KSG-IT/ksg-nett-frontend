import { Center, Stack, Title } from '@mantine/core'
import { IconAlertTriangle } from '@tabler/icons'

export const FullPageError: React.FC = () => {
  return (
    <Center style={{ width: '100%', height: '100%' }}>
      <Stack align={'center'} spacing={0}>
        <IconAlertTriangle size={200} />
        <Title order={2}>Noe gikk galt</Title>
      </Stack>
    </Center>
  )
}
