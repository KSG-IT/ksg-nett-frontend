import { Button, Checkbox, Group, Stack } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useState } from 'react'
import { useUserMutations } from '../mutations.hooks'
import { UserNode } from '../types'

export interface MyEmailSettingsProps {
  user: Pick<UserNode, 'notifyOnDeposit' | 'notifyOnQuote' | 'notifyOnShift'>
}

export const MyEmailSettings: React.FC<MyEmailSettingsProps> = ({ user }) => {
  const { notifyOnDeposit, notifyOnQuote, notifyOnShift } = user
  const [notifyOnDepositState, setNotifyOnDepositState] =
    useState(notifyOnDeposit)
  const [notifyOnQuoteState, setNotifyOnQuoteState] = useState(notifyOnQuote)
  const [notifyOnShiftState, setNotifyOnShiftState] = useState(notifyOnShift)

  const { updateMyEmailNotifications, updateMyEmailNotificationsLoading } =
    useUserMutations()

  function handleSave() {
    updateMyEmailNotifications({
      variables: {
        notifyOnDeposit: notifyOnDepositState,
        notifyOnQuote: notifyOnQuoteState,
        notifyOnShift: notifyOnShiftState,
      },
      onCompleted() {
        showNotification({
          title: 'Suksess',
          message: 'E-postinnstillinger oppdatert',
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
      <Checkbox
        label="Epost ved godkjent/underkjent innskudd"
        checked={notifyOnDepositState}
        onChange={val => val && setNotifyOnDepositState(val.target.checked)}
      />
      <Checkbox
        label="Epost når jeg blir tagget i sitat"
        checked={notifyOnQuoteState}
        onChange={val => val && setNotifyOnQuoteState(val.target.checked)}
      />
      <Checkbox
        label="Epost når jeg blir satt opp på vakt"
        checked={notifyOnShiftState}
        onChange={val => val && setNotifyOnShiftState(val.target.checked)}
      />
      <Group>
        <Button
          loading={updateMyEmailNotificationsLoading}
          onClick={handleSave}
        >
          Lagre epost innstillinger
        </Button>
      </Group>
    </Stack>
  )
}
