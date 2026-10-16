import { useQuery } from '@apollo/client'
import { Anchor, Stack } from '@mantine/core'
import { Link } from 'react-router-dom'
import { useVisiblePolling } from 'util/hooks/useVisiblePolling'
import { useChatEnabled } from '../hooks/useChatEnabled'
import { JOINABLE_SHIFT_CHATS_QUERY } from '../queries'
import { JoinableShiftChatsReturns } from '../types.graphql'
import { ShiftChatRow } from './ShiftChatRow'

const JOINABLE_POLL_MS = 60_000

interface JoinableShiftChatsProps {
  // Show at most this many rows and link to the rest. All rows when empty.
  maxRows?: number
}

// Shows while the join window of a shift is open: from one hour before the
// shift to one hour after it. One slim row per shift, in the order the shifts
// start. Renders nothing otherwise.
export const JoinableShiftChats: React.FC<JoinableShiftChatsProps> = ({
  maxRows,
}) => {
  const enabled = useChatEnabled()
  if (!enabled) return null
  return <JoinableShiftChatRows maxRows={maxRows} />
}

const JoinableShiftChatRows: React.FC<JoinableShiftChatsProps> = ({
  maxRows,
}) => {
  const query = useQuery<JoinableShiftChatsReturns>(JOINABLE_SHIFT_CHATS_QUERY)
  useVisiblePolling(query, JOINABLE_POLL_MS)
  const joinable = query.data?.joinableShiftChats ?? []

  const shown = maxRows === undefined ? joinable : joinable.slice(0, maxRows)
  const hidden = joinable.length - shown.length
  if (shown.length === 0) return null

  return (
    <Stack gap="xs">
      {shown.map(item => (
        <ShiftChatRow key={item.shift.id} item={item} />
      ))}
      {hidden > 0 && (
        <Anchor component={Link} to="/schedules/me" size="sm" fw={600}>
          +{hidden} til · Se alle vakter
        </Anchor>
      )}
    </Stack>
  )
}
