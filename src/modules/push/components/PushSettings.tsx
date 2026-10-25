import { Divider } from '@mantine/core'
import { ChatNotificationSettings } from '../types.graphql'
import { ChatNotificationSwitches } from './ChatNotificationSwitches'
import { PushDeviceSwitch } from './PushDeviceSwitch'

interface PushSettingsProps {
  user: ChatNotificationSettings
}

// The push section of "Mine innstillinger": this device first, then the
// account settings that decide what the server sends to all devices.
export const PushSettings: React.FC<PushSettingsProps> = ({ user }) => (
  <>
    <PushDeviceSwitch />
    <Divider />
    <ChatNotificationSwitches user={user} />
  </>
)
