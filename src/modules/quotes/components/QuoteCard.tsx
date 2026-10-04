import { ActionIcon, Avatar, Button, Card, Menu, Text } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import {
  IconArrowBackUp,
  IconDots,
  IconQuote,
  IconThumbUp,
  IconTrash,
} from '@tabler/icons-react'
import { PermissionGate } from 'components/PermissionGate'
import { UserThumbnail } from 'modules/users/components'
import { ME_QUERY, USER_QUERY } from 'modules/users/queries'
import { useState } from 'react'
import { useStore } from 'store'
import { PERMISSIONS } from 'util/permissions'
import { useQuoteMutations } from '../mutations.hooks'
import {
  APPROVED_QUOTES_QUERY,
  PNEDING_QUOTES_QUERY,
  POPULAR_QUOTES_QUERY,
} from '../queries'
import { QuoteNode } from '../types.graphql'
import classes from './QuoteCard.module.css'

interface UpvoteButtonProps {
  upvoted: boolean
  count: number
  onClick: () => void
}

const UpvoteButton: React.FC<UpvoteButtonProps> = ({
  upvoted,
  count,
  onClick,
}) => (
  <Button
    size="compact-sm"
    variant={upvoted ? 'light' : 'subtle'}
    color={upvoted ? 'samfundet-red' : 'gray'}
    leftSection={<IconThumbUp size={16} stroke={upvoted ? 2.2 : 1.6} />}
    aria-pressed={upvoted}
    aria-label={
      upvoted ? `Fjern stemme, ${count} stemmer` : `Stem opp, ${count} stemmer`
    }
    onClick={onClick}
  >
    {count}
  </Button>
)

interface QuoteTaggedProps {
  users: QuoteCardProps['quote']['tagged']
}

const QuoteTagged: React.FC<QuoteTaggedProps> = ({ users }) => (
  <Avatar.Group spacing={6}>
    {users.map(user => (
      <UserThumbnail size="sm" key={user.id} user={user} />
    ))}
  </Avatar.Group>
)

interface QuoteCardProps {
  quote: Pick<
    QuoteNode,
    'text' | 'id' | 'tagged' | 'context' | 'sum' | 'semester'
  >
  displaySemester?: boolean
}
export const QuoteCard: React.FC<QuoteCardProps> = ({
  quote,
  displaySemester = false,
}) => {
  const refetchQueries = [
    POPULAR_QUOTES_QUERY,
    APPROVED_QUOTES_QUERY,
    ME_QUERY,
    USER_QUERY,
  ]

  const me = useStore(state => state.user)!
  const [upvoted, setUpvoted] = useState(me.upvotedQuoteIds.includes(quote.id))
  const [voteSum, setVoteSum] = useState(quote.sum)

  const { invalidateQuote, deleteQuote, upvote, deleteUpvote } =
    useQuoteMutations()

  function handleUpvote() {
    if (!upvoted) {
      setVoteSum(sum => sum + 1)
      setUpvoted(true)
      upvote({
        variables: { input: { quote: quote.id, value: 1 } },
        refetchQueries,
      })
    } else {
      setVoteSum(sum => sum - 1)
      setUpvoted(false)
      deleteUpvote({ variables: { quoteId: quote.id }, refetchQueries })
    }
  }

  function handleInvalidateQuote() {
    invalidateQuote({
      variables: { quoteId: quote.id },
      refetchQueries: [APPROVED_QUOTES_QUERY, PNEDING_QUOTES_QUERY],
      onCompleted() {
        showNotification({
          message: 'Sitat underkjent',
        })
      },
      onError({ message }) {
        showNotification({
          title: 'Noe gikk galt',
          message,
        })
      },
    })
  }

  function handleDeleteQuote() {
    deleteQuote({
      variables: { id: quote.id },
      refetchQueries: [APPROVED_QUOTES_QUERY, PNEDING_QUOTES_QUERY],
      onCompleted() {
        showNotification({
          message: 'Sitat slettet',
        })
      },
      onError({ message }) {
        showNotification({
          title: 'Noe gikk galt',
          message,
        })
      },
    })
  }

  return (
    <Card radius="md" withBorder className={classes.card}>
      <div className={classes.top}>
        <IconQuote size={22} className={classes.mark} aria-hidden />
        {displaySemester && (
          <Text size="xs" c="dimmed" fw={600}>
            {quote.semester}
          </Text>
        )}
      </div>
      <Text className={classes.text} size="sm">
        {quote.text}
      </Text>
      {quote.context && (
        <Text size="xs" c="dimmed" fs="italic">
          {quote.context}
        </Text>
      )}
      <div className={classes.footer}>
        <QuoteTagged users={quote.tagged} />
        <div className={classes.actions}>
          <PermissionGate permissions={PERMISSIONS.quotes.invalidate.quote}>
            <Menu position="bottom-end">
              <Menu.Target>
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  aria-label="Flere valg for sitatet"
                >
                  <IconDots size={16} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown style={{ zIndex: 9000 }}>
                <Menu.Item
                  color="yellow"
                  leftSection={<IconArrowBackUp />}
                  onClick={handleInvalidateQuote}
                >
                  Underkjenn
                </Menu.Item>
                <PermissionGate permissions={PERMISSIONS.quotes.delete.quote}>
                  <Menu.Item
                    color="red"
                    leftSection={<IconTrash />}
                    onClick={handleDeleteQuote}
                  >
                    Slett
                  </Menu.Item>
                </PermissionGate>
              </Menu.Dropdown>
            </Menu>
          </PermissionGate>
          <UpvoteButton
            upvoted={upvoted}
            count={voteSum}
            onClick={handleUpvote}
          />
        </div>
      </div>
    </Card>
  )
}
