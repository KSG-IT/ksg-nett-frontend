import { Button, Group, Stack, Switch } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useState } from 'react'
import { useUserMutations } from '../mutations.hooks'
import { MY_SETTINGS_QUERY } from '../queries'
import { UserNode } from '../types'

type NotificationKey = 'notifyOnDeposit' | 'notifyOnQuote' | 'notifyOnShift'

const notificationOptions: { key: NotificationKey; label: string }[] = [
  {
    key: 'notifyOnDeposit',
    label: 'Når et innskudd blir godkjent eller avvist',
  },
  { key: 'notifyOnQuote', label: 'Når jeg blir tagget i et sitat' },
  { key: 'notifyOnShift', label: 'Når jeg blir satt opp på vakt' },
]

export interface MyEmailSettingsProps {
  user: Pick<UserNode, NotificationKey>
}

export const MyEmailSettings: React.FC<MyEmailSettingsProps> = ({ user }) => {
  const { notifyOnDeposit, notifyOnQuote, notifyOnShift } = user
  const [settings, setSettings] = useState({
    notifyOnDeposit,
    notifyOnQuote,
    notifyOnShift,
  })

  const { updateMyEmailNotifications, updateMyEmailNotificationsLoading } =
    useUserMutations()

  const isDirty = notificationOptions.some(
    ({ key }) => settings[key] !== user[key]
  )

  function handleSave() {
    updateMyEmailNotifications({
      variables: settings,
      refetchQueries: [MY_SETTINGS_QUERY],
      onCompleted() {
        showNotification({
          title: 'Suksess',
          message: 'E-postvarsler oppdatert',
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
    <Stack>
      {notificationOptions.map(({ key, label }) => (
        <Switch
          key={key}
          label={label}
          checked={settings[key]}
          onChange={event =>
            setSettings({ ...settings, [key]: event.currentTarget.checked })
          }
        />
      ))}
      <Group justify="flex-end">
        <Button
          disabled={!isDirty}
          loading={updateMyEmailNotificationsLoading}
          onClick={handleSave}
        >
          Lagre
        </Button>
      </Group>
    </Stack>
  )
}
