import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_SUMMARIES } from './queries'
import { AllSummariesQueryReturns, AllSummariesQueryVariables } from '.'
import styled from 'styled-components'
import { format } from 'date-fns'
import { UserThumbnail } from 'modules/users'
import { Link, useHistory } from 'react-router-dom'
import { useDebounce } from 'util/hooks/useDebounce'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { DEFAULT_PAGINATION_SIZE } from 'util/consts'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  height: 100%;
  padding: 32px 72px;
  overflow-y: scroll;
`

const HeaderSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const Title = styled.h1`
  margin: 0;
`
const NewSummaryButton = styled.button`
  width: 120px;
  height: 35px;
  background-color: ${props => props.theme.colors.purpleAction};
  color: ${props => props.theme.colors.white};
  border-radius: 10px;
  border: none;
  box-shadow: ${props => props.theme.shadow.default};
  font-size: 14px;
`

const SummariesTable = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 10px;
  box-shadow: ${props => props.theme.shadow.default};
`

const SummariesTableHeader = styled.div`
  display: flex;
  flex-direction: row;
`

const SummariesTableHeaderCell = styled.div`
  font-size: 16px;
  font-weight: 500;
  width: 350px;
`

const SummariesTableRow = styled(Link)`
  display: flex;
  flex-direction: row;
  margin-bottom: 5px;

  :hover {
    cursor: pointer;
    background-color: ${props => props.theme.colors.lightGray};
  }
`

const SummariesTableCell = styled.div`
  width: 350px;
  display: flex;
  flex-direction: row;
  gap: 5px;
`

export const Summaries = () => {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query)
  const history = useHistory()

  const { data, loading, error, fetchMore } = useQuery<
    AllSummariesQueryReturns,
    AllSummariesQueryVariables
  >(ALL_SUMMARIES, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    variables: { q: debouncedQuery, first: DEFAULT_PAGINATION_SIZE },
  })

  if (error) return <span>An error has occurred</span>

  const summaries = data?.allSummaries.edges.map(edge => edge.node) ?? []
  const hasNextPage = data?.allSummaries.pageInfo.hasNextPage ?? false

  const handleFetchMore = async () => {
    if (typeof data === 'undefined') return

    try {
      await fetchMore({
        variables: {
          first: DEFAULT_PAGINATION_SIZE,
          q: debouncedQuery,
          after: data.allSummaries.pageInfo.endCursor,
        },
        updateQuery(prev, { fetchMoreResult }) {
          const newSummaries = fetchMoreResult?.allSummaries
          if (newSummaries === undefined) return prev

          const newData = {
            allSummaries: {
              ...prev.allSummaries,
              pageInfo: newSummaries.pageInfo,
              edges: [...prev.allSummaries.edges, ...newSummaries.edges],
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
      <HeaderSection>
        <Title>Referater</Title>
        <NewSummaryButton
          onClick={() => {
            history.push('/summaries/create')
          }}
        >
          <FontAwesomeIcon color="white" icon="plus" size="lg" />
          Nytt referat
        </NewSummaryButton>
      </HeaderSection>
      <input
        value={query}
        onChange={evt => setQuery(evt.target.value)}
        placeholder="Search for content"
      />
      <SummariesTable>
        <SummariesTableHeader>
          <SummariesTableHeaderCell>Dato</SummariesTableHeaderCell>
          <SummariesTableHeaderCell>Type</SummariesTableHeaderCell>
          <SummariesTableHeaderCell>Deltakere</SummariesTableHeaderCell>
          <SummariesTableHeaderCell>Referernt</SummariesTableHeaderCell>
        </SummariesTableHeader>
        {loading ? (
          <span>loading</span>
        ) : (
          <>
            {summaries.map(summary => (
              <SummariesTableRow
                key={summary.id}
                to={`summaries/${summary.id}`}
              >
                <SummariesTableCell>
                  {format(new Date(summary.date), 'dd.MM.yyyy')}
                </SummariesTableCell>
                <SummariesTableCell>{summary.type}</SummariesTableCell>
                <SummariesTableCell>
                  {/* This cell we can consider truncating. kinda doing a thumbnail with +7 if there are 7 more */}
                  {summary.participants.map(user => (
                    <UserThumbnail user={user} size="small" key={user.id} />
                  ))}
                </SummariesTableCell>
                <SummariesTableCell>
                  <UserThumbnail user={summary.reporter} size="small" />
                </SummariesTableCell>
              </SummariesTableRow>
            ))}
          </>
        )}
      </SummariesTable>
      {hasNextPage && <button onClick={handleFetchMore}>Hent fler</button>}
    </Wrapper>
  )
}
