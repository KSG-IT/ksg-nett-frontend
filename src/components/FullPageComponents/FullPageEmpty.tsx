import { Center } from '@mantine/core'
import { IconHourglassEmpty } from '@tabler/icons'

export const FullPageEmpty: React.VFC = () => {
  return (
    <Center style={{ width: '100%', height: '100%' }}>
      <IconHourglassEmpty size={200} />
      Oi, her var det tomt.
    </Center>
  )
}
