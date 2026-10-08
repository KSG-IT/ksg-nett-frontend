import { Stack, Text, ThemeIcon, Title } from '@mantine/core'
import { IconAlertCircle, IconCheck, IconClock } from '@tabler/icons-react'

type StatusTone = 'success' | 'pending' | 'failed'

const tones = {
  success: { color: 'green', Icon: IconCheck },
  pending: { color: 'yellow', Icon: IconClock },
  failed: { color: 'samfundet-red', Icon: IconAlertCircle },
}

interface StatusHeroProps {
  tone: StatusTone
  title: string
  children: React.ReactNode
}

export const StatusHero: React.FC<StatusHeroProps> = ({
  tone,
  title,
  children,
}) => {
  const { color, Icon } = tones[tone]

  return (
    <Stack align="center" gap="md" ta="center">
      <ThemeIcon size={88} radius={44} variant="light" color={color}>
        <Icon size={44} />
      </ThemeIcon>
      <Title order={2}>{title}</Title>
      <Text c="dimmed" maw={340}>
        {children}
      </Text>
    </Stack>
  )
}
