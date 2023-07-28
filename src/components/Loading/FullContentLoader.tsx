import { Center, Loader } from '@mantine/core'

export const FullContentLoader: React.FC = () => {
  return (
    <Center style={{ height: '100%', width: '100%' }}>
      <Loader size="lg" color="samfundet-red" />
    </Center>
  )
}
