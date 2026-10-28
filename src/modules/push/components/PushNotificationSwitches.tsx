import { Stack, Switch, Text } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useChatEnabled } from 'modules/chat/hooks/useChatEnabled'
import { usePushMutations } from '../mutations.hooks'
import {
  PushNotificationSettings,
  PushSettingKey,
  SetPushSettingsVariables,
} from '../types.graphql'

interface PushOption {
  key: PushSettingKey
  argument: keyof SetPushSettingsVariables
  label: string
  chat?: boolean
}

const options: PushOption[] = [
  {
    key: 'notifyOnChatMessage',
    argument: 'onChatMessage',
    label: 'Når det kommer en ny melding i en chat',
    chat: true,
  },
  {
    key: 'notifyOnChatAdded',
    argument: 'onChatAdded',
    label: 'Når jeg blir lagt til i en chat',
    chat: true,
  },
  {
    key: 'pushOnDeposit',
    argument: 'onDeposit',
    label: 'Når et innskudd blir godkjent',
  },
  {
    key: 'pushOnShift',
    argument: 'onShift',
    label: 'Når jeg blir satt på vakt',
  },
  {
    key: 'pushOnOrderSession',
    argument: 'onOrderSession',
    label: 'Når burgerlista til stilletimen er åpen',
  },
  { key: 'pushOnQuote', argument: 'onQuote', label: 'Når jeg blir sitert' },
]

// The fields that setPushSettings returns, for the optimistic response
function pushSettingsOf(user: PushNotificationSettings) {
  const settings = Object.fromEntries(
    options.map(({ key }) => [key, user[key]])
  ) as Record<PushSettingKey, boolean>
  return { __typename: 'UserNode' as const, id: user.id, ...settings }
}

interface PushNotificationSwitchesProps {
  user: PushNotificationSettings
}

// Account settings: they apply on every device, so they stay enabled when this
// device has push off. Each switch saves at once. The chat switches show only
// when the chat is on.
export const PushNotificationSwitches: React.FC<
  PushNotificationSwitchesProps
> = ({ user }) => {
  const { setPushSettings } = usePushMutations()
  const { enabled: chatEnabled } = useChatEnabled()
  const shown = options.filter(option => chatEnabled || !option.chat)

  function handleChange({ key, argument }: PushOption, value: boolean) {
    setPushSettings({
      variables: { [argument]: value },
      optimisticResponse: {
        setPushSettings: { user: { ...pushSettingsOf(user), [key]: value } },
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
      {shown.map(option => (
        <Switch
          key={option.key}
          label={option.label}
          checked={user[option.key]}
          onChange={event => handleChange(option, event.currentTarget.checked)}
        />
      ))}
    </Stack>
  )
}
