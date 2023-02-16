import { Center, Loader, useMantineTheme } from '@mantine/core'

export const FullContentLoader: React.FC = () => {
  const theme = useMantineTheme()
  return (
    <Center style={{ height: '100%', width: '100%' }}>
      <Loader size="lg" />
    </Center>
  )
}
