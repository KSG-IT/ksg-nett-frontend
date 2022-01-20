import { useQuery } from '@apollo/client'
import { FullPage404, FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import styled from 'styled-components'
import { PendingQuotesReturns } from '.'
import { PNEDING_QUOTES_QUERY } from './queries'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

export const ReviewQuotes = () => {
  // Be able to see quotes up for review
  // be able to see more details for sent in quotes. Who sent in. Who approved etc.?
  // Ability to delete quotes or review them
  // Maybe everyone should be able to report a quote?
  const { data, loading, error } =
    useQuery<PendingQuotesReturns>(PNEDING_QUOTES_QUERY)

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const { pendingQuotes } = data

  if (pendingQuotes === null) return <FullPage404 />

  return (
    <Wrapper>
      {pendingQuotes.map(quote => (
        <span>{quote.text}</span>
      ))}
    </Wrapper>
  )
}
