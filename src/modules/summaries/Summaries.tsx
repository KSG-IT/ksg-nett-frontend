import { useQuery } from '@apollo/client'
import { Avatar, Button, Group, Paper, Table, TextInput } from '@mantine/core'
import { IconPlus, IconSearch } from '@tabler/icons'
import { FullPageError } from 'components/FullPageComponents'
import { format } from 'date-fns'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { DEFAULT_PAGINATION_SIZE } from 'util/consts'
import { useDebounce } from 'util/hooks/useDebounce'
import { AllSummariesQueryReturns, AllSummariesQueryVariables } from '.'
import { ALL_SUMMARIES } from './queries'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  height: 100%;
  padding: 32px 72px;
  overflow-y: scroll;
  ${props => props.theme.media.mobile} {
    padding: 12px;
  }
`

const Title = styled.h1`
  margin: 0;
`

const TableRow = styled.tr`
  :hover {
    cursor: pointer;
  }
`

export const Summaries = () => {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query)
  const navigate = useNavigate()

  const { data, error, fetchMore } = useQuery<
    AllSummariesQueryReturns,
    AllSummariesQueryVariables
  >(ALL_SUMMARIES, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    variables: { q: debouncedQuery, first: DEFAULT_PAGINATION_SIZE },
  })

  if (error) return <FullPageError />

  const summaries = data?.allSummaries.edges.map(edge => edge.node) ?? []
  const hasNextPage = data?.allSummaries.pageInfo.hasNextPage ?? false

  const rows = summaries.map(summary => (
    <TableRow
      onClick={() => navigate(`/summaries/${summary.id}`)}
      key={summary.id}
    >
      <td>{format(new Date(summary.date), 'MM.dd')}</td>
      <td>{summary.type}</td>
      <td>
        <Avatar.Group>
          {summary.participants.map(user => (
            <Avatar color={'red'}>{user.initials}</Avatar>
          ))}
        </Avatar.Group>
      </td>
      <td>
        <Avatar color={'blue'} radius={'lg'}>
          {summary.reporter.initials}
        </Avatar>
      </td>
    </TableRow>
  ))

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
      <Group position="apart" align={'baseline'}>
        <Title>Referater</Title>
        <Button
          size="md"
          onClick={() => {
            navigate('/summaries/create')
          }}
          leftIcon={<IconPlus />}
        >
          Nytt referat
        </Button>
      </Group>
      <TextInput
        value={query}
        placeholder="Søk etter innhold"
        icon={<IconSearch />}
        onChange={evt => setQuery(evt.target.value)}
      />
      <Paper p="sm">
        <Table highlightOnHover>
          <thead>
            <td>Dato</td>
            <td>Type</td>
            <td>Deltakere</td>
            <td>Referent</td>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </Paper>

      {hasNextPage && <Button onClick={handleFetchMore}>Hent fler</Button>}
    </Wrapper>
  )
}
