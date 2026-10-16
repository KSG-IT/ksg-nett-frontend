import { Button, Text, ThemeIcon } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconMessages } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import { format } from 'util/date-fns'
import { useChatMutations } from '../mutations.hooks'
import { JoinableShiftChat } from '../types.graphql'
import classes from './ShiftChatRow.module.css'
import { UnreadBadge } from './UnreadBadge'

interface ShiftChatRowProps {
  item: JoinableShiftChat
}

// One slim row: the shift, and a button to join its chat or open it.
export const ShiftChatRow: React.FC<ShiftChatRowProps> = ({ item }) => {
  const navigate = useNavigate()
  const { joinShiftChat, joinShiftChatLoading } = useChatMutations()
  const { shift, chat } = item

  async function handleJoin() {
    try {
      const { data } = await joinShiftChat({
        variables: { shiftId: shift.id },
        refetchQueries: ['JoinableShiftChats', 'MyChats', 'UnreadChatCount'],
      })
      if (data) navigate(`/chat/${data.joinShiftChat.chat.id}`)
    } catch (error) {
      showNotification({
        title: 'Kunne ikke åpne chatten',
        message: error instanceof Error ? error.message : '',
        color: 'red',
      })
    }
  }

  return (
    <div className={classes.row}>
      <ThemeIcon variant="light" color="samfundet-red" radius="xl" size={28}>
        <IconMessages size={16} />
      </ThemeIcon>
      <div className={classes.text}>
        <Text size="sm" fw={700} truncate>
          {shift.name}
        </Text>
        <Text size="xs" c="dimmed">
          <span className={classes.time}>
            {format(new Date(shift.datetimeStart), 'HH:mm')}–
            {format(new Date(shift.datetimeEnd), 'HH:mm')} ·{' '}
          </span>
          {item.userCount} på vakt
        </Text>
      </div>
      {chat ? (
        <Button
          variant="default"
          size="xs"
          h={32}
          rightSection={<UnreadBadge count={chat.unreadCount} />}
          onClick={() => navigate(`/chat/${chat.id}`)}
        >
          Åpne chat
        </Button>
      ) : (
        <Button
          color="samfundet-red"
          size="xs"
          h={32}
          loading={joinShiftChatLoading}
          onClick={handleJoin}
        >
          Bli med i chat
        </Button>
      )}
    </div>
  )
}
