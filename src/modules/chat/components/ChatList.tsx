import { useQuery } from '@apollo/client'
import { Stack, Text } from '@mantine/core'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { useVisiblePolling } from 'util/hooks/useVisiblePolling'
import { ALL_CHATS_QUERY, MY_CHATS_QUERY } from '../queries'
import { AllChatsReturns, MyChatsReturns } from '../types.graphql'
import { ChatListItem } from './ChatListItem'

const LIST_POLL_MS = 10_000

interface ChatListProps {
  activeChatId: string | undefined
  showAll: boolean
}

// Only a superuser can show all chats. Both lists come sorted by the newest
// message.
export const ChatList: React.FC<ChatListProps> = ({
  activeChatId,
  showAll,
}) => {
  const query = useQuery<MyChatsReturns & AllChatsReturns>(
    showAll ? ALL_CHATS_QUERY : MY_CHATS_QUERY
  )
  useVisiblePolling(query, LIST_POLL_MS)

  const { data, previousData, error } = query
  const chats = (data ?? previousData)?.[showAll ? 'allChats' : 'myChats']

  if (error) return <FullPageError />
  if (!chats) return <FullContentLoader />
  if (chats.length === 0) {
    return (
      <Text c="dimmed" p="md">
        Du er ikke med i noen chatter ennå.
      </Text>
    )
  }

  return (
    <Stack gap={2}>
      {chats.map(chat => (
        <ChatListItem
          key={chat.id}
          chat={chat}
          active={chat.id === activeChatId}
        />
      ))}
    </Stack>
  )
}
