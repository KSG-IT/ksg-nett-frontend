import { Alert, Text } from '@mantine/core'
import { IconAlertTriangle, IconCheck, IconInfoCircle } from '@tabler/icons'

interface MessageBoxProps {
  type: 'info' | 'warning' | 'danger' | 'success'
  children: React.ReactNode
}

export const MessageBox: React.FC<MessageBoxProps> = ({ type, children }) => {
  let icon
  let color: 'blue' | 'yellow' | 'red' | 'green'

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
    case 'success':
      icon = <IconCheck />
      color = 'green'
      break
  }

  return (
    <Alert style={{ overflow: 'visible' }} color={color} icon={icon}>
      <Text>{children}</Text>
    </Alert>
  )
}
