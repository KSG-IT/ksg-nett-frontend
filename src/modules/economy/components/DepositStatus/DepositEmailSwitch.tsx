import { useQuery } from '@apollo/client'
import { Group, Paper, Switch, Text } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconMail } from '@tabler/icons-react'
import { MY_EMAIL_NOTIFICATIONS_QUERY } from 'modules/economy/queries'
import { MyEmailNotificationsReturns } from 'modules/economy/types.graphql'
import { useUserMutations } from 'modules/users/mutations.hooks'

/**
 * Offers the deposit email when it is off. approveDeposit sends it when
 * notify_on_deposit is on. The mutation needs all three flags, so the other
 * two are sent as they are.
 */
export const DepositEmailSwitch: React.FC = () => {
  const { data } = useQuery<MyEmailNotificationsReturns>(
    MY_EMAIL_NOTIFICATIONS_QUERY
  )
  const { updateMyEmailNotifications, updateMyEmailNotificationsLoading } =
    useUserMutations()

  if (!data) return null

  const { notifyOnDeposit, notifyOnQuote, notifyOnShift } = data.me

  if (notifyOnDeposit) {
    return (
      <Group gap="xs" c="green.8">
        <IconMail size={18} />
        <Text size="sm">Du får en e-post når innskuddet er godkjent.</Text>
      </Group>
    )
  }

  function handleTurnOn() {
    updateMyEmailNotifications({
      variables: { notifyOnDeposit: true, notifyOnQuote, notifyOnShift },
      refetchQueries: [MY_EMAIL_NOTIFICATIONS_QUERY],
      onError({ message }) {
        showNotification({ title: 'Noe gikk galt', message, color: 'red' })
      },
    })
  }

  return (
    <Paper withBorder radius="lg" p="lg" w="100%">
      <Switch
        size="md"
        labelPosition="left"
        label="Varsle meg på e-post"
        description="Få beskjed når innskuddet er godkjent."
        checked={false}
        disabled={updateMyEmailNotificationsLoading}
        onChange={handleTurnOn}
        styles={{ body: { justifyContent: 'space-between' } }}
      />
    </Paper>
  )
}
