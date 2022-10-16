import { useMutation } from '@apollo/client'
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
import { IconHash, IconThumbUp, IconX } from '@tabler/icons'
import { QuoteNode } from 'modules/quotes/types'
import { UserThumbnail } from 'modules/users/components'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useStore } from 'store'
import {
  CreateQuoteVoteReturns,
  CreateQuoteVoteVariables,
  DeleteUserQuoteVoteReturns,
  DeleteUserQuoteVoteVariables,
} from '.'
import { CREATE_QUOTE_VOTE, DELETE_USER_QUOTE_VOTE } from './mutations'
import { useQuoteMutations } from './mutations.hooks'
import { APPROVED_QUOTES_QUERY, PNEDING_QUOTES_QUERY } from './queries'

interface VoteIconProps {
  upvoted: boolean
  onClick: () => void
}

const UpvoteIcon: React.FC<VoteIconProps> = ({ upvoted, onClick }) => {
  const theme = useMantineTheme()
  return (
    <IconThumbUp
      color={upvoted ? `${theme.colors.brand}` : 'gray'}
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
  const me = useStore(state => state.user)!
  const [upvoted, setUpvoted] = useState(me.upvotedQuoteIds.includes(quote.id))
  const [voteSum, setVoteSum] = useState(quote.sum)
  const [upvote] = useMutation<
    CreateQuoteVoteReturns,
    CreateQuoteVoteVariables
  >(CREATE_QUOTE_VOTE, {
    refetchQueries: ['PopularQuotes', 'ApprovedQuotes', 'Me'],
  })
  const [deleteUpvote] = useMutation<
    DeleteUserQuoteVoteReturns,
    DeleteUserQuoteVoteVariables
  >(DELETE_USER_QUOTE_VOTE, {
    refetchQueries: ['PopularQuotes', 'ApprovedQuotes', 'Me'],
  })

  const { invalidateQuote } = useQuoteMutations()

  useEffect(() => {
    const isUpvoted = me.upvotedQuoteIds.includes(quote.id)
    setUpvoted(isUpvoted)
  }, [me.upvotedQuoteIds, quote.id, setUpvoted])

  useEffect(() => {
    setVoteSum(quote.sum)
  }, [quote.sum])

  const handleUpvote = () => {
    if (!upvoted) {
      toast.promise(
        upvote({
          variables: { input: { quote: quote.id, value: 1 } },
        }),
        {
          loading: 'Oppstemmer sitat...',
          error: 'Kunne ikke oppstemme sitat!',
          success: 'Sitat oppstemt!',
        }
      )
    } else {
      toast.promise(deleteUpvote({ variables: { quoteId: quote.id } }), {
        loading: 'Sletter stemme...',
        error: 'Kunne ikke slette stemme',
        success: 'Stemme slettet!',
      })
    }
  }

  function handleInvalidateQuote() {
    invalidateQuote({
      variables: { quoteId: quote.id },
      refetchQueries: [APPROVED_QUOTES_QUERY, PNEDING_QUOTES_QUERY],
      onError() {
        toast.error('Noe gikk galt')
      },
      onCompleted() {
        toast.success('Sitat underkjent')
      },
    })
  }

  return (
    <Card className={classes.card} key={quote.id} withBorder>
      <div className={classes.row}>
        <Stack justify={'space-between'} spacing={0} className={classes.card}>
          <Text size={'sm'} className={classes.quoteText}>
            {quote.text}
          </Text>

          <Text size={'xs'} color={'gray'}>
            {quote.context}
          </Text>
          <Group position="apart" spacing={'xs'}>
            <Avatar.Group spacing={5}>
              {quote.tagged.map(user => (
                <UserThumbnail size={'sm'} key={user.id} user={user} />
              ))}
            </Avatar.Group>

            <Group spacing={'xs'}>
              {displaySemester && (
                <Badge variant="outline" color="samfundet-red">
                  {quote.semester}
                </Badge>
              )}
              <Text size={'sm'}>{voteSum}</Text>
              <UpvoteIcon upvoted={upvoted} onClick={handleUpvote} />
            </Group>
          </Group>
        </Stack>

        <UnstyledButton onClick={handleInvalidateQuote}>
          <IconHash size={18} />
        </UnstyledButton>
      </div>
    </Card>
  )
}

const useStyles = createStyles(theme => ({
  quoteText: {
    color: theme.colors.gray[7],
    fontWeight: 500,
  },
  card: {
    width: '100%',
    height: '100%',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
}))
