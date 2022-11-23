import { useQuery } from '@apollo/client'
import { Button, Group, Modal, Stack, Title } from '@mantine/core'
import { IconDownload, IconMeat } from '@tabler/icons'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { CardTable } from 'components/CardTable'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { MessageBox } from 'components/MessageBox'
import { PermissionGate } from 'components/PermissionGate'
import { useState } from 'react'
import { PERMISSIONS } from 'util/permissions'
import {
  DrinkOrderingForm,
  DrinkOrdersTable,
  FoodOrderingForm,
  MyFoodOrders,
} from '../components/SociOrderSession'
import { SociOrderSessionStatusValues } from '../enums'
import { useSociOrderSessionMutations } from '../mutations.hooks'
import { ACTIVE_SOCI_ORDER_SESSION } from '../queries'
import { ActiveSociOrderSessionReturns } from '../types.graphql'

export const SociOrderSession: React.FC = ({}) => {
  const [burgerModalOpen, setBurgerModalOpen] = useState(false)
  const { data, loading, error } = useQuery<ActiveSociOrderSessionReturns>(
    ACTIVE_SOCI_ORDER_SESSION,
    {
      fetchPolicy: 'network-only',
    }
  )

  const { createSociOrderSession, sociOrderSessionNextStatus } =
    useSociOrderSessionMutations()

  function handleCreateOrderSession() {
    createSociOrderSession({
      refetchQueries: [ACTIVE_SOCI_ORDER_SESSION],
    })
  }

  function handleNextStatus() {
    sociOrderSessionNextStatus({
      refetchQueries: [ACTIVE_SOCI_ORDER_SESSION],
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
        <Title order={2}>Ingen stilletime</Title>
        <PermissionGate permissions={PERMISSIONS.economy.add.sociOrderSession}>
          <Button onClick={handleCreateOrderSession}>Start stilletime</Button>
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
          <PermissionGate
            permissions={PERMISSIONS.economy.change.sociOrderSession}
          >
            <Button onClick={handleNextStatus}>Steng bestillinger</Button>
          </PermissionGate>
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
          <PermissionGate
            permissions={PERMISSIONS.economy.change.sociOrderSession}
          >
            <Button onClick={handleNextStatus}>Avslutt stilletime</Button>
          </PermissionGate>
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
