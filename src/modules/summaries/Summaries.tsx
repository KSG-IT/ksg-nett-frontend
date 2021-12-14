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
import { Link } from 'react-router-dom'
import { useDebounce } from 'util/hooks/useDebounce'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  height: 100%;
  margin: 0 auto;
`

const SummaryWrapper = styled.div`
  display: inline-flex;
  justify-content: space-between;
`

const SummaryLink = styled(Link)`
  display: infline-flex;
`

export const Summaries = () => {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query)
  const [summaries, setSummaries] = useState<SummaryNodeShallow[]>([])

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
      <input
        value={query}
        onChange={evt => setQuery(evt.target.value)}
        placeholder="Search for content"
      />
      {loading ? (
        <span>loading</span>
      ) : (
        <>
          {summaries.map((summary, i) => (
            <SummaryWrapper key={i}>
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
