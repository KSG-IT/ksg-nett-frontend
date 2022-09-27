import { useMutation, useQuery } from '@apollo/client'
import { Button } from '@mantine/core'
import {
  FullPage404,
  FullPageEmpty,
  FullPageError,
} from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { format } from 'date-fns'
import { UserThumbnail } from 'modules/users/UserThumbnail'
import toast from 'react-hot-toast'
import styled from 'styled-components'
import { PatchQuoteReturns, PatchQuoteVariables, PendingQuotesReturns } from '.'
import { DELETE_QUOTE, PATCH_QUOTE } from './mutations'
import { PNEDING_QUOTES_QUERY } from './queries'

const Wrapper = styled.div`
  ${props => props.theme.layout.default};
  gap: 15px;
  overflow-y: scroll;
`

const QuoteReviewCard = styled.div`
  display: grid;
  wdith: 100%;
  padding: 10px;
  border-radius: 8px;
  background-color: ${props => props.theme.colors.white};
  grid-template-areas:
    'content content'
    'context context'
    'tagged tagged'
    'sentby sentby'
    'timestamp actions';
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto;
  grid-row-gap: 5px;
  ${props => props.theme.shadow.default};
`

const QutoeText = styled.div`
  grid-area: content;

  font-size: 18px;
  font-weight: 500;
`

const QuoteContext = styled.div`
  grid-area: context;

  font-size: 16px;
  color: ${props => props.theme.colors.gray1};
  font-style: italic;
`

const QuoteTagged = styled.div`
  grid-area: tagged;

  display: flex;
  flex-direction: row;
  gap: 5px;
`

const QuoteSentBy = styled.div`
  grid-area: sentby;
`

const QuoteTimestamp = styled.div`
  grid-area: timestamp;
`

const QuoteActions = styled.div`
  grid-area: actions;
  display: flex;
  flex-direction: row;
`

const Title = styled.h1`
  margin-top: 0;
`

export const ReviewQuotes = () => {
  // IN the future we can split this into multiple views
  // * approving unapproved quotes
  // * See reported quotes
  // Be able to see quotes up for review
  // be able to see more details for sent in quotes. Who sent in. Who approved etc.?
  // Ability to delete quotes or review them
  // Maybe everyone should be able to report a quote?
  const { data, loading, error } =
    useQuery<PendingQuotesReturns>(PNEDING_QUOTES_QUERY)

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
      <Wrapper>
        <Title>Innsendte sitater</Title>
        <FullPageEmpty />
      </Wrapper>
    )

  return (
    <Wrapper>
      <Title>Innsendte sitater</Title>
      {pendingQuotes.map(quote => (
        <QuoteReviewCard>
          <QutoeText>{quote.text}</QutoeText>
          <QuoteContext>{quote.context}</QuoteContext>
          <QuoteTagged>
            {quote.tagged.map(user => (
              <UserThumbnail user={user} size="sm" key={user.id} />
            ))}
          </QuoteTagged>
          <QuoteSentBy>{quote.reportedBy.fullName}</QuoteSentBy>
          <QuoteTimestamp>
            Sendt inn {format(new Date(quote.createdAt), 'eeee H:mm')}
          </QuoteTimestamp>
          <QuoteActions>
            <Button onClick={() => handleDeleteQuote(quote.id)} color="gray">
              Slett
            </Button>
            <Button onClick={() => handleApproveQuote(quote.id)}>
              Godkjenn
            </Button>
          </QuoteActions>
        </QuoteReviewCard>
      ))}
    </Wrapper>
  )
}
