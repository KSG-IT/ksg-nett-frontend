import { useMutation } from '@apollo/client'
import { Button, Group, Stack, Title } from '@mantine/core'
import { MessageBox } from 'components/MessageBox'
import { InternalGroupPositionSelect, UserSelect } from 'components/Select'
import { ASSIGN_NEW_INTERNAL_GROUP_POSITION_MEMBERSHIP } from 'modules/organization/mutations'
import {
  AssignNewInternalGroupPositionMembershipReturns,
  AssignNewInternalGroupPositionMembershipVariables,
  InternalGroupPositionType,
} from 'modules/organization/types.graphql'
import { MANAGE_USERS_DATA_QUERY } from 'modules/users/queries'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
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
  ] = useState<InternalGroupPositionType | null>(null)
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
        internalGroupPositionType: selectedInternalGroupPositionType,
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
      <MessageBox type="info">
        <b>Merk! </b> En person kan bare ha ett verv fra en interngjeng
        samtidig. Om du gir en person et nytt verv i en interngjeng samtidig som
        de har et gammelt et vil det gamle vervet automatisk termineres og få en
        sluttdato. Dette gjelder ikke interessegrupper.
      </MessageBox>
      <UserSelect label="Bruker" setUserCallback={setSelectedUser} />
      <InternalGroupPositionSelect
        setInternalGroupPositionCallback={setInternalGroupPositionId}
      />
      <InternalGroupPositionTypeSelect
        onChange={setSelectedInternalGroupPositionType}
      />
      <Group mt="md" position="right">
        <Button color="gray" onClick={() => setModalOpen(false)}>
          Avbryt
        </Button>
        <Button
          color="samfundet-red"
          onClick={handleAssignNewPosition}
          disabled={loading}
        >
          Lagre
        </Button>
      </Group>
    </Stack>
  )
}
