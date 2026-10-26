import { Text } from '@mantine/core'
import { Badge } from 'components/Badge'
import { parseShiftRole } from 'modules/schedules/util'
import { format } from 'util/date-fns'
import { ChatMessage } from '../types.graphql'
import classes from './MessageBubble.module.css'

interface MessageBubbleProps {
  message: ChatMessage
  mine: boolean
  // "Lest av Kari, Per +4". Only under the last message of the viewer.
  readLabel?: string
  // Sent, but the server has not saved it yet
  pending?: boolean
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  mine,
  readLabel,
  pending = false,
}) => (
  <div
    className={classes.row}
    data-mine={mine || undefined}
    data-pending={pending || undefined}
    aria-busy={pending || undefined}
  >
    <div className={classes.bubble} data-hidden={message.hidden || undefined}>
      <div className={classes.meta}>
        {!mine && (
          <>
            <Text span size="sm" fw={700}>
              {message.sender.getFullWithNickName}
            </Text>
            {message.role && (
              <Badge size="xs" color="gray" tt="none">
                {parseShiftRole(message.role)}
              </Badge>
            )}
          </>
        )}
        <Text span size="xs" c="dimmed">
          {format(new Date(message.createdAt), 'HH:mm')}
        </Text>
      </div>
      <Text className={classes.body}>{message.body}</Text>
    </div>
    {readLabel && (
      <Text size="xs" c="dimmed">
        Lest av {readLabel}
      </Text>
    )}
  </div>
)
