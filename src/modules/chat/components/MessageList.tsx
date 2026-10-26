import { Button, Indicator } from '@mantine/core'
import { IconArrowDown } from '@tabler/icons-react'
import { useEffect, useRef, useState } from 'react'
import { ChatMember, ChatMessage } from '../types.graphql'
import {
  lastMessageOf,
  PendingMessage,
  pendingAsMessage,
  readersLabel,
  readersOf,
} from '../util'
import { MessageBubble } from './MessageBubble'
import classes from './MessageList.module.css'

// Closer than this to the end counts as "at the bottom".
const BOTTOM_THRESHOLD_PX = 80

interface MessageListProps {
  messages: ChatMessage[]
  pending: PendingMessage[]
  members: ChatMember[]
  meId: string
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  pending,
  members,
  meId,
}) => {
  const listRef = useRef<HTMLDivElement>(null)
  const [atBottom, setAtBottom] = useState(true)
  const [hasNew, setHasNew] = useState(false)
  const newest = messages[messages.length - 1]
  const newestId = newest?.id
  const newestIsMine = newest?.sender.id === meId

  function scrollToBottom(behavior: ScrollBehavior) {
    const list = listRef.current
    list?.scrollTo({ top: list.scrollHeight, behavior })
  }

  function handleScroll() {
    const list = listRef.current
    if (!list) return
    const distance = list.scrollHeight - list.scrollTop - list.clientHeight
    const bottom = distance < BOTTOM_THRESHOLD_PX
    setAtBottom(bottom)
    if (bottom) setHasNew(false)
  }

  // A new message follows the viewer to the bottom only if they are already
  // there, or sent it. Otherwise the list stays put and the jump button shows.
  // This syncs with the DOM, so it is an effect.
  useEffect(() => {
    if (atBottom || newestIsMine) scrollToBottom('auto')
    else setHasNew(true)
  }, [newestId])

  // A message the viewer sends shows at once, so go down with it
  useEffect(() => {
    if (pending.length > 0) scrollToBottom('auto')
  }, [pending.length])

  const mine = lastMessageOf(messages, meId)
  const readers = mine ? readersOf(mine, members, meId) : []

  return (
    <div className={classes.wrap}>
      <div className={classes.list} ref={listRef} onScroll={handleScroll}>
        {messages.map(message => (
          <MessageBubble
            key={message.id}
            message={message}
            mine={message.sender.id === meId}
            readLabel={
              message.id === mine?.id && readers.length > 0
                ? readersLabel(readers)
                : undefined
            }
          />
        ))}
        <PendingBubbles pending={pending} meId={meId} />
      </div>
      {!atBottom && (
        <div className={classes.jump}>
          <Indicator
            disabled={!hasNew}
            color="samfundet-red"
            size={12}
            offset={4}
          >
            <Button
              variant="default"
              radius="xl"
              size="sm"
              leftSection={<IconArrowDown size={16} />}
              style={{ boxShadow: 'var(--mantine-shadow-md)' }}
              aria-label={
                hasNew
                  ? 'Scroll til bunnen. Nye meldinger'
                  : 'Scroll til bunnen'
              }
              onClick={() => scrollToBottom('smooth')}
            >
              Scroll til bunnen
            </Button>
          </Indicator>
        </div>
      )}
    </div>
  )
}

interface PendingBubblesProps {
  pending: PendingMessage[]
  meId: string
}

const PendingBubbles: React.FC<PendingBubblesProps> = ({ pending, meId }) => (
  <>
    {pending.map(message => (
      <MessageBubble
        key={message.key}
        message={pendingAsMessage(message, meId)}
        mine
        pending
      />
    ))}
  </>
)
