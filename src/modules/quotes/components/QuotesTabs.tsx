import { Button, ButtonProps, Group } from '@mantine/core'
import { Link, useNavigate, useParams } from 'react-router-dom'

interface LinkButtonProps extends ButtonProps {
  to: string
  children: React.ReactNode
}

const LinkButton: React.FC<LinkButtonProps> = ({ to, children, variant }) => (
  <Button
    color={'samfundet-red'}
    component={Link}
    to={`/quotes/${to}`}
    variant={variant}
  >
    {children}
  </Button>
)

export const QuotesTabs: React.FC = () => {
  return (
    <Group>
      <LinkButton variant="outline" to="review">
        Innsendt
      </LinkButton>
      <LinkButton unstyled variant="subtle" to="popular">
        Populær
      </LinkButton>
      <LinkButton variant="subtle" to="">
        Alle
      </LinkButton>
      <LinkButton variant="filled" to="create">
        Send inn
      </LinkButton>
    </Group>
  )
}
