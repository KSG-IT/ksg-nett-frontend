import { Button, Group, TextInput } from '@mantine/core'
import { UserNode } from '../types'
import { useUserMutations } from '../mutations.hooks'
import { showNotification } from '@mantine/notifications'
import { useState } from 'react'

interface MyAddressSettingsProps {
  user: Pick<UserNode, 'studyAddress'>
}

export const MyAddressSettings: React.FC<MyAddressSettingsProps> = ({
  user,
}) => {
  const [address, setAddress] = useState(user.studyAddress)
  const { updateMyAddressLoading, updateMyAddress } = useUserMutations()

  function handleUpdate() {
    updateMyAddress({
      variables: {
        studyAddress: address,
      },
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
        label="Studieadresse"
        value={address}
        onChange={event => setAddress(event.currentTarget.value)}
      />
      <Button loading={updateMyAddressLoading} onClick={handleUpdate}>
        Oppdater
      </Button>
    </Group>
  )
}
