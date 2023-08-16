import { Center, Stack, Title } from '@mantine/core'
import { IconHourglassEmpty } from '@tabler/icons-react'

export const FullPageEmpty: React.FC = () => {
  return (
    <Center style={{ width: '100%', height: '100%' }}>
      <Stack align={'center'} spacing={0}>
        <IconHourglassEmpty size={200} />
        <Title order={2}>Oi, her var det tomt.</Title>
      </Stack>
    </Center>
  )
}
