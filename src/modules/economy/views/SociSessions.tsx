import { useQuery } from '@apollo/client'
import { Button, createStyles, Group, Title } from '@mantine/core'
import { IconChartArea, IconGlass, IconPlus, IconPrinter } from '@tabler/icons'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { PermissionGate } from 'components/PermissionGate'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DEFAULT_PAGINATION_SIZE } from 'util/consts'
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

const breadcrumbsItems = [
  { label: 'Hjem', path: '/dashboard' },
  { label: 'Innkryssinger', path: '/economy/soci-sessions' },
]

export const SosiSessions: React.FC = () => {
  const { classes } = useSociSessionsStyles()
  const [createModalOpen, setCreateModalOpen] = useState(false)

  const { data, loading, error, fetchMore } = useQuery<
    AllSociSessionsReturns,
    AllSociSessionsVariables
  >(ALL_SOCI_SESSIONS, {
    variables: { first: DEFAULT_PAGINATION_SIZE },
  })

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

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
      <Group position="apart">
        <Title>Innkryssinger</Title>
        <Group>
          <PermissionGate permissions={PERMISSIONS.economy.add.sociSession}>
            <Button
              color="samfundet-red"
              leftIcon={<IconPlus />}
              onClick={() => setCreateModalOpen(true)}
            >
              Ny liste
            </Button>
          </PermissionGate>
          <PermissionGate permissions={PERMISSIONS.economy.view.sociSession}>
            <Button disabled color="samfundet-red" leftIcon={<IconChartArea />}>
              Statistikk
            </Button>
          </PermissionGate>
          <PermissionGate permissions={PERMISSIONS.economy.change.sociProduct}>
            <Button disabled color="samfundet-red" leftIcon={<IconGlass />}>
              Vareutvalg
            </Button>
          </PermissionGate>
        </Group>
      </Group>
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

const useSociSessionsStyles = createStyles(theme => ({
  wrapper: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    gap: theme.spacing.md,
  },
}))
