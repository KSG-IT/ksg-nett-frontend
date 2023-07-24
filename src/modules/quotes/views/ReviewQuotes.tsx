import { useMutation, useQuery } from '@apollo/client'
import {
  Avatar,
  Button,
  Card,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
  createStyles,
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { Breadcrumbs } from 'components/Breadcrumbs'
import {
  FullPage404,
  FullPageEmpty,
  FullPageError,
} from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { PermissionGate } from 'components/PermissionGate'
import { UserThumbnail } from 'modules/users/components'
import { format } from 'util/date-fns'
import { PERMISSIONS } from 'util/permissions'
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

  function handleDeleteQuote(quoteId: string) {
    deleteQuote({
      variables: { id: quoteId },
      onCompleted() {
        showNotification({
          title: 'Suksess',
          message: 'Sitatet ble slettet',
          color: 'green',
        })
      },
      onError({ message }) {
        showNotification({
          title: 'Noe gikk galt',
          message,
          color: 'red',
        })
      },
    })
  }

  function handleApproveQuote(quoteId: string) {
    approveQuote({
      variables: {
        quoteId: quoteId,
      },
      refetchQueries: [PNEDING_QUOTES_QUERY, APPROVED_QUOTES_QUERY],
      onCompleted() {
        showNotification({
          title: 'Suksess',
          message: 'Sitatet ble godkjent',
          color: 'green',
        })
      },
      onError({ message }) {
        showNotification({
          title: 'Noe gikk galt',
          message,
          color: 'red',
        })
      },
    })
  }
  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const { pendingQuotes } = data

  if (pendingQuotes === null) return <FullPage404 />

  if (pendingQuotes.length === 0)
    return (
      <Stack>
        <Breadcrumbs items={breadcrumbsItems} />
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
                    Tidspunkt: {format(new Date(quote.createdAt), 'eeee HH:mm')}
                  </Text>
                </Stack>
              </Stack>

              <Stack>
                <PermissionGate permissions={PERMISSIONS.quotes.approve.quote}>
                  <Button
                    color={'samfundet-red'}
                    onClick={() => handleApproveQuote(quote.id)}
                  >
                    Godkjenn
                  </Button>
                </PermissionGate>
                <PermissionGate permissions={PERMISSIONS.quotes.delete.quote}>
                  <Button
                    variant="outline"
                    onClick={() => handleDeleteQuote(quote.id)}
                    color="gray"
                  >
                    Slett
                  </Button>
                </PermissionGate>
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
