import { useQuery } from '@apollo/client'
import { Button, Container, SimpleGrid } from '@mantine/core'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { DEFAULT_PAGINATION_SIZE } from 'util/consts'
import { APPROVED_QUOTES_QUERY } from '../queries'
import {
  ApprovedQuotesReturns,
  ApprovedQuotesVariables,
} from '../types.graphql'
import { QuoteCard } from './QuoteCard'

interface QuoteGridProps {
  search: string
}

export const QuoteGrid: React.FC<QuoteGridProps> = ({ search }) => {
  const { data, error, loading, fetchMore } = useQuery<
    ApprovedQuotesReturns,
    ApprovedQuotesVariables
  >(APPROVED_QUOTES_QUERY, {
    variables: { q: search, first: DEFAULT_PAGINATION_SIZE },
    pollInterval: 30_000,
  })

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const quotes = data?.approvedQuotes.edges.map(edge => edge.node) ?? []
  const hasNextPage = data?.approvedQuotes.pageInfo.hasNextPage ?? false

  const handleFetchMore = async () => {
    if (typeof data === 'undefined') return

    try {
      await fetchMore({
        variables: {
          first: DEFAULT_PAGINATION_SIZE,
          q: search,
          after: data.approvedQuotes.pageInfo.endCursor,
        },
        updateQuery(prev, { fetchMoreResult }) {
          const newQuotes = fetchMoreResult?.approvedQuotes
          if (newQuotes === undefined) return prev

          const newData = {
            approvedQuotes: {
              ...prev.approvedQuotes,
              pageInfo: newQuotes.pageInfo,
              edges: [...prev.approvedQuotes.edges, ...newQuotes.edges],
            },
          }
          return newData
        },
      })
    } catch (error) {
      // This is a thing https://stackoverflow.com/questions/68240884/error-object-inside-catch-is-of-type-unkown
      if (!(error instanceof Error)) return
      if (error.name === 'Invariant Violation') return

      throw error
    }
  }

  return (
    <>
      <SimpleGrid
        cols={4}
        breakpoints={[
          { maxWidth: 'lg', cols: 3, spacing: 'md' },
          { maxWidth: 'sm', cols: 1, spacing: 'sm' },
        ]}
      >
        {quotes.map(quote => (
          <QuoteCard quote={quote} key={quote.id} displaySemester />
        ))}
      </SimpleGrid>
      <Container>
        {hasNextPage && (
          <Button
            color="samfundet-red"
            loading={loading}
            onClick={handleFetchMore}
          >
            Hent flere sitater
          </Button>
        )}
      </Container>
    </>
  )
}
