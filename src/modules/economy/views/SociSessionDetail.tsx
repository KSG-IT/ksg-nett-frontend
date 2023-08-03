import { useQuery } from '@apollo/client'
import { Button, Group, Stack, Title } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { MessageBox } from 'components/MessageBox'
import { PermissionGate } from 'components/PermissionGate'
import { useNavigate, useParams } from 'react-router-dom'
import { DetailQueryVariables } from 'types/graphql'
import { PERMISSIONS } from 'util/permissions'
import {
  PlaceProductOrder,
  ProductOrderTable,
} from '../components/SociSessions'
import { MetaDataDisplay } from '../components/SociSessions/MetaDataDisplay'
import { useSociSessionMutations } from '../mutations.hooks'
import { ALL_SOCI_SESSIONS, SOCI_SESSION_QUERY } from '../queries'
import { SociSessionReturns, SociSessionType } from '../types.graphql'

const breadcrumbsItems = [
  { label: 'Hjem', path: '/dashboard' },
  { label: 'Økonomi', path: '/economy' },
  { label: 'Innkryssinger', path: '/economy/soci-sessions' },
]

type SociSessionDetasilParams = {
  id: string
}

export const SociSessionDetail: React.FC = () => {
  const { id } = useParams<
    keyof SociSessionDetasilParams
  >() as SociSessionDetasilParams

  const navigate = useNavigate()

  const { data, loading, error } = useQuery<
    SociSessionReturns,
    DetailQueryVariables
  >(SOCI_SESSION_QUERY, {
    variables: {
      id,
    },
    pollInterval: 10_000,
  })

  const { closeSociSession } = useSociSessionMutations()

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  function handleCloseSession() {
    closeSociSession({
      variables: {
        id: id,
      },
      refetchQueries: [SOCI_SESSION_QUERY, ALL_SOCI_SESSIONS],
      onError({ message }) {
        showNotification({
          title: 'Noe gikk galt',
          message,
        })
      },
      onCompleted({ closeSociSession: { sociSession } }) {
        showNotification({
          title: 'Suksess',
          message: 'Krysseliste stengt',
        })

        if (sociSession === null) {
          navigate('/economy/soci-sessions')
        }
      },
    })
  }

  const { sociSession } = data
  const overloadedBreadcrumbs = [
    ...breadcrumbsItems,
    { label: sociSession.getNameDisplay, path: `` },
  ]

  const closable =
    !sociSession.closed && sociSession.type !== SociSessionType.SOCIETETEN

  return (
    <Stack>
      <Breadcrumbs items={overloadedBreadcrumbs} />
      <Group position="apart">
        <Title>{sociSession.getNameDisplay}</Title>
        <PermissionGate permissions={PERMISSIONS.economy.change.sociSession}>
          <Button
            color="samfundet-red"
            disabled={!closable}
            onClick={handleCloseSession}
          >
            Steng liste
          </Button>
        </PermissionGate>
      </Group>
      {sociSession.type === SociSessionType.SOCIETETEN && (
        <MessageBox type="warning">
          Krysselister fra Soci er automatisk ikke mulig å redigere gjennom
          KSG-nett. En stengt liste er heller ikke redigerbar.
        </MessageBox>
      )}
      <MetaDataDisplay sociSession={sociSession} />
      <Title order={2}>Innkryssinger</Title>
      <ProductOrderTable sociSession={sociSession} />

      {closable && (
        <>
          <Title order={2}>Legg til kryss</Title>

          <PlaceProductOrder sociSessionId={sociSession.id} />
        </>
      )}
    </Stack>
  )
}
