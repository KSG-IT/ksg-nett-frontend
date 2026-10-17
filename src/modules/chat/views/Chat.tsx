import { SegmentedControl, Text, Title } from '@mantine/core'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { FullPage404 } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMe } from 'util/hooks'
import { ChatList } from '../components/ChatList'
import { ChatWindow } from '../components/ChatWindow'
import { useChatEnabled } from '../hooks/useChatEnabled'
import { useVisualViewport } from '../hooks/useVisualViewport'
import classes from './Chat.module.css'

// The inbox. A wide screen shows the list and the open chat side by side.
// A phone shows the list, or the chat in full screen when one is open.
export const Chat: React.FC = () => {
  const { chatId } = useParams()
  const me = useMe()
  const { enabled, loading: flagLoading } = useChatEnabled()
  const [showAll, setShowAll] = useState(false)
  const pageRef = useRef<HTMLDivElement>(null)
  useVisualViewport(pageRef, enabled && !flagLoading)

  if (flagLoading) return <FullContentLoader />
  if (!enabled) return <FullPage404 />

  // With a chat open, "Chat" links back to the list.
  const breadcrumbsItems = [
    { label: 'Hjem', path: '/dashboard' },
    { label: 'Chat', path: chatId ? '/chat' : '' },
  ]

  return (
    <div
      ref={pageRef}
      className={classes.page}
      data-has-chat={chatId ? '' : undefined}
    >
      <div className={classes.heading}>
        <Breadcrumbs items={breadcrumbsItems} />
        <Title order={1}>Chat</Title>
      </div>
      <div className={classes.inbox}>
        <section className={classes.list} aria-label="Dine chatter">
          {me.isSuperuser && (
            <SegmentedControl
              fullWidth
              value={showAll ? 'all' : 'mine'}
              onChange={value => setShowAll(value === 'all')}
              data={[
                { label: 'Mine chatter', value: 'mine' },
                { label: 'Alle chatter', value: 'all' },
              ]}
            />
          )}
          <Text size="sm" c="dimmed" px="sm">
            Sortert etter siste melding
          </Text>
          <ChatList activeChatId={chatId} showAll={showAll} />
        </section>
        <section className={classes.window} aria-label="Valgt chat">
          {chatId ? (
            <ChatWindow key={chatId} chatId={chatId} />
          ) : (
            <Text c="dimmed" p="xl" ta="center">
              Velg en chat i listen.
            </Text>
          )}
        </section>
      </div>
    </div>
  )
}
