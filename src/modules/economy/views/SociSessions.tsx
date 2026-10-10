import { useQuery } from '@apollo/client'
import { Button, Group, Stack, Title } from '@mantine/core'
import { IconChartArea, IconGlass, IconPlus } from '@tabler/icons-react'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { LastUpdated } from 'components/LastUpdated'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { PermissionGate } from 'components/PermissionGate'
import { useState } from 'react'
import { DEFAULT_PAGINATION_SIZE } from 'util/consts'
import { useLastUpdated, useVisiblePolling } from 'util/hooks'
import { PERMISSIONS } from 'util/permissions'
import {
  CreateSociSessionModal,
  SociSessionsTable,
} from '../components/SociSessions'
import { ALL_SOCI_SESSIONS } from '../queries'
import {
  AllSociSessionsReturns,
  AllSociSessionsVariables,
} from '../types.graphql'
import { MessageBox } from 'components/MessageBox'
import { createStyles } from '@mantine/emotion'

// Only a visible tab polls, see useVisiblePolling.
const SESSIONS_POLL_MS = 10_000

const breadcrumbsItems = [
  { label: 'Hjem', path: '/dashboard' },
  { label: 'Økonomi', path: '/economy' },
  { label: 'Innkryssinger', path: '/economy/soci-sessions' },
]

export const SosiSessions: React.FC = () => {
  const { classes } = useSociSessionsStyles()
  const [createModalOpen, setCreateModalOpen] = useState(false)

  // notifyOnNetworkStatusChange makes every poll re-render, so "Sist oppdatert"
  // moves. `loading` is true during a poll, so only the first load shows the loader.
  const {
    data,
    error,
    fetchMore,
    networkStatus,
    startPolling,
    stopPolling,
    refetch,
  } = useQuery<AllSociSessionsReturns, AllSociSessionsVariables>(
    ALL_SOCI_SESSIONS,
    {
      variables: { first: DEFAULT_PAGINATION_SIZE },
      notifyOnNetworkStatusChange: true,
    }
  )
  useVisiblePolling({ startPolling, stopPolling, refetch }, SESSIONS_POLL_MS)
  const updatedAt = useLastUpdated(networkStatus)

  if (error) return <FullPageError />

  if (!data) return <FullContentLoader />

  const sociSessions = data?.allSociSessions.edges.map(edge => edge.node) ?? []

  const hasNextPage = data?.allSociSessions.pageInfo.hasNextPage ?? false

  async function handleFetchMore() {
    if (typeof data === 'undefined') return

    try {
      await fetchMore({
        variables: {
          first: DEFAULT_PAGINATION_SIZE,
          after: data.allSociSessions.pageInfo.endCursor,
        },
        updateQuery(prev, { fetchMoreResult }) {
          const newSociSessions = fetchMoreResult?.allSociSessions
          if (newSociSessions === undefined) return prev

          const newData = {
            allSociSessions: {
              ...prev.allSociSessions,
              pageInfo: newSociSessions.pageInfo,
              edges: [...prev.allSociSessions.edges, ...newSociSessions.edges],
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
    <div className={classes.wrapper}>
      <Breadcrumbs items={breadcrumbsItems} />
      <Group justify="space-between">
        <Stack gap={0}>
          <Title>Innkryssinger</Title>
          <LastUpdated updatedAt={updatedAt} />
        </Stack>
        <Group>
          <PermissionGate permissions={PERMISSIONS.economy.add.sociSession}>
            <Button
              color="samfundet-red"
              leftSection={<IconPlus />}
              onClick={() => setCreateModalOpen(true)}
            >
              Ny liste
            </Button>
          </PermissionGate>
          <PermissionGate permissions={PERMISSIONS.economy.view.sociSession}>
            <Button
              disabled
              color="samfundet-red"
              leftSection={<IconChartArea />}
            >
              Statistikk
            </Button>
          </PermissionGate>
          <PermissionGate permissions={PERMISSIONS.economy.change.sociProduct}>
            <Button disabled color="samfundet-red" leftSection={<IconGlass />}>
              Vareutvalg
            </Button>
          </PermissionGate>
        </Group>
      </Group>
      <MessageBox type="info">
        Tomme lister slettes automatisk når de stenges.
      </MessageBox>
      <SociSessionsTable sociSessions={sociSessions} />
      {hasNextPage && (
        <Button color="samfundet-red" onClick={handleFetchMore}>
          Last inn flere
        </Button>
      )}
      <CreateSociSessionModal
        open={createModalOpen}
        onCloseCallback={() => setCreateModalOpen(false)}
      />
    </div>
  )
}

const useSociSessionsStyles = createStyles({
  wrapper: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    gap: 'var(--mantine-spacing-md)',
  },
})
