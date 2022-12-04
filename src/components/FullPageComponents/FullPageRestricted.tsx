import { Center, Stack, Text, Title } from '@mantine/core'
import { IconAlertTriangle } from '@tabler/icons'

export const FullPageRestricted: React.FC = () => {
  return (
    <Center style={{ width: '100%', height: '100%' }}>
      <Stack align={'center'}>
        <IconAlertTriangle size={200} />
        <Title order={2}>Du har ikke tilgang til denne ressursen.</Title>

        <Text>Om dette er feil ta kontakt med en administrator</Text>
      </Stack>
    </Center>
  )
}
