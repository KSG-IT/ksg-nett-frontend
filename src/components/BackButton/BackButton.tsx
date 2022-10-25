import { Button } from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons'
import { Link } from 'react-router-dom'

interface BackButtonProps {
  to?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

export const BackButton: React.FC<BackButtonProps> = ({
  to = '',
  size = 'xs',
}) => {
  return (
    <Link to={to}>
      <Button
        color="samfundet-red"
        variant="subtle"
        leftIcon={<IconArrowLeft />}
        size={size}
      >
        Tilbake
      </Button>
    </Link>
  )
}
