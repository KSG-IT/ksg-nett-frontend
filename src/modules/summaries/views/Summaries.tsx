import { useQuery } from '@apollo/client'
import {
  Avatar,
  Button,
  Group,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { Badge } from 'components/Badge'
import { createStyles } from '@mantine/emotion'
import { IconPlus, IconSearch } from '@tabler/icons-react'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { CardTable } from 'components/CardTable'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { PermissionGate } from 'components/PermissionGate'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DEFAULT_PAGINATION_SIZE } from 'util/consts'
import { format } from 'util/date-fns'
import { useDebounce } from 'util/hooks/useDebounce'
import { PERMISSIONS } from 'util/permissions'
import { UserThumbnail } from '../../users/components'
import { AllSummariesQueryReturns, AllSummariesQueryVariables } from '../index'
import { ALL_SUMMARIES } from '../queries'

const breadCrumbItems = [
  { label: 'Hjem', path: '/dashboard' },
  { label: 'Referater', path: '/summaries' },
]

export const Summaries: React.FC = () => {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query)
  const navigate = useNavigate()
  const { classes } = useStyles()

  const { data, error, loading, fetchMore } = useQuery<
    AllSummariesQueryReturns,
    AllSummariesQueryVariables
  >(ALL_SUMMARIES, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    variables: { q: debouncedQuery, first: DEFAULT_PAGINATION_SIZE },
    pollInterval: 30_000,
  })

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const summaries = data?.allSummaries.edges.map(edge => edge.node) ?? []
  const hasNextPage = data?.allSummaries.pageInfo.hasNextPage ?? false

  const rows = summaries.map(summary => (
    <Table.Tr
      className={classes.tableRow}
      onClick={() => navigate(`/summaries/${summary.id}`)}
      key={summary.id}
    >
      <Table.Td>
        <Text c={'dimmed'} fw={700}>
          {format(new Date(summary.date), 'dd.MM.yy')}
        </Text>
      </Table.Td>
      <Table.Td>
        <Badge variant={'filled'} color={'samfundet-red'}>
          {summary.displayName}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Avatar.Group spacing={'sm'}>
          {summary.participants.map(user => (
            <UserThumbnail key={user.id} user={user} />
          ))}
        </Avatar.Group>
      </Table.Td>
      <Table.Td>
        <UserThumbnail user={summary.reporter} />
      </Table.Td>
    </Table.Tr>
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
    <Stack>
      <Breadcrumbs items={breadCrumbItems} />
      <Group justify="space-between" align={'baseline'}>
        <Title>Referater</Title>
        <PermissionGate permissions={PERMISSIONS.summaries.view.summary}>
          <Button
            size="md"
            onClick={() => {
              navigate('/summaries/create')
            }}
            leftSection={<IconPlus />}
          >
            Nytt referat
          </Button>
        </PermissionGate>
      </Group>
      <TextInput
        value={query}
        placeholder="Søk etter innhold"
        leftSection={<IconSearch />}
        onChange={evt => setQuery(evt.target.value)}
      />

      <CardTable className={classes.card} highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Dato</Table.Th>
            <Table.Th>Type</Table.Th>
            <Table.Th>Deltakere</Table.Th>
            <Table.Th>Referent</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </CardTable>

      {hasNextPage && <Button onClick={handleFetchMore}>Hent fler</Button>}
    </Stack>
  )
}

const useStyles = createStyles({
  card: {
    border: '1px solid var(--mantine-color-gray-3)',
  },
  tableRow: {
    cursor: 'pointer',
  },
})
