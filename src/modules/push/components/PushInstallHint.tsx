import { Alert, List } from '@mantine/core'
import { IconDeviceMobile } from '@tabler/icons-react'

const steps = [
  'Trykk på Del-knappen i Safari.',
  'Velg «Legg til på Hjem-skjerm».',
  'Åpne KSG-nett fra Hjem-skjermen og logg inn på nytt.',
  'Slå på push-varsler her.',
]

// iOS has push only in the Home Screen app. That app has its own storage,
// separate from Safari, so the user must log in again there (step 3).
export const PushInstallHint: React.FC = () => (
  <Alert
    icon={<IconDeviceMobile />}
    title="Legg KSG-nett på Hjem-skjermen"
    color="blue"
  >
    <List type="ordered" size="sm" spacing={4}>
      {steps.map(step => (
        <List.Item key={step}>{step}</List.Item>
      ))}
    </List>
  </Alert>
)
