import { Text } from '@mantine/core'
import { format } from 'util/date-fns'
import { useNow } from 'util/hooks'
import { updatedAgo } from './updatedAgo'

interface LastUpdatedProps {
  updatedAt: Date
}

// The clock ticks here, so only this label re-renders every second.
export const LastUpdated: React.FC<LastUpdatedProps> = ({ updatedAt }) => {
  const now = useNow(1000)

  return (
    <Text size="xs" c="dimmed" title={format(updatedAt, 'HH:mm:ss')}>
      Sist oppdatert {updatedAgo(updatedAt, now)}
    </Text>
  )
}
