import { Button, Group, TextInput } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useMemo, useState } from 'react'
import { useUserMutations } from '../mutations.hooks'
import { ME_QUERY } from '../queries'
import { UserNode } from '../types'

interface MyAddressSettingsProps {
  user: Pick<UserNode, 'studyAddress'>
}

export const MyAddressSettings: React.FC<MyAddressSettingsProps> = ({
  user,
}) => {
  const [address, setAddress] = useState(user.studyAddress)
  const [initialValue, setInitialValue] = useState(user.studyAddress)
  const { updateMyAddressLoading, updateMyAddress } = useUserMutations()

  const isDirty = useMemo(() => {
    return address !== initialValue
  }, [address, initialValue])

  async function handleUpdate() {
    await updateMyAddress({
      variables: {
        studyAddress: address,
      },
      refetchQueries: [ME_QUERY],
      onCompleted() {
        showNotification({
          title: 'Suksess',
          message: 'Adressen din er oppdatert',
        })
        setInitialValue(address)
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
      <Button
        loading={updateMyAddressLoading}
        onClick={handleUpdate}
        disabled={!isDirty}
      >
        Oppdater
      </Button>
    </Group>
  )
}
