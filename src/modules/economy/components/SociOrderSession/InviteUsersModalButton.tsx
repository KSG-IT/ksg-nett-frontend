import {
  Button,
  Group,
  LoadingOverlay,
  Modal,
  Stack,
  Title,
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { UserMultiSelect } from 'components/Select'
import { useSociOrderSessionMutations } from 'modules/economy/mutations.hooks'
import { useState } from 'react'

export const InviteUsersModalButton: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [users, setUsers] = useState<string[]>([])

  const { inviteUsersToOrderSession, inviteUsersToOrderSessionLoading } =
    useSociOrderSessionMutations()

  function handleInviteUsers() {
    const confirmed = confirm(
      'Er du sikker på at du vil invitere disse brukerne?'
    )
    if (!confirmed) return

    inviteUsersToOrderSession({
      variables: {
        users,
      },
      onCompleted() {
        handleClose()
      },
      onError({ message }) {
        showNotification({
          title: 'Noe gikk galt',
          message,
        })
      },
    })
  }

  function handleClose() {
    setUsers([])
    setModalOpen(false)
  }

  return (
    <>
      <Button onClick={() => setModalOpen(true)}>Inviter flere</Button>
      <Modal
        opened={modalOpen}
        title="Inviter brukere på stilletime"
        onClose={handleClose}
      >
        <Stack>
          <UserMultiSelect users={users} setUsersCallback={setUsers} />
          <Group position="right">
            <Button color="gray" onClick={handleClose}>
              Avbryt
            </Button>

            <Button onClick={handleInviteUsers}>Inviter</Button>
          </Group>
        </Stack>
        <LoadingOverlay visible={inviteUsersToOrderSessionLoading} />
      </Modal>
    </>
  )
}
