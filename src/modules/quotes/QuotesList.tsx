import { useQuery } from '@apollo/client'
import {
  Button,
  Divider,
  Group,
  SimpleGrid,
  Stack,
  Tabs,
  Title,
} from '@mantine/core'
import { Search } from 'components/Input'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { DEFAULT_PAGINATION_SIZE } from 'util/consts'
import { useDebounce } from 'util/hooks/useDebounce'
import { ApprovedQuotesReturns, ApprovedQuotesVariables } from '.'
import { QuotesTabs } from './components/QuotesTabs'
import { APPROVED_QUOTES_QUERY } from './queries'
import { QuoteCard } from './QuoteCard'

const FetchMoreArea = styled.div`
  grid-area: fetchmore;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const QuotesList = () => {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query)

  const { data, fetchMore } = useQuery<
    ApprovedQuotesReturns,
    ApprovedQuotesVariables
  >(APPROVED_QUOTES_QUERY, {
    variables: { q: debouncedQuery, first: DEFAULT_PAGINATION_SIZE },
  })

  const quotes = data?.approvedQuotes.edges.map(edge => edge.node) ?? []
  const hasNextPage = data?.approvedQuotes.pageInfo.hasNextPage ?? false

  const handleFetchMore = async () => {
    if (typeof data === 'undefined') return

    try {
      await fetchMore({
        variables: {
          first: DEFAULT_PAGINATION_SIZE,
          q: debouncedQuery,
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
    <Stack>
      <Group position="apart">
        <Title order={2} color="dimmed">
          Sitater
        </Title>
        <Search
          width={400}
          placeholder="Søk etter innhold..."
          value={query}
          onChange={setQuery}
        />
        <QuotesTabs />
      </Group>
      <SimpleGrid
        cols={4}
        breakpoints={[
          { maxWidth: 'md', cols: 3, spacing: 'md' },
          { maxWidth: 'sm', cols: 2, spacing: 'sm' },
        ]}
      >
        {quotes.map(quote => (
          <QuoteCard quote={quote} key={quote.id} displaySemester />
        ))}
      </SimpleGrid>
      <FetchMoreArea>
        {hasNextPage && (
          <Button onClick={handleFetchMore}>Hent flere sitater</Button>
        )}
      </FetchMoreArea>
    </Stack>
  )
}
