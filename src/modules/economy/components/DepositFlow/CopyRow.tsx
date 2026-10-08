import { Button, CopyButton, Group, Paper, Stack, Text } from '@mantine/core'
import { IconCheck, IconCopy } from '@tabler/icons-react'

interface CopyRowProps {
  label: string
  value: string
  children?: React.ReactNode
}

/** A value the user copies into the bank app, with an optional hint below */
export const CopyRow: React.FC<CopyRowProps> = ({ label, value, children }) => {
  return (
    <Paper withBorder radius="lg" p="lg" pr="sm">
      <Stack gap="xs">
        <Group justify="space-between" wrap="nowrap">
          <Stack gap={2} miw={0}>
            <Text size="sm" c="dimmed">
              {label}
            </Text>
            <Text fz={20} fw={800} truncate>
              {value}
            </Text>
          </Stack>
          <CopyButton value={value}>
            {({ copied, copy }) => (
              <Button
                variant="default"
                style={{ flexShrink: 0 }}
                leftSection={
                  copied ? <IconCheck size={16} /> : <IconCopy size={16} />
                }
                onClick={copy}
              >
                {copied ? 'Kopiert' : 'Kopier'}
              </Button>
            )}
          </CopyButton>
        </Group>
        {children}
      </Stack>
    </Paper>
  )
}
