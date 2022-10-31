import { onError } from '@apollo/client/link/error'
import {
  Button,
  Group,
  LoadingOverlay,
  Modal,
  ModalProps,
  Stack,
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { MessageBox } from 'components/MessageBox'
import { UserSelect } from 'components/Select'
import { useUserTypeMutations } from 'modules/users/mutations.hooks'
import { USER_TYPE_DETAIL_QUERY } from 'modules/users/queries'
import { useState } from 'react'

interface AddUserToUserTypeModalProps extends ModalProps {
  userTypeId: string
}

export const AddUserToUserTypeModal: React.FC<AddUserToUserTypeModalProps> = ({
  userTypeId,
  opened,
  onClose,
}) => {
  const [selectedUser, setSelectedUser] = useState('')
  const { addUserToUserType, addUserToUserTypeLoading } = useUserTypeMutations()

  function handleAddUser() {
    if (!selectedUser) return
    addUserToUserType({
      variables: {
        userTypeId,
        userId: selectedUser,
      },
      refetchQueries: [USER_TYPE_DETAIL_QUERY],
      onCompleted() {
        showNotification({
          title: 'Suksess',
          message: 'Brukeren ble lagt til i brukergruppen',
          color: 'green',
        })
      },
      onError() {
        showNotification({
          title: 'Feil',
          message: 'Noe gikk galt under lagringen',
          color: 'red',
        })
      },
    }),
      onClose()
  }

  return (
    <Modal
      title="Legg til bruker"
      opened={opened}
      onClose={onClose}
      overlayBlur={5}
    >
      <Stack>
        <MessageBox type="warning">
          <b>Obs!</b> Å legge til brukere blir loggført
        </MessageBox>
        <UserSelect setUserCallback={setSelectedUser} />
        <Group position="right">
          <Button color="gray">Avbryt</Button>
          <Button color="samfundet-red" onClick={handleAddUser}>
            Legg til
          </Button>
        </Group>
      </Stack>
      <LoadingOverlay visible={addUserToUserTypeLoading} />
    </Modal>
  )
}
