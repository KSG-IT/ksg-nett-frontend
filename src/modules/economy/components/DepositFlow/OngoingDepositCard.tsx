import {
  Button,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import { IconClock } from '@tabler/icons-react'
import { OngoingDeposit } from 'modules/economy/types.graphql'
import { useCurrencyFormatter } from 'util/hooks'
import { format } from 'util/date-fns'
import { useCancelDeposit } from './useCancelDeposit'

interface OngoingDepositCardProps {
  deposit: OngoingDeposit
  onResume: () => void
}

/** A card deposit that was started but not paid. It blocks a new deposit */
export const OngoingDepositCard: React.FC<OngoingDepositCardProps> = ({
  deposit,
  onResume,
}) => {
  const { formatCurrency } = useCurrencyFormatter()
  const { cancelDeposit, cancelDepositLoading } = useCancelDeposit()
  const started = format(new Date(deposit.createdAt), "d. MMM 'kl.' HH:mm")

  return (
    <Stack gap="md">
      <Paper withBorder radius="lg" p="lg">
        <Stack gap="md">
          <Group align="flex-start" wrap="nowrap">
            <ThemeIcon size={40} radius="xl" variant="light" color="yellow">
              <IconClock size={20} />
            </ThemeIcon>
            <Stack gap={4}>
              <Title order={4}>Du har et påbegynt innskudd</Title>
              <Text size="sm" c="dimmed">
                {formatCurrency(deposit.resolvedAmount ?? 0)} på konto,{' '}
                {formatCurrency(deposit.amount)} å betale. Startet {started}.
              </Text>
            </Stack>
          </Group>
          <SimpleGrid cols={2} spacing="xs">
            <Button
              variant="default"
              loading={cancelDepositLoading}
              onClick={() => cancelDeposit(deposit.id)}
            >
              Avbryt det
            </Button>
            <Button onClick={onResume}>Fortsett</Button>
          </SimpleGrid>
        </Stack>
      </Paper>
      <Text size="sm" c="dimmed" px={4}>
        Fullfør eller avbryt det påbegynte innskuddet før du starter et nytt.
      </Text>
    </Stack>
  )
}
