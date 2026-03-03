import { Divider, Group, Text, Title } from '@mantine/core'

interface CustomInputLabelProps {
  label: string
  children: React.ReactNode
  description?: string
}
export const CustomInputLabel: React.FC<CustomInputLabelProps> = ({
  label,
  children,
  description,
}) => (
  <div style={{ maxWidth: '100%' }}>
    <Group justify={'space-between'}>
      <Title size="sm" c={'dimmed'}>
        {label}
        {description && (
          <Text size="xs" fw={'lighter'} c={'gray.6'}>
            {description}
          </Text>
        )}
      </Title>
      {children}
    </Group>
    <Divider my={'xs'} variant={'dashed'} />
  </div>
)
