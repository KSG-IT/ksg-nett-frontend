import {
  Container,
  Group,
  NumberFormatter,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { useSearchParams } from 'react-router-dom'
import { useMe } from 'util/hooks'
import { DepositFlow } from '../components/DepositFlow'
import { DepositMethodValues } from '../enums'

const breadcrumbItems = [
  { label: 'Hjem', path: '/dashboard' },
  { label: 'Min økonomi', path: '/economy/me' },
  { label: 'Innskudd', path: '/economy/deposits/create' },
]

export const CreateDeposit: React.FC = () => {
  const me = useMe()
  const [searchParams] = useSearchParams()
  // The failed card payment page links here with ?method=bank
  const initialMethod =
    searchParams.get('method') === 'bank'
      ? DepositMethodValues.BANK_TRANSFER
      : DepositMethodValues.STRIPE

  return (
    <Container size={480} py="md">
      <Breadcrumbs items={breadcrumbItems} />
      <Stack gap="md" mt="sm">
        <Title order={2}>Fyll på konto</Title>
        <Group justify="space-between" px={4}>
          <Text size="sm" c="dimmed">
            Saldo nå
          </Text>
          <Text fw={600}>
            <NumberFormatter
              value={me.balance}
              suffix=" kr"
              thousandSeparator=" "
            />
          </Text>
        </Group>
        <DepositFlow initialMethod={initialMethod} />
      </Stack>
    </Container>
  )
}
