import { Center, Title } from '@mantine/core'
import { IconSkull } from '@tabler/icons'

export const FullPage404: React.VFC = () => {
  return (
    <Center style={{ width: '100%', height: '100%' }}>
      <IconSkull size={200} />
      <Title order={2}>Denne siden finnes ikke</Title>
    </Center>
  )
}

export default FullPage404
