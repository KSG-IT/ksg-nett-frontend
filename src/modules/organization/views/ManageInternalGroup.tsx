import { useQuery } from '@apollo/client'
import { Button, Group, Modal, Stack, Title } from '@mantine/core'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { MessageBox } from 'components/MessageBox'
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

  const { data, loading, error } = useQuery<
    ManageUsersDataReturns,
    ManageUsersDataVariables
  >(MANAGE_USERS_DATA_QUERY, {
    variables: {
      internalGroupId: internalGroupId,
      activeOnly: true,
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
      <Group position="apart">
        <Group>
          <Title order={2} color="dimmed">
            Aktive medlemskap
          </Title>
        </Group>
        <Button color={'samfundet-red'} onClick={() => setModalOpen(true)}>
          Tilegn nytt verv
        </Button>
      </Group>
      <MessageBox type="info">
        Her har du mulighet til å administrere aktive medlemskap i gjengen din.
        Om noen tar permisjon eller blir aktiv pang er det mulig å dette direkte
        i tabellen. Om personen har fått et nytt verv f.eks Barista til KA må du
        bruke knappen over.
      </MessageBox>
      <UserManagementTable
        usersData={active}
        activeMemberships
        internalGroupId={internalGroupId}
      />

      <Title order={2} color="dimmed">
        Tidligere medlemskap
      </Title>
      <UserManagementTable usersData={all} internalGroupId={internalGroupId} />
      <Modal
        title="Legg til verv"
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
      >
        <UserManagementAddUser setModalOpen={setModalOpen} />
      </Modal>
    </Stack>
  )
}
