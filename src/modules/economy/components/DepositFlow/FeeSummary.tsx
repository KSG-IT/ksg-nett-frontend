import {
  ActionIcon,
  Divider,
  Group,
  NumberFormatter,
  Paper,
  Popover,
  Stack,
  Text,
} from '@mantine/core'
import { IconInfoCircle } from '@tabler/icons-react'
import { CardDepositAmounts, StripeDepositFee } from 'modules/economy/deposit'

interface FeeSummaryProps {
  // Null while the amount is not valid
  amounts: CardDepositAmounts | null
  fee: StripeDepositFee
}

interface SummaryAmountProps {
  value: number | undefined
}

const SummaryAmount: React.FC<SummaryAmountProps> = ({ value }) => {
  if (value === undefined) return <>–</>
  return <NumberFormatter value={value} suffix=" kr" thousandSeparator=" " />
}

const FeeInfo: React.FC = () => {
  return (
    <Popover withArrow position="top-start" shadow="md">
      <Popover.Target>
        <ActionIcon size="sm" color="gray" aria-label="Om kortgebyret">
          <IconInfoCircle size={16} />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <Text size="sm">Rundet opp til nærmeste hele krone.</Text>
      </Popover.Dropdown>
    </Popover>
  )
}

export const FeeSummary: React.FC<FeeSummaryProps> = ({ amounts, fee }) => {
  const percentage = fee.percentageFee.toLocaleString('nb-NO')

  return (
    <Paper withBorder radius="lg" p="lg">
      <Stack gap="xs">
        <Group justify="space-between">
          <Text c="dimmed">Kommer på konto</Text>
          <Text fw={600}>
            <SummaryAmount value={amounts?.credit} />
          </Text>
        </Group>
        <Group justify="space-between">
          <Group gap={4}>
            <Text c="dimmed">
              Kortgebyr ({percentage} % + {fee.flatFee} kr)
            </Text>
            <FeeInfo />
          </Group>
          <Text fw={600}>
            <SummaryAmount value={amounts?.fee} />
          </Text>
        </Group>
        <Divider />
        <Group justify="space-between">
          <Text fw={600} size="lg">
            Du betaler
          </Text>
          <Text fz="lg" fw={800}>
            <SummaryAmount value={amounts?.total} />
          </Text>
        </Group>
      </Stack>
    </Paper>
  )
}
