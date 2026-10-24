import { Switch } from '@mantine/core'
import { usePush } from '../hooks/usePush'
import { PushStatus } from '../util'
import { PushInstallHint } from './PushInstallHint'

const blockedText: Partial<Record<PushStatus, string>> = {
  unsupported: 'Denne nettleseren støtter ikke push-varsler.',
  denied:
    'Varsler er blokkert. Tillat varsler for KSG-nett i innstillingene på enheten.',
}

// The switch for this browser only. Other devices keep their own subscription.
export const PushDeviceSwitch: React.FC = () => {
  const { status, ready, busy, enable, disable } = usePush()

  if (status === 'needs-install') return <PushInstallHint />

  const blocked = status in blockedText

  // Not a named handler: enable() must run in the click itself (iOS)
  return (
    <Switch
      label="Push-varsler på denne enheten"
      description={blockedText[status]}
      checked={status === 'on'}
      disabled={!ready || busy || blocked}
      onChange={event => (event.currentTarget.checked ? enable() : disable())}
    />
  )
}
