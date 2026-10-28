import { Divider } from '@mantine/core'
import { PushNotificationSettings } from '../types.graphql'
import { PushDeviceSwitch } from './PushDeviceSwitch'
import { PushNotificationSwitches } from './PushNotificationSwitches'

interface PushSettingsProps {
  user: PushNotificationSettings
}

// The push section of "Mine innstillinger": this device first, then the
// account settings that decide what the server sends to all devices.
export const PushSettings: React.FC<PushSettingsProps> = ({ user }) => (
  <>
    <PushDeviceSwitch />
    <Divider />
    <PushNotificationSwitches user={user} />
  </>
)
