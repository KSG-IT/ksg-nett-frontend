import { useLazyQuery } from '@apollo/client'
import {
  Button,
  Group,
  Modal,
  Paper,
  ScrollArea,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { MessageBox } from 'components/MessageBox'
import { InternalGroupSelect } from 'components/Select'
import React, { useEffect, useState } from 'react'
import { MANAGE_USERS_DATA_QUERY } from '../queries'
import { UserManagementAddUser } from '../UserManagement'
import {
  ManageUsersDataReturns,
  ManageUsersDataVariables,
} from '../UserManagement/types'
import { UserManagementTable } from '../UserManagement/UserManagementTable'

export const ManageUsers: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [internalGroupId, setInternalGroupId] = useState('')

  const [getUserData, { data }] = useLazyQuery<
    ManageUsersDataReturns,
    ManageUsersDataVariables
  >(MANAGE_USERS_DATA_QUERY, {
    variables: {
      internalGroupId: internalGroupId,
      activeOnly: true,
    },
  })

  useEffect(() => {
    if (internalGroupId === '') return
    getUserData()
  }, [internalGroupId])

  const manageUsersData = data?.manageUsersData
  const active = manageUsersData?.activeMemberships ?? []
  const all = manageUsersData?.allMemberships ?? []

  return (
    <Stack>
      <Group position="apart">
        <Group>
          <Title order={2} color="dimmed">
            Aktive medlemskap
          </Title>
          <InternalGroupSelect
            internalGroupId={internalGroupId}
            setInternalGroupCallback={setInternalGroupId}
          />
        </Group>
        <Button color={'samfundet-red'} onClick={() => setModalOpen(true)}>
          Tilegn nytt verv
        </Button>
      </Group>
      <MessageBox type="info">
        Her har du mulighet til å administrere aktive medlemskap i gjengen din.
        Om noen tar permisjon eller blir aktiv pang er det mulig å dette direkte
        i tabellen. Om personen har fått et nytt verv f.eks Barista til KA må du
        bruke knappen over. <b>Obs!</b> Funksjonærer vil bli gitt tilgang til
        opptakssystemet her også, denne mister de når du endrer til en annen
        type
      </MessageBox>
      <UserManagementTable usersData={active} activeMemberships />

      <Title order={2} color="dimmed">
        Tidligere medlemskap
      </Title>
      <UserManagementTable usersData={all} />
      <Modal opened={modalOpen} onClose={() => setModalOpen(false)}>
        <UserManagementAddUser setModalOpen={setModalOpen} />
      </Modal>
    </Stack>
  )
}
