import { useQuery } from '@apollo/client'
import { Button, Drawer, Group, Modal, Stack, Title } from '@mantine/core'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { MessageBox } from 'components/MessageBox'
import { MembershipHistoryEditor } from 'modules/organization/components/MembershipHistoryEditor'
import { UserManagementAddUser } from 'modules/organization/components/UserManagement'
import { UserManagementTable } from 'modules/organization/components/UserManagement/UserManagementTable'
import {
  ManageUsersDataReturns,
  ManageUsersDataVariables,
} from 'modules/organization/types.graphql'
import { MANAGE_USERS_DATA_QUERY } from 'modules/users/queries'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

interface ManageInternalGroupParams {
  internalGroupId: string
}

export const ManageInternalGroup: React.FC = () => {
  const { internalGroupId } = useParams<
    keyof ManageInternalGroupParams
  >() as ManageInternalGroupParams
  const [modalOpen, setModalOpen] = useState(false)
  const [historyUserId, setHistoryUserId] = useState<string | null>(null)

  const { data, loading, error } = useQuery<
    ManageUsersDataReturns,
    ManageUsersDataVariables
  >(MANAGE_USERS_DATA_QUERY, {
    variables: {
      internalGroupId: internalGroupId,
    },
  })

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const { manageUsersData } = data
  const active = manageUsersData?.activeMemberships
  const all = manageUsersData?.allMemberships

  const breadcrumbs = [
    { label: 'Hjem', path: '/dashboard' },
    { label: 'Interngjengene', path: '/internal-groups' },
  ]

  return (
    <Stack>
      <Breadcrumbs items={breadcrumbs} />
      <Title>Administrer medlemskap</Title>
      <Group justify="space-between">
        <Group>
          <Title order={2} c="dimmed">
            Aktive medlemskap
          </Title>
        </Group>
        <Button color={'samfundet-red'} onClick={() => setModalOpen(true)}>
          Tilegn nytt verv
        </Button>
      </Group>
      <MessageBox type="info">
        Her administrerer du aktive medlemskap i gjengen din. Om noen tar
        permisjon eller blir aktiv pang, endrer du typen direkte i tabellen. Om
        personen har fått et nytt verv, for eksempel fra Barista til KA, bruker
        du knappen over. Feil i tidligere verv retter du med «Rediger
        vervhistorikk» i menyen på hver rad. <b>Obs!</b> Når noen blir eller
        slutter som funksjonær, endres brukertypen Funksjonær bare hvis du har
        tilgang til å endre brukertyper. Ellers må en admin gjøre det.
      </MessageBox>
      <UserManagementTable
        usersData={active}
        activeMemberships
        onEditHistory={setHistoryUserId}
      />

      <Title order={2} c="dimmed">
        Tidligere medlemskap
      </Title>
      <UserManagementTable usersData={all} onEditHistory={setHistoryUserId} />
      <Modal opened={modalOpen} onClose={() => setModalOpen(false)}>
        <UserManagementAddUser setModalOpen={setModalOpen} />
      </Modal>
      <Drawer
        opened={historyUserId !== null}
        onClose={() => setHistoryUserId(null)}
        title="Rediger vervhistorikk"
        position="right"
        size="xl"
      >
        {historyUserId && (
          <MembershipHistoryEditor
            userId={historyUserId}
            onClose={() => setHistoryUserId(null)}
          />
        )}
      </Drawer>
    </Stack>
  )
}
