import { Group, Stack, Text } from '@mantine/core'
import { SummaryNode } from '../types'

interface ReceiptStatsProps {
  summary: Pick<SummaryNode, 'openedCount' | 'readCount'>
}

export const ReceiptStats: React.FC<ReceiptStatsProps> = ({ summary }) => (
  <Group gap="xl">
    <Stack gap={0}>
      <Text size="sm" c="dimmed">
        Åpnet av
      </Text>
      <Text size="xl" fw={800}>
        {summary.openedCount}
      </Text>
    </Stack>
    <Stack gap={0}>
      <Text size="sm" c="dimmed">
        Lest av
      </Text>
      <Text size="xl" fw={800}>
        {summary.readCount}
      </Text>
    </Stack>
  </Group>
)
