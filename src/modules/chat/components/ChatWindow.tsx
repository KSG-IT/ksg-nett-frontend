import { useQuery } from '@apollo/client'
import { Text } from '@mantine/core'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { MessageBox } from 'components/MessageBox'
import { useMe } from 'util/hooks'
import { useVisiblePolling } from 'util/hooks/useVisiblePolling'
import { useChatMessages } from '../hooks/useChatMessages'
import { useChatPresence } from '../hooks/useChatPresence'
import { useSendChatMessage } from '../hooks/useSendChatMessage'
import { CHAT_QUERY } from '../queries'
import { ChatReturns, ChatVariables } from '../types.graphql'
import classes from './ChatWindow.module.css'
import { ChatHeader } from './ChatHeader'
import { MessageComposer } from './MessageComposer'
import { MessageList } from './MessageList'

const CHAT_POLL_MS = 5_000

interface ChatWindowProps {
  chatId: string
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ chatId }) => {
  const me = useMe()
  const chatQuery = useQuery<ChatReturns, ChatVariables>(CHAT_QUERY, {
    variables: { chatId },
  })
  useVisiblePolling(chatQuery, CHAT_POLL_MS)
  const { messages, loading, error } = useChatMessages(chatId)
  const { pending, send } = useSendChatMessage(chatId)

  const chat = chatQuery.data?.chat
  const isMember =
    chat?.members.some(member => member.user.id === me.id) ?? false
  useChatPresence(chatId, isMember, messages[messages.length - 1]?.id)

  if (chatQuery.error || error) return <FullPageError />
  if (!chat || loading) return <FullContentLoader />

  return (
    <div className={classes.window}>
      <ChatHeader chat={chat} />
      {!isMember && (
        <MessageBox type="info">
          Du leser som superbruker og er ikke medlem. Medlemmene ser ikke at du
          leser.
        </MessageBox>
      )}
      <MessageList
        messages={messages}
        pending={pending}
        members={chat.members}
        meId={me.id}
      />
      <ChatFooter
        canWrite={isMember && !chat.closed}
        closed={chat.closed}
        onSend={send}
      />
    </div>
  )
}

interface ChatFooterProps {
  canWrite: boolean
  closed: boolean
  onSend: (body: string) => Promise<void>
}

const ChatFooter: React.FC<ChatFooterProps> = ({
  canWrite,
  closed,
  onSend,
}) => {
  if (canWrite) return <MessageComposer onSend={onSend} />
  return (
    <Text c="dimmed" p="md" className={classes.footer}>
      {closed ? 'Chatten er stengt.' : 'Bare medlemmer kan skrive i chatten.'}
    </Text>
  )
}
