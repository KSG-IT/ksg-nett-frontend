import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Alert, Text } from '@mantine/core'

interface MessageBoxProps {
  type: 'info' | 'warning' | 'danger'
  children: React.ReactNode
}

export const MessageBox: React.FC<MessageBoxProps> = ({ type, children }) => {
  let icon
  let color: 'blue' | 'yellow' | 'red'

  switch (type) {
    case 'info':
      icon = <FontAwesomeIcon icon="info" />
      color = 'blue'
      break

    case 'warning':
      icon = <FontAwesomeIcon icon="exclamation-triangle" />
      color = 'yellow'
      break
    case 'danger':
      icon = <FontAwesomeIcon icon="exclamation-triangle" />
      color = 'red'
      break
  }

  return (
    <Alert style={{ overflow: 'visible' }} color={color} icon={icon}>
      <Text>{children}</Text>
    </Alert>
  )
}
