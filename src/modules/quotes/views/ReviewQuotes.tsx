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
import { BackButton } from 'components/BackButton'
import { Breadcrumbs } from 'components/Breadcrumbs'
import {
  FullPage404,
  FullPageEmpty,
  FullPageError,
} from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { UserThumbnail } from 'modules/users/components'
import toast from 'react-hot-toast'
import { format } from 'util/date-fns'
import { QuotesTabs } from '../components/QuotesTabs'
import { DELETE_QUOTE } from '../mutations'
import { useQuoteMutations } from '../mutations.hooks'
import { APPROVED_QUOTES_QUERY, PNEDING_QUOTES_QUERY } from '../queries'
import { PendingQuotesReturns } from '../types.graphql'

const breadcrumbsItems = [
  { label: 'Hjem', path: '/dashboard' },
  { label: 'Sitater', path: '/quotes' },
  { label: 'Godkjenn', path: '/quotes/review' },
]

export const ReviewQuotes: React.FC = () => {
  const { classes } = useStyles()
  const { data, loading, error } = useQuery<PendingQuotesReturns>(
    PNEDING_QUOTES_QUERY,
    { fetchPolicy: 'network-only' }
  )

  const { approveQuote } = useQuoteMutations()

  const [deleteQuote] = useMutation(DELETE_QUOTE, {
    refetchQueries: [PNEDING_QUOTES_QUERY, APPROVED_QUOTES_QUERY],
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
          quoteId: quoteId,
        },
        refetchQueries: [PNEDING_QUOTES_QUERY, APPROVED_QUOTES_QUERY],
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
        <BackButton to="/quotes" />
        <Title>Innsendte sitater</Title>
        <FullPageEmpty />
      </Stack>
    )

  return (
    <Stack>
      <Breadcrumbs items={breadcrumbsItems} />
      <Group position="apart">
        <Title order={2} color="dimmed">
          Godkjenning av sitater
        </Title>
        <QuotesTabs />
      </Group>
      <SimpleGrid
        cols={3}
        breakpoints={[
          { maxWidth: 'lg', cols: 3, spacing: 'md' },
          { maxWidth: 'sm', cols: 1, spacing: 'sm' },
        ]}
      >
        {pendingQuotes.map(quote => (
          <Card key={quote.id} withBorder>
            <Group position="center">
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
                    {/* Legacy quotes have no reported by */}
                    Sendt inn av: {quote?.reportedBy?.fullName}
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
}))
