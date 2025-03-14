import {
  Button,
  Group,
  LoadingOverlay,
  Modal,
  ModalProps,
  Stack,
} from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { showNotification } from '@mantine/notifications'
import { UserSelect } from 'components/Select'
import { format } from 'date-fns'
import { useState } from 'react'
import { useKnightHoodMutations } from './mutations.hooks'
import { ALL_KNIGHTHOODS_QUERY } from './queries'

interface KnightHoodAddUserModalProps extends ModalProps {}

export const KnightHoodAddUserModal: React.FC<KnightHoodAddUserModalProps> = ({
  opened,
  onClose,
}) => {
  const [selectedUser, setSelectedUser] = useState('')
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const { addUserToKnightHood, addUserToKnightHoodLoading } =
    useKnightHoodMutations()

  function handleAddUser() {
    if (!selectedUser) return
    addUserToKnightHood({
      variables: {
        userId: selectedUser,
        knightedAt: format(selectedDate ?? new Date(), 'yyyy-MM-dd'),
      },
      refetchQueries: [ALL_KNIGHTHOODS_QUERY],
      onCompleted() {
        showNotification({
          title: 'Suksess',
          message: 'Brukeren ble lagt til i Ridderordenen',
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
      title="Legg til nytt medlem"
      opened={opened}
      onClose={onClose}
      overlayProps={{
        blur: 5,
      }}
    >
      <Stack align="stretch" spacing="md">
        <UserSelect withinPortal setUserCallback={setSelectedUser} />
        <DateInput
          value={selectedDate}
          onChange={setSelectedDate}
          popoverProps={{ withinPortal: true }}
        />
        <Group position="right">
          <Button onClick={onClose} color="gray">
            Avbryt
          </Button>
          <Button color="samfundet-red" onClick={handleAddUser}>
            Legg til
          </Button>
        </Group>
      </Stack>
      <LoadingOverlay visible={addUserToKnightHoodLoading} />
    </Modal>
  )
}
