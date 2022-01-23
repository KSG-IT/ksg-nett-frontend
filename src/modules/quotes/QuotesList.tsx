import { useQuery } from '@apollo/client'
import { Search } from 'components/Input'
import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { useDebounce } from 'util/hooks/useDebounce'
import { ApprovedQuotesReturns, ApprovedQuotesVariables, QuoteNode } from '.'
import { APPROVED_QUOTES_QUERY } from './queries'
import { QuoteCard } from './QuoteCard'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  gap: 10px;
  flex-direction: column;
  padding: 32px 16px;

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
  const [quotes, setQuotes] = useState<QuoteNode[]>([])
  const history = useHistory()
  useQuery<ApprovedQuotesReturns, ApprovedQuotesVariables>(
    APPROVED_QUOTES_QUERY,
    {
      variables: { q: debouncedQuery },
      onCompleted(data) {
        const { approvedQuotes } = data
        setQuotes(approvedQuotes.edges.map(edge => edge.node))
      },
    }
  )

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
    </Wrapper>
  )
}
