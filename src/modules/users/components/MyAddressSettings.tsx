import { Button, Group, TextInput } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useState } from 'react'
import { useUserMutations } from '../mutations.hooks'
import { MY_SETTINGS_QUERY } from '../queries'
import { UserNode } from '../types'

interface MyAddressSettingsProps {
  user: Pick<UserNode, 'studyAddress'>
}

export const MyAddressSettings: React.FC<MyAddressSettingsProps> = ({
  user,
}) => {
  const [address, setAddress] = useState(user.studyAddress)
  const { updateMyAddressLoading, updateMyAddress } = useUserMutations()

  const isDirty = address !== user.studyAddress

  function handleUpdate() {
    updateMyAddress({
      variables: {
        studyAddress: address,
      },
      refetchQueries: [MY_SETTINGS_QUERY],
      onCompleted() {
        showNotification({
          title: 'Suksess',
          message: 'Adressen din er oppdatert',
        })
      },
      onError({ message }) {
        showNotification({
          title: 'Noe gikk galt',
          message,
        })
      },
    })
  }

  return (
    <Group align="end">
      <TextInput
        flex={1}
        label="Studieadresse"
        value={address}
        onChange={event => setAddress(event.currentTarget.value)}
      />
      <Button
        loading={updateMyAddressLoading}
        onClick={handleUpdate}
        disabled={!isDirty}
      >
        Lagre
      </Button>
    </Group>
  )
}
