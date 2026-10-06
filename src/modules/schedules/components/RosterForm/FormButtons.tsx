import { Button, Group } from '@mantine/core'
import { showNotification } from '@mantine/notifications'

interface FormButtonsProps {
  loading: boolean
  onCancel: () => void
}

export const FormButtons: React.FC<FormButtonsProps> = ({
  loading,
  onCancel,
}) => (
  <Group justify="flex-end" gap="xs" mt="xs">
    <Button variant="default" onClick={onCancel}>
      Avbryt
    </Button>
    <Button type="submit" loading={loading}>
      Lagre
    </Button>
  </Group>
)

export function notifyError({ message }: { message: string }) {
  showNotification({ title: 'Noe gikk galt', message, color: 'red' })
}
