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
import { InternalGroupSelect } from 'components/Select'
import React, { useEffect, useState } from 'react'
import { UserManagementAddUser } from '../UserManagement'
import { MANAGE_USERS_DATA_QUERY } from '../UserManagement/queries'
import {
  ManageUsersDataReturns,
  ManageUsersDataVariables,
} from '../UserManagement/types'
import { UserManagementTable } from '../UserManagement/UserManagementTable'

export const ManageUsers: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [internalGroupId, setInternalGroupId] = useState('')

  const [getUserData, { error, loading, data }] = useLazyQuery<
    ManageUsersDataReturns,
    ManageUsersDataVariables
  >(MANAGE_USERS_DATA_QUERY, {
    variables: {
      internalGroupId: internalGroupId,
    },
  })

  useEffect(() => {
    if (internalGroupId === '') return
    getUserData()
  }, [internalGroupId])

  return (
    <ScrollArea style={{ width: '100%' }} p="lg">
      <Stack>
        <Title>Administrer verv </Title>
        <Paper p="md">
          <Text>Velg gjeng</Text>
          <Group position="apart">
            <Group>
              <InternalGroupSelect
                internalGroupId={internalGroupId}
                setInternalGroupCallback={setInternalGroupId}
              />
            </Group>
            <Button onClick={() => setModalOpen(true)}>Tilegn nytt verv</Button>
          </Group>
        </Paper>
        <Title order={2}>Aktive medlemskap</Title>
        <Paper p="md" my="md">
          <UserManagementTable usersData={[]} />
        </Paper>

        <Title order={2}>Tidligere medlemskap</Title>
        <Paper p="md" my="md">
          <UserManagementTable usersData={[]} />
        </Paper>

        <Modal opened={modalOpen} onClose={() => setModalOpen(false)}>
          <UserManagementAddUser setModalOpen={setModalOpen} />
        </Modal>
      </Stack>
    </ScrollArea>
  )
}
