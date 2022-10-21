import { useQuery } from '@apollo/client'
import { Button, Group, Paper, Stack, Table, Title } from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { UserThumbnail } from 'modules/users/components'
import { Link } from 'react-router-dom'
import { DEFAULT_PAGINATION_SIZE } from 'util/consts'
import { PREVIOUS_BAR_TABS_QUERY } from '../queries'
import { BarTabNode, PreviousBarTabsReturns } from '../types.graphql'

export const PreviousBarTabs: React.FC = () => {
  const { data, loading, error, fetchMore } = useQuery<PreviousBarTabsReturns>(
    PREVIOUS_BAR_TABS_QUERY,
    {
      variables: {
        first: DEFAULT_PAGINATION_SIZE,
      },
    }
  )

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const barTabs = data?.previousBarTabs.edges.map(edge => edge.node) ?? []
  const hasNextPage = data?.previousBarTabs.pageInfo.hasNextPage ?? false

  const rows = barTabs.map((barTab: BarTabNode) => (
    <tr key={barTab.id}>
      <td>{barTab.id}</td>
      <td>{barTab.datetimeOpened}</td>
      <td>{barTab.datetimeReviewed}</td>
      <td>{<UserThumbnail user={barTab.reviewedBy} />}</td>
    </tr>
  ))

  const handleFetchMore = async () => {
    if (typeof data === 'undefined') return

    try {
      await fetchMore({
        variables: {
          first: DEFAULT_PAGINATION_SIZE,
          after: data.previousBarTabs.pageInfo.endCursor,
        },
        updateQuery(prev, { fetchMoreResult }) {
          const newBarTabs = fetchMoreResult?.previousBarTabs
          if (newBarTabs === undefined) return prev

          const newData = {
            previousBarTabs: {
              ...prev.previousBarTabs,
              pageInfo: newBarTabs.pageInfo,
              edges: [...prev.previousBarTabs.edges, ...newBarTabs.edges],
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
      <Group position="apart">
        <Title>Tidligere BSF'er</Title>
        <Link to="/bar-tab">
          <Button
            color="samfundet-red"
            leftIcon={<IconArrowLeft />}
            variant="subtle"
          >
            Tilbake
          </Button>
        </Link>
      </Group>

      <Paper p="sm">
        <Table>
          <thead>
            <tr>
              <th>BSF ID</th>
              <th>Startet</th>
              <th>Sluttet</th>
              <th>Opprettet av</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </Paper>

      {hasNextPage && (
        <Button color="samfundet-red" onClick={handleFetchMore}>
          Hent flere
        </Button>
      )}
    </Stack>
  )
}
