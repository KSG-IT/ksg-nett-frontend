import { Stack, Switch, Text } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { usePushMutations } from '../mutations.hooks'
import { ChatNotificationSettings } from '../types.graphql'

type SettingKey = 'notifyOnChatMessage' | 'notifyOnChatAdded'

const options: { key: SettingKey; label: string }[] = [
  {
    key: 'notifyOnChatMessage',
    label: 'Når det kommer en ny melding i en chat',
  },
  { key: 'notifyOnChatAdded', label: 'Når jeg blir lagt til i en chat' },
]

interface ChatNotificationSwitchesProps {
  user: ChatNotificationSettings
}

// Account settings: they apply on every device, so they stay enabled when this
// device has push off. Each switch saves at once.
export const ChatNotificationSwitches: React.FC<
  ChatNotificationSwitchesProps
> = ({ user }) => {
  const { setChatNotifications } = usePushMutations()

  function handleChange(key: SettingKey, value: boolean) {
    const next = {
      __typename: 'UserNode' as const,
      id: user.id,
      notifyOnChatMessage: user.notifyOnChatMessage,
      notifyOnChatAdded: user.notifyOnChatAdded,
      [key]: value,
    }
    setChatNotifications({
      variables: {
        onMessage: next.notifyOnChatMessage,
        onAdded: next.notifyOnChatAdded,
      },
      optimisticResponse: {
        setChatNotifications: { user: next },
      },
      onError({ message }) {
        showNotification({ title: 'Noe gikk galt', message })
      },
    })
  }

  return (
    <Stack gap="xs">
      <Text size="sm" fw={500}>
        Send meg push-varsler
      </Text>
      {options.map(({ key, label }) => (
        <Switch
          key={key}
          label={label}
          checked={user[key]}
          onChange={event => handleChange(key, event.currentTarget.checked)}
        />
      ))}
    </Stack>
  )
}
