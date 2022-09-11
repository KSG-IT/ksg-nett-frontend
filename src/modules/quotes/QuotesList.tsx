import { useQuery } from '@apollo/client'
import { Button } from 'components/Button'
import { Search } from 'components/Input'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { DEFAULT_PAGINATION_SIZE } from 'util/consts'
import { useDebounce } from 'util/hooks/useDebounce'
import { ApprovedQuotesReturns, ApprovedQuotesVariables } from '.'
import { APPROVED_QUOTES_QUERY } from './queries'
import { QuoteCard } from './QuoteCard'
const Wrapper = styled.div`
  display: grid;
  grid-template-areas:
    'title popular approve send'
    'search search search search'
    'quotes quotes quotes quotes'
    'fetchmore fetchmore fetchmore fetchmore';
  grid-template-rows: 40px 40px auto 40px;
  grid-template-columns: 3fr 1fr 1fr 1fr;
  gap: 10px;
  width: 100%;
  height: 100%;
  padding: 32px 16px;
  overflow-y: scroll;
  ${props => props.theme.media.mobile} {
    padding: 0;
    display: flex;
    gap: 10px;
    flex-direction: column;
  }
`

const Title = styled.h1`
  grid-area: title;
  margin: 0;
`

const QuotesContainer = styled.div`
  grid-area: quotes;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 15px;
  align-content: flex-start;
`

const PopularQuotesContainer = styled.div`
  grid-area: popular;
`

const SendInQuoteContainer = styled.div`
  grid-area: send;
`

const ApproveQuotesContainer = styled.div`
  grid-area: approve;
`

const QuoteSearchArea = styled.div`
  grid-area: search;
`
const FetchMoreArea = styled.div`
  grid-area: fetchmore;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const QuotesList = () => {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query)
  const history = useNavigate()
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
    <Wrapper>
      <Title>Sitater</Title>
      <PopularQuotesContainer>
        <Button onClick={() => navigate('/quotes/popular')}>
          Populære sitater
        </Button>
      </PopularQuotesContainer>
      <ApproveQuotesContainer>
        <Button onClick={() => navigate('/quotes/review')}>
          Godkjenn sitater
        </Button>
      </ApproveQuotesContainer>
      <SendInQuoteContainer>
        <Button onClick={() => navigate('/quotes/create')}>
          Send inn sitat
        </Button>
      </SendInQuoteContainer>
      <QuoteSearchArea>
        <Search
          fullwidth
          placeholder="Søkt etter innhold..."
          value={query}
          onChange={setQuery}
        />
      </QuoteSearchArea>
      <QuotesContainer>
        {quotes.map(quote => (
          <QuoteCard quote={quote} key={quote.id} displaySemester />
        ))}
      </QuotesContainer>
      <FetchMoreArea>
        <Button hide={!hasNextPage} onClick={handleFetchMore}>
          Hent flere sitater
        </Button>
      </FetchMoreArea>
    </Wrapper>
  )
}
