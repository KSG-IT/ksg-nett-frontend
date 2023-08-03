import { Center, Stack, Title } from '@mantine/core'
import { IconSkull } from '@tabler/icons-react'

export const FullPage404: React.FC = () => {
  return (
    <Center style={{ width: '100%', height: '100%' }}>
      <Stack align={'center'} spacing={0}>
        <IconSkull size={200} />
        <Title order={2}>Denne siden finnes ikke</Title>
      </Stack>
    </Center>
  )
}

export default FullPage404
