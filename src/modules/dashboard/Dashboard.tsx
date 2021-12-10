import { useAuth } from 'context/Authentication'
import { format } from 'date-fns'
import { UserThumbnail } from 'modules/users'
import styled from 'styled-components'
import { useDashboardQuery } from '__generated__/graphql'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 32px 18px;
`

const CardRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 32px;
  justify-content: space-between;
`

interface CardProps {
  width: string
  height: string
}

const QuoteSpan = styled.div`
  display: flex;
  flex-direction: row;
`

const QuoteQard = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  width: 200px;
  height: 100px;
  background-color: ${props => props.theme.colors.white};
  border-radius: 10px;
  box-shadow: ${props => props.theme.shadow.default};
  margin-right: 15px;
`

const QuoteText = styled.span`
  font-size: 16px;
  font-weight: 600;
`

const QuoteContext = styled.span`
  font-size: 14px;
  font-style: italic;
  color: ${props => props.theme.colors.darkGray};
`

const QuoteTaggedWrapper = styled.div`
  display: flex;
  flex-direction: row;
`

const Card = styled.div<CardProps>`
  display: flex;
  flex-direction: column;
  padding: 20px 10px;
  width: ${props => props.width};
  height: ${props => props.height};
  margin: 0 20px;
  background-color: ${props => props.theme.colors.white};
  border-radius: 10px;
  box-shadow: ${props => props.theme.shadow.default};

  &:first-child > span {
    font-weight: 500;
  }
`
const CardTitle = styled.h3`
  margin: 0;
`

const TransactionSpan = styled.div`
  display: inline-flex;
  justify-content: space-between;
  margin-top: 10px;
`

export const Dashboard = () => {
  const user = useAuth()
  const { lastTransactions } = user

  const { data, loading, error } = useDashboardQuery()

  if (loading || data === undefined) return <span>Loading</span>

  if (error) return <span>En feil opstod</span>

  const {
    dashboardData: { wantedList, lastSummaries, lastQuotes },
  } = data

  return (
    <Wrapper>
      {wantedList.length > 0 && (
        <>
          <h1>Wanted</h1>
          {wantedList.map(user => (
            <Card width="200px" height="auto">
              <b>{user.fullName}</b>
              <span>Skylder: {user.balance},- NOK</span>
            </Card>
          ))}
        </>
      )}

      <CardRow>
        <Card width="450px" height="auto">
          <CardTitle>Siste transaksjoner</CardTitle>
          <TransactionSpan>
            <span>Date</span>

            <span>Type</span>
            <span>Quantity</span>
            <span>Total amount</span>
          </TransactionSpan>
          {lastTransactions.map((activity, i) => (
            <TransactionSpan key={i}>
              <span>{format(new Date(activity.timestamp), 'd.M')}</span>
              <span>{activity.name}</span>
              <span>{activity.quantity}</span>
              <span>{activity.amount},- NOK</span>
            </TransactionSpan>
          ))}
        </Card>
        <Card width="450px" height="300px">
          <h3>Last summaries</h3>
          {lastSummaries.map((summary, i) => (
            <TransactionSpan key={i}>
              <a href={`/summaries/${summary.id}`}>{summary.summaryType}</a>
              <span>{format(new Date(summary.date), 'd.M')}</span>
            </TransactionSpan>
          ))}
        </Card>
      </CardRow>
      <QuoteSpan>
        {lastQuotes.map((quote, i) => (
          <QuoteQard key={i}>
            {' '}
            <QuoteText>{quote.text}</QuoteText>
            <QuoteContext>{quote.context}</QuoteContext>
            <QuoteTaggedWrapper>
              {quote.tagged.map(taggedUser => (
                <UserThumbnail size="small" user={taggedUser} />
              ))}
            </QuoteTaggedWrapper>
          </QuoteQard>
        ))}
      </QuoteSpan>
    </Wrapper>
  )
}
