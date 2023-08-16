import { useMutation } from '@apollo/client'
import { Button, Group, Stack, Title } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { MessageBox } from 'components/MessageBox'
import { InternalGroupPositionSelect, UserSelect } from 'components/Select'
import { ASSIGN_NEW_INTERNAL_GROUP_POSITION_MEMBERSHIP } from 'modules/organization/mutations'
import {
  AssignNewInternalGroupPositionMembershipReturns,
  AssignNewInternalGroupPositionMembershipVariables,
  InternalGroupPositionType,
  InternalGroupPositionTypeOption,
} from 'modules/organization/types.graphql'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MANAGE_USERS_DATA_QUERY } from '../../../users/queries'
import { InternalGroupPositionTypeSelect } from './InternalGroupPositionTypeSelect'

interface UserManagementAddUserProps {
  setModalOpen: (open: boolean) => void
}
export const UserManagementAddUser: React.FC<UserManagementAddUserProps> = ({
  setModalOpen,
}) => {
  const [selectedUser, setSelectedUser] = useState('')
  const [internalGroupPositionId, setInternalGroupPositionId] = useState('')
  const [
    selectedInternalGroupPositionType,
    setSelectedInternalGroupPositionType,
  ] = useState<InternalGroupPositionTypeOption | null>(null)
  const history = useNavigate()

  const [assignNewPosition, { loading }] = useMutation<
    AssignNewInternalGroupPositionMembershipReturns,
    AssignNewInternalGroupPositionMembershipVariables
  >(ASSIGN_NEW_INTERNAL_GROUP_POSITION_MEMBERSHIP, {
    onCompleted() {
      setModalOpen(false)
    },
  })

  const handleAssignNewPosition = () => {
    if (selectedInternalGroupPositionType === null) return

    assignNewPosition({
      variables: {
        userId: selectedUser,
        internalGroupPositionId: internalGroupPositionId,
        internalGroupPositionType: selectedInternalGroupPositionType.value,
      },
      refetchQueries: [MANAGE_USERS_DATA_QUERY],
      onCompleted() {
        showNotification({
          title: 'Suksess',
          message: 'Brukeren har fått nytt verv',
          color: 'green',
        })
      },
      onError({ message }) {
        showNotification({
          title: 'Noe gikk galt',
          message,
          color: 'red',
        })
      },
    })
  }

  return (
    <Stack>
      <MessageBox type="info">
        <b>Merk! </b> En person kan bare ha ett verv fra en interngjeng
        samtidig. Om du gir en person et nytt verv i en interngjeng samtidig som
        de har et gammelt et vil det gamle vervet automatisk termineres og få en
        sluttdato. Dette gjelder ikke interessegrupper.
      </MessageBox>
      <UserSelect label="Bruker" setUserCallback={setSelectedUser} />
      <InternalGroupPositionSelect
        placeholder="Verv"
        onChange={setInternalGroupPositionId}
      />
      <InternalGroupPositionTypeSelect
        placeholder="Status"
        //onChange={setSelectedInternalGroupPositionType}
      />
      <Group mt="md" position="apart">
        <Button variant="outline" onClick={() => setModalOpen(false)}>
          Avbryt
        </Button>
        <Button
          color="samfundet-red"
          onClick={handleAssignNewPosition}
          disabled={loading}
        >
          Legg til
        </Button>
      </Group>
    </Stack>
  )
}
