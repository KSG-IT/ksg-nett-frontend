import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_SUMMARIES } from './queries'
import {
  AllSummariesQueryReturns,
  AllSummariesQueryVariables,
  SummaryNodeShallow,
} from '.'
import styled from 'styled-components'
import { format } from 'date-fns'
import { UserThumbnail } from 'modules/users'
import { Link, useHistory } from 'react-router-dom'
import { useDebounce } from 'util/hooks/useDebounce'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  height: 100%;
  margin: 0 auto;
`

const NewSummaryButton = styled.button`
  width: 100px;
  height: 35px;
  background-color: ${props => props.theme.colors.purpleAction};
  color: ${props => props.theme.colors.white};
  border-radius: 10px;
  border: none;
  box-shadow: ${props => props.theme.shadow.default};
`

const SummaryWrapper = styled.div`
  display: inline-flex;
  gap: 10px;
`

const SummaryLink = styled(Link)`
  display: infline-flex;
`

export const Summaries = () => {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query)
  const [summaries, setSummaries] = useState<SummaryNodeShallow[]>([])
  const history = useHistory()

  const { loading, error } = useQuery<
    AllSummariesQueryReturns,
    AllSummariesQueryVariables
  >(ALL_SUMMARIES, {
    variables: { q: debouncedQuery },
    onCompleted(data) {
      const { allSummaries } = data
      setSummaries(allSummaries.edges.map(node => node.node))
    },
  })

  if (error) return <span>An error has occurred</span>

  return (
    <Wrapper>
      <div>
        <input
          value={query}
          onChange={evt => setQuery(evt.target.value)}
          placeholder="Search for content"
        />
        <NewSummaryButton
          onClick={() => {
            history.push('/summaries/create')
          }}
        >
          Nytt referat
        </NewSummaryButton>
      </div>
      {loading ? (
        <span>loading</span>
      ) : (
        <>
          {summaries.map(summary => (
            <SummaryWrapper key={summary.id}>
              <SummaryLink to={`summaries/${summary.id}`}>
                {format(new Date(summary.date), 'dd.MM.yyyy')}
                {summary.summaryType}
              </SummaryLink>
              {summary.participants.map(user => (
                <UserThumbnail user={user} size="small" />
              ))}
            </SummaryWrapper>
          ))}
        </>
      )}
    </Wrapper>
  )
}
