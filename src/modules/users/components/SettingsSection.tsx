import { Paper, Stack, Text, Title } from '@mantine/core'

interface SettingsSectionProps {
  title: string
  description: string
  children: React.ReactNode
}

// One card on "Mine innstillinger". Each card saves on its own.
export const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  description,
  children,
}) => (
  <Paper withBorder p="lg">
    <Stack>
      <div>
        <Title order={4}>{title}</Title>
        <Text c="dimmed" size="sm">
          {description}
        </Text>
      </div>
      {children}
    </Stack>
  </Paper>
)
