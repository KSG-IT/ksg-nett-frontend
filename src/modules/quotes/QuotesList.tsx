import { useQuery } from '@apollo/client'
import { Button } from 'components/Button'
import { Search } from 'components/Input'
import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { DEFAULT_PAGINATION_SIZE } from 'util/consts'
import { useDebounce } from 'util/hooks/useDebounce'
import { ApprovedQuotesReturns, ApprovedQuotesVariables } from '.'
import { APPROVED_QUOTES_QUERY } from './queries'
import { QuoteCard } from './QuoteCard'
const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  gap: 10px;
  flex-direction: column;
  padding: 32px 16px;
  overflow-y: scroll;
  ${props => props.theme.media.mobile} {
    padding: 0;
  }
`

const QuotesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  gap: 15px;
`
export const QuotesList = () => {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query)
  const history = useHistory()
  const { data, loading, error, fetchMore } = useQuery<
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
    <Wrapper>
      <h1>Sitater</h1>
      <button onClick={() => history.push('/quotes/review')}>
        Godkjenn sitater
      </button>
      <button onClick={() => history.push('/quotes/create')}>
        Send inn sitat
      </button>
      <Search
        fullwidth
        placeholder="Søkt etter innhold..."
        value={query}
        onChange={setQuery}
      />
      <QuotesContainer>
        {quotes.map(quote => (
          <QuoteCard quote={quote} key={quote.id} />
        ))}
      </QuotesContainer>
      <Button hide={!hasNextPage} onClick={handleFetchMore}>
        Hent flere sitater
      </Button>
    </Wrapper>
  )
}
