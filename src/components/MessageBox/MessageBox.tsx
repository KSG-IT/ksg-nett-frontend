import { Alert, Text } from '@mantine/core'
import { IconAlertTriangle, IconInfoCircle } from '@tabler/icons'

interface MessageBoxProps {
  type: 'info' | 'warning' | 'danger'
  children: React.ReactNode
}

export const MessageBox: React.FC<MessageBoxProps> = ({ type, children }) => {
  let icon
  let color: 'blue' | 'yellow' | 'red'

  switch (type) {
    case 'info':
      icon = <IconInfoCircle />
      color = 'blue'
      break

    case 'warning':
      icon = <IconAlertTriangle />
      color = 'yellow'
      break
    case 'danger':
      icon = <IconAlertTriangle />
      color = 'red'
      break
  }

  return (
    <Alert style={{ overflow: 'visible' }} color={color} icon={icon}>
      <Text>{children}</Text>
    </Alert>
  )
}
