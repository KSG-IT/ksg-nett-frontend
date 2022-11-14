import { Button, ButtonProps, Group } from '@mantine/core'
import { PermissionGate } from 'components/PermissionGate'
import { Link } from 'react-router-dom'
import { PERMISSIONS } from 'util/permissions'
import { PendingQuotesButton } from './PendingQuotesButton'

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
      <PermissionGate permissions={PERMISSIONS.quotes.change.quote}>
        <PendingQuotesButton to="/quotes/review" />
      </PermissionGate>
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
