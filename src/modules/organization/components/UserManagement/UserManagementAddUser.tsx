import { useMutation } from '@apollo/client'
import { Button, Group, Stack, Title } from '@mantine/core'
import { InternalGroupPositionSelect, UserSelect } from 'components/Select'
import { ASSIGN_NEW_INTERNAL_GROUP_POSITION_MEMBERSHIP } from 'modules/organization/mutations'
import {
  AssignNewInternalGroupPositionMembershipReturns,
  AssignNewInternalGroupPositionMembershipVariables,
  InternalGroupPositionTypeOption,
} from 'modules/organization/types.graphql'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { MANAGE_USERS_DATA_QUERY } from '../../../users/queries'
import { InternalGroupPositionTypeSelect } from './InternalGroupPositionTypeSelect'

interface UserManagementAddUserProps {
  setModalOpen: (open: boolean) => void
}
export const UserManagementAddUser: React.VFC<UserManagementAddUserProps> = ({
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

    console.log(selectedInternalGroupPositionType)

    assignNewPosition({
      variables: {
        userId: selectedUser,
        internalGroupPositionId: internalGroupPositionId,
        internalGroupPositionType: selectedInternalGroupPositionType.value,
      },
      refetchQueries: [MANAGE_USERS_DATA_QUERY],
      onError() {
        toast.error('Noe gikk galt')
      },
      onCompleted() {
        toast.success('Bruker oppdatert!')
      },
    })
  }

  return (
    <Stack>
      <Title>Gi bruker nytt verv</Title>
      <label>Bruker</label>
      <UserSelect setUserCallback={setSelectedUser} />
      <label>Verv</label>
      <InternalGroupPositionSelect
        setInternalGroupPositionCallback={setInternalGroupPositionId}
      />
      <label>Type</label>
      <InternalGroupPositionTypeSelect
        selected={selectedInternalGroupPositionType}
        onChange={setSelectedInternalGroupPositionType}
      />
      <Group mt="md" position="right">
        <Button color="gray" onClick={() => setModalOpen(false)}>
          Avbryt
        </Button>
        <Button onClick={handleAssignNewPosition} disabled={loading}>
          Lagre
        </Button>
      </Group>
    </Stack>
  )
}
