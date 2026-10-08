import { Button, Stack } from '@mantine/core'
import { DepositStatusNode } from 'modules/economy/types.graphql'
import { Link } from 'react-router-dom'
import { useCurrencyFormatter, useMe } from 'util/hooks'
import { DepositApproved } from './DepositApproved'
import { DepositEmailSwitch } from './DepositEmailSwitch'
import { StatusHero } from './StatusHero'
import { StatusReceipt } from './StatusReceipt'

interface BankDepositStatusProps {
  deposit: DepositStatusNode
  balance: number
}

/** A registered bank transfer waits until the economy manager approves it */
export const BankDepositStatus: React.FC<BankDepositStatusProps> = ({
  deposit,
  balance,
}) => {
  const me = useMe()
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

  const rows = [
    { label: 'Beløp', value: formatCurrency(deposit.amount) },
    { label: 'Overført', value: deposit.description },
    { label: 'Melding', value: me.getCleanFullName },
  ]

  return (
    <Stack align="center" gap="lg">
      <StatusHero tone="pending" title="Innskudd opprettet">
        En bankoverføring kan ta 1–2 virkedager før vi ser den hos oss.
      </StatusHero>
      <StatusReceipt rows={rows} />
      <DepositEmailSwitch />
      <Button component={Link} to="/economy/me" size="lg" fullWidth>
        Til Min økonomi
      </Button>
    </Stack>
  )
}
