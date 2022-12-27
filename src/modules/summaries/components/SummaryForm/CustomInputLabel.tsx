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
    <Group position={'apart'}>
      <Title size="sm" color={'dimmed'}>
        {label}
        {description && (
          <Text size="xs" weight={'lighter'} color={'gray.6'}>
            {description}
          </Text>
        )}
      </Title>
      {children}
    </Group>
    <Divider my={'xs'} variant={'dashed'} />
  </div>
)
