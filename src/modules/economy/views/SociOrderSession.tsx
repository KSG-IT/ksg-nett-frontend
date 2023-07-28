import { useQuery } from '@apollo/client'
import { Button, Group, Modal, Stack, Title } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconDownload, IconMeat } from '@tabler/icons-react'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { CardTable } from 'components/CardTable'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { MessageBox } from 'components/MessageBox'
import { PermissionGate } from 'components/PermissionGate'
import { DASHBOARD_DATA_QUERY } from 'modules/dashboard/queries'
import { ME_QUERY } from 'modules/users/queries'
import { useState } from 'react'
import { PERMISSIONS } from 'util/permissions'
import {
  DrinkOrderingForm,
  DrinkOrdersTable,
  FoodOrderingForm,
  MyFoodOrders,
} from '../components/SociOrderSession'
import { InviteUsersModalButton } from '../components/SociOrderSession/InviteUsersModalButton'
import { SociOrderSessionStatusValues } from '../enums'
import { useSociOrderSessionMutations } from '../mutations.hooks'
import {
  ACTIVE_SOCI_ORDER_SESSION,
  ALL_SOCI_SESSIONS,
  MY_SESSION_PRODUCT_ORDERS_QUERY,
} from '../queries'
import { ActiveSociOrderSessionReturns } from '../types.graphql'

export const SociOrderSession: React.FC = ({}) => {
  const [burgerModalOpen, setBurgerModalOpen] = useState(false)
  const { data, loading, error } = useQuery<ActiveSociOrderSessionReturns>(
    ACTIVE_SOCI_ORDER_SESSION,
    {
      fetchPolicy: 'network-only',
    }
  )

  const {
    createSociOrderSession,
    sociOrderSessionNextStatus,
    sociOrderSessionNextStatusLoading,
  } = useSociOrderSessionMutations()

  function handleCreateOrderSession() {
    const confirmed = confirm(
      'Er du sikker på at du vil starte digital stilletime?'
    )

    if (!confirmed) return

    createSociOrderSession({
      refetchQueries: [ACTIVE_SOCI_ORDER_SESSION, DASHBOARD_DATA_QUERY],
      onError({ message }) {
        showNotification({
          title: 'Noe gikk galt',
          message,
        })
      },
    })
  }

  function handleNextStatus() {
    const confirmed = confirm('Sikker på at du vil stenge?')

    if (!confirmed) return

    sociOrderSessionNextStatus({
      refetchQueries: [
        ACTIVE_SOCI_ORDER_SESSION,
        ME_QUERY,
        DASHBOARD_DATA_QUERY,
        ALL_SOCI_SESSIONS,
        MY_SESSION_PRODUCT_ORDERS_QUERY,
      ],
    })
  }

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const { activeSociOrderSession } = data

  if (!activeSociOrderSession)
    return (
      <Stack>
        <Breadcrumbs
          items={[
            { label: 'Hjem', path: '/dashboard' },
            { label: 'Stilletime', path: '/economy/soci-sessions/live' },
          ]}
        />
        <Title order={2}>Stilletime</Title>
        <MessageBox type="info">
          Det er foreløpig ingen aktiv stilletime.
        </MessageBox>
        <PermissionGate permissions={PERMISSIONS.economy.add.sociOrderSession}>
          <Group>
            <Button onClick={handleCreateOrderSession}>Start stilletime</Button>
          </Group>
        </PermissionGate>
      </Stack>
    )

  if (
    activeSociOrderSession.status === SociOrderSessionStatusValues.FOOD_ORDERING
  ) {
    return (
      <Stack>
        <Breadcrumbs
          items={[
            { label: 'Hjem', path: '/dashboard' },
            { label: 'Stilletime', path: '/economy/soci-sessions/live' },
          ]}
        />
        <Group position="apart">
          <Title order={2}>Burgerliste</Title>
          <Group>
            <PermissionGate
              permissions={PERMISSIONS.economy.change.sociOrderSession}
            >
              <InviteUsersModalButton />
              <Button
                loading={sociOrderSessionNextStatusLoading}
                onClick={handleNextStatus}
              >
                Steng bestillinger
              </Button>
            </PermissionGate>
          </Group>
        </Group>

        <MessageBox type="info">
          Dette er burgerlisten. Fram til listen blir levert til sesam er det
          mulig å legge inn en bestilling her. Du vil bli trukket på kontoen din
          når bestillingen blir levert. Om du ikke har nok penger på kontoen vil
          du ikke kunne bestille.
        </MessageBox>
        <MyFoodOrders />
        <FoodOrderingForm />
      </Stack>
    )
  }

  if (
    activeSociOrderSession.status ===
    SociOrderSessionStatusValues.DRINK_ORDERING
  ) {
    return (
      <Stack>
        <Breadcrumbs
          items={[
            { label: 'Hjem', path: '/dashboard' },
            { label: 'Stilletime', path: '/economy/soci-sessions/live' },
          ]}
        />
        <Group>
          <Title order={2}>Stilletime</Title>
          <Button
            variant="outline"
            leftIcon={<IconMeat />}
            onClick={() => setBurgerModalOpen(true)}
          >
            Burgerliste
          </Button>
          {activeSociOrderSession.orderPdf && (
            <a href={activeSociOrderSession.orderPdf} target="_blank">
              <Button variant="outline" leftIcon={<IconDownload />}>
                Last ned
              </Button>
            </a>
          )}

          <Group>
            <PermissionGate
              permissions={PERMISSIONS.economy.change.sociOrderSession}
            >
              <InviteUsersModalButton />
              <Button
                loading={sociOrderSessionNextStatusLoading}
                onClick={handleNextStatus}
              >
                Avslutt stilletime
              </Button>
            </PermissionGate>
          </Group>
        </Group>

        <MessageBox type="info">
          Dette er stilletime. Kjøp av drikke belastes med en gang og er ikke
          mulig å angre på. Om du kjøper noe feil må du ta kontakt med en
          administrator. Alle kan se hverandres bestillinger her.
        </MessageBox>
        <Title order={2}>Drikkekryss</Title>
        <DrinkOrdersTable />
        <DrinkOrderingForm />
        <Modal
          title="Burgerliste"
          opened={burgerModalOpen}
          onClose={() => setBurgerModalOpen(false)}
        >
          <CardTable>
            <thead>
              <tr>
                <th>Navn</th>
                <th>Antall</th>
                <th>Vare</th>
              </tr>
            </thead>
            <tbody>
              {activeSociOrderSession.foodOrders.map(order => (
                <tr key={order.id}>
                  <td>{order.user.getCleanFullName}</td>
                  <td>{order.amount}</td>
                  <td>{order.product.name}</td>
                </tr>
              ))}
            </tbody>
          </CardTable>
        </Modal>
      </Stack>
    )
  }

  return (
    <Stack>
      <Title order={3}>Oi, den her skal du egentlig aldri se</Title>
    </Stack>
  )
}
