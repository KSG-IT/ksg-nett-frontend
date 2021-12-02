import styled from 'styled-components'
import { useQuery } from '@apollo/client'
import { APPROVED_QUOTES_QUERY } from './queries'
import { ApprovedQuotesReturns, ApprovedQuotesVariables, QuoteNode } from '.'
import { useState } from 'react'
import { useDebounce } from 'util/hooks/useDebounce'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;

  flex-direction: column;
`
export const QuotesList = () => {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query)
  const [quotes, setQuotes] = useState<QuoteNode[]>([])

  const { data, loading, error } = useQuery<
    ApprovedQuotesReturns,
    ApprovedQuotesVariables
  >(APPROVED_QUOTES_QUERY, {
    variables: { q: debouncedQuery },
    onCompleted(data) {
      const { approvedQuotes } = data
      setQuotes(approvedQuotes.edges.map(edge => edge.node))
    },
  })

  console.log(debouncedQuery)
  return (
    <Wrapper>
      <h2>Quotes list</h2>
      <input value={query} onChange={evt => setQuery(evt.target.value)} />

      {quotes.map((quote, i) => (
        <span key={i}>
          {quote.text} - {quote.context}
        </span>
      ))}
    </Wrapper>
  )
}
