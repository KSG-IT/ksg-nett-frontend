import { Button, Stack } from '@mantine/core'
import { DepositStatusNode } from 'modules/economy/types.graphql'
import { Link } from 'react-router-dom'
import { useCurrencyFormatter } from 'util/hooks'
import { DepositApproved } from './DepositApproved'
import { StatusHero } from './StatusHero'

interface CardDepositStatusProps {
  deposit: DepositStatusNode
  balance: number
  // `redirect_status` from Stripe: succeeded, processing or failed
  redirectStatus: string | null
}

/**
 * The webhook approves a paid deposit, usually seconds after the redirect.
 * Until then the payment shows as processing. `redirectStatus` only picks the
 * message; the money comes from the webhook.
 */
export const CardDepositStatus: React.FC<CardDepositStatusProps> = ({
  deposit,
  balance,
  redirectStatus,
}) => {
  const { formatCurrency } = useCurrencyFormatter()

  if (deposit.approved) {
    return (
      <Stack align="center" gap="lg">
        <DepositApproved deposit={deposit} balance={balance} />
        <Button component={Link} to="/economy/me" size="lg" fullWidth>
          Til Min økonomi
        </Button>
      </Stack>
    )
  }

  if (redirectStatus === 'failed') {
    return (
      <Stack align="center" gap="lg">
        <StatusHero tone="failed" title="Betalingen gikk ikke gjennom">
          Du er ikke trukket noe. Prøv et annet kort, eller bruk bankoverføring.
        </StatusHero>
        <Stack gap={4} w="100%">
          <Button component={Link} to="/economy/deposits/create" size="lg">
            Prøv igjen
          </Button>
          <Button
            component={Link}
            to="/economy/deposits/create?method=bank"
            variant="subtle"
          >
            Bruk bankoverføring
          </Button>
        </Stack>
      </Stack>
    )
  }

  const credit = formatCurrency(deposit.resolvedAmount ?? deposit.amount)

  return (
    <Stack align="center" gap="lg">
      <StatusHero tone="pending" title="Betalingen behandles">
        Det tar som regel under ett minutt. Du får {credit} på kontoen når
        banken har godkjent betalingen.
      </StatusHero>
      <Button component={Link} to="/economy/me" variant="default" fullWidth>
        Til Min økonomi
      </Button>
    </Stack>
  )
}
