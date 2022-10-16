import { useMutation, useQuery } from '@apollo/client'
import {
  Avatar,
  Button,
  Card,
  createStyles,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import {
  FullPage404,
  FullPageEmpty,
  FullPageError,
} from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { UserThumbnail } from 'modules/users/components'
import toast from 'react-hot-toast'
import { format } from 'util/date-fns'
import { PatchQuoteReturns, PatchQuoteVariables, PendingQuotesReturns } from '.'
import { QuotesTabs } from './components/QuotesTabs'
import { DELETE_QUOTE, PATCH_QUOTE } from './mutations'
import { PNEDING_QUOTES_QUERY } from './queries'

export const ReviewQuotes: React.FC = () => {
  // IN the future we can split this into multiple views
  // * approving unapproved quotes
  // * See reported quotes
  // Be able to see quotes up for review
  // be able to see more details for sent in quotes. Who sent in. Who approved etc.?
  // Ability to delete quotes or review them
  // Maybe everyone should be able to report a quote?
  const { classes } = useStyles()
  const { data, loading, error } = useQuery<PendingQuotesReturns>(
    PNEDING_QUOTES_QUERY,
    { fetchPolicy: 'network-only' }
  )

  const [approveQuote] = useMutation<PatchQuoteReturns, PatchQuoteVariables>(
    PATCH_QUOTE,
    { refetchQueries: ['PendingQuotes', 'ApprovedQuotes', 'SidebarQuery'] }
  )

  const [deleteQuote] = useMutation(DELETE_QUOTE, {
    refetchQueries: ['PendingQuotes', 'SidebarQuery'],
  })

  const handleDeleteQuote = (quoteId: string) => {
    toast.promise(deleteQuote({ variables: { id: quoteId } }), {
      success: 'Sitat slettet',
      loading: 'Sletter sitat',
      error: 'Kunne ikke slette sitat',
    })
  }

  const handleApproveQuote = (quoteId: string) => {
    toast.promise(
      approveQuote({
        variables: {
          id: quoteId,
          input: {},
        },
      }),
      {
        success: 'Sitat godkjent',
        loading: 'Godkjenner sitat...',
        error: 'Noe gikk galt',
      }
    )
  }
  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const { pendingQuotes } = data

  if (pendingQuotes === null) return <FullPage404 />

  if (pendingQuotes.length === 0)
    return (
      <Stack>
        <Title>Innsendte sitater</Title>
        <FullPageEmpty />
      </Stack>
    )

  return (
    <Stack>
      <Group position="apart">
        <Title order={2} color="dimmed">
          Godkjenning av sitater
        </Title>
        <QuotesTabs />
      </Group>
      <SimpleGrid
        cols={3}
        breakpoints={[{ maxWidth: 'sm', cols: 1, spacing: 'sm' }]}
      >
        {pendingQuotes.map(quote => (
          <Card className={classes.card} key={quote.id} withBorder>
            <Group position="apart">
              <Stack justify={'space-between'} spacing={'xs'}>
                <Card withBorder>
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
                  </Group>
                </Card>

                <Stack spacing={0}>
                  <Text size="sm" color="dark">
                    Sendt inn av: {quote.reportedBy.fullName}
                  </Text>
                  <Text size="sm" color="dark">
                    Klokken {format(new Date(quote.createdAt), 'eeee H:mm')}
                  </Text>
                </Stack>
              </Stack>

              <Stack>
                <Button
                  color={'samfundet-red'}
                  onClick={() => handleApproveQuote(quote.id)}
                >
                  Godkjenn
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDeleteQuote(quote.id)}
                  color="gray"
                >
                  Slett
                </Button>
              </Stack>
            </Group>
          </Card>
        ))}
      </SimpleGrid>
    </Stack>
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
}))
