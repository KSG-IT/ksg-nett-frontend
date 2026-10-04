import { useQuery } from '@apollo/client'
import { Button, Stack, Table, Title } from '@mantine/core'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { CardTable } from 'components/CardTable'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { UserThumbnail } from 'modules/users/components'
import { DEFAULT_PAGINATION_SIZE } from 'util/consts'
import { PREVIOUS_BAR_TABS_QUERY } from '../queries'
import { BarTabNode, PreviousBarTabsReturns } from '../types.graphql'

const breadcrumbsItems = [
  { label: 'Hjem', path: '/dashboard' },
  { label: 'BSF', path: '/bar-tab' },
  { label: 'Tidligere BSF', path: '/bar-tab/previous' },
]

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
    <Table.Tr key={barTab.id}>
      <Table.Td>{barTab.id}</Table.Td>
      <Table.Td>{barTab.datetimeOpened}</Table.Td>
      <Table.Td>{barTab.datetimeReviewed}</Table.Td>
      <Table.Td>{<UserThumbnail user={barTab.reviewedBy} />}</Table.Td>
    </Table.Tr>
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
      <Breadcrumbs items={breadcrumbsItems} />
      <Title>Tidligere BSF'er</Title>
      <CardTable>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>BSF ID</Table.Th>
            <Table.Th>Startet</Table.Th>
            <Table.Th>Sluttet</Table.Th>
            <Table.Th>Opprettet av</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </CardTable>

      {hasNextPage && (
        <Button color="samfundet-red" onClick={handleFetchMore}>
          Hent flere
        </Button>
      )}
    </Stack>
  )
}
