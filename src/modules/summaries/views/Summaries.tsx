import { useQuery } from '@apollo/client'
import {
  Avatar,
  Badge,
  Button,
  createStyles,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { IconPlus, IconSearch } from '@tabler/icons'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { CardTable } from 'components/CardTable'
import { FullPageError } from 'components/FullPageComponents'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DEFAULT_PAGINATION_SIZE } from 'util/consts'
import { format } from 'util/date-fns'
import { useDebounce } from 'util/hooks/useDebounce'
import { AllSummariesQueryReturns, AllSummariesQueryVariables } from '../index'
import { ALL_SUMMARIES } from '../queries'
import { UserThumbnail } from '../../users/components'
import { PermissionGate } from 'components/PermissionGate'
import { PERMISSIONS } from 'util/permissions'

const breadCrumbItems = [
  { label: 'Hjem', path: '/dashboard' },
  { label: 'Referater', path: '/summaries' },
]

export const Summaries: React.FC = () => {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query)
  const navigate = useNavigate()
  const { classes } = useStyles()

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
    <tr
      className={classes.tableRow}
      onClick={() => navigate(`/summaries/${summary.id}`)}
      key={summary.id}
    >
      <td>
        <Text color={'dimmed'} weight={'bold'}>
          {format(new Date(summary.date), 'dd.MM.yy')}
        </Text>
      </td>
      <td>
        <Badge variant={'filled'} color={'samfundet-red'}>
          {summary.displayName}
        </Badge>
      </td>
      <td>
        <Avatar.Group spacing={'sm'}>
          {summary.participants.map(user => (
            <UserThumbnail user={user} />
          ))}
        </Avatar.Group>
      </td>
      <td>
        <UserThumbnail user={summary.reporter} />
      </td>
    </tr>
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
      <Group position="apart" align={'baseline'}>
        <Title>Referater</Title>
        <PermissionGate permissions={PERMISSIONS.summaries.view.summary}>
          <Button
            size="md"
            onClick={() => {
              navigate('/summaries/create')
            }}
            leftIcon={<IconPlus />}
          >
            Nytt referat
          </Button>
        </PermissionGate>
      </Group>
      <TextInput
        value={query}
        placeholder="Søk etter innhold"
        icon={<IconSearch />}
        onChange={evt => setQuery(evt.target.value)}
      />

      <CardTable className={classes.card} highlightOnHover>
        <thead>
          <td>Dato</td>
          <td>Type</td>
          <td>Deltakere</td>
          <td>Referent</td>
        </thead>
        <tbody>{rows}</tbody>
      </CardTable>

      {hasNextPage && <Button onClick={handleFetchMore}>Hent fler</Button>}
    </Stack>
  )
}

const useStyles = createStyles(theme => ({
  card: {
    border: `1px solid ${theme.colors.gray[3]}`,
  },
  tableRow: {
    cursor: 'pointer',
  },
}))
