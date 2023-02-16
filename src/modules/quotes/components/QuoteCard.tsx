import {
  Avatar,
  Badge,
  Card,
  createStyles,
  Group,
  Menu,
  Stack,
  Text,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import {
  IconArrowBackUp,
  IconHash,
  IconThumbUp,
  IconTrash,
} from '@tabler/icons'
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

interface VoteIconProps {
  upvoted: boolean
  onClick: () => void
}

const UpvoteIcon: React.FC<VoteIconProps> = ({ upvoted, onClick }) => {
  const theme = useMantineTheme()
  return (
    <IconThumbUp
      color={upvoted ? `${theme.colors[theme.primaryColor[6]]}` : 'gray'}
      size={24}
      strokeWidth={upvoted ? 2 : 1}
      style={{ cursor: 'pointer' }}
      onClick={onClick}
    />
  )
}

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
  const { classes } = useStyles()
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
    <Card radius={'md'} className={classes.card} key={quote.id} withBorder>
      <Stack justify={'space-between'} spacing={'xs'} className={classes.card}>
        <Stack spacing={'xs'}>
          <Text size={'sm'} className={classes.quoteText}>
            {quote.text}
          </Text>

          <Text size={'xs'} color={'gray'}>
            {quote.context}
          </Text>
        </Stack>
        <Group position="apart" spacing={'xs'}>
          <Avatar.Group spacing={5}>
            {quote.tagged.map(user => (
              <UserThumbnail size={'sm'} key={user.id} user={user} />
            ))}
          </Avatar.Group>

          <Group spacing={'xs'}>
            <PermissionGate permissions={PERMISSIONS.quotes.invalidate.quote}>
              <Menu>
                <Menu.Target>
                  <UnstyledButton>
                    <IconHash size={18} color="lightgray" />
                  </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown style={{ zIndex: 9000 }}>
                  <PermissionGate
                    permissions={PERMISSIONS.quotes.invalidate.quote}
                  >
                    <Menu.Item
                      icon={<IconArrowBackUp />}
                      onClick={handleInvalidateQuote}
                    >
                      Underkjenn
                    </Menu.Item>
                  </PermissionGate>
                  <PermissionGate permissions={PERMISSIONS.quotes.delete.quote}>
                    <Menu.Item icon={<IconTrash />} onClick={handleDeleteQuote}>
                      Slett
                    </Menu.Item>
                  </PermissionGate>
                </Menu.Dropdown>
              </Menu>
            </PermissionGate>
            {displaySemester && (
              <Badge variant="outline">{quote.semester}</Badge>
            )}
            <Text size={'sm'}>{voteSum}</Text>
            <UpvoteIcon upvoted={upvoted} onClick={handleUpvote} />
          </Group>
        </Group>
      </Stack>
    </Card>
  )
}

const useStyles = createStyles(theme => ({
  quoteText: {
    color: theme.colors.gray[7],
    fontWeight: 500,
  },
  card: {
    width: 'auto',
    height: 'auto',
    overflow: 'visible',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
}))
