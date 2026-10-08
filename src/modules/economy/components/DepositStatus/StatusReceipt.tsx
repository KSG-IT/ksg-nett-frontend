import { Group, Paper, Stack, Text } from '@mantine/core'

export interface ReceiptRow {
  label: string
  value: string
}

interface StatusReceiptProps {
  rows: ReceiptRow[]
}

export const StatusReceipt: React.FC<StatusReceiptProps> = ({ rows }) => {
  return (
    <Paper withBorder radius="lg" p="lg" w="100%">
      <Stack gap="xs">
        {rows.map(({ label, value }) => (
          <Group key={label} justify="space-between">
            <Text size="sm" c="dimmed">
              {label}
            </Text>
            <Text size="sm" fw={600}>
              {value}
            </Text>
          </Group>
        ))}
      </Stack>
    </Paper>
  )
}
