import { Text } from '@mantine/core'
import { DepositStatusNode } from 'modules/economy/types.graphql'
import { format } from 'util/date-fns'
import { useCurrencyFormatter } from 'util/hooks'
import { StatusHero } from './StatusHero'
import { StatusReceipt } from './StatusReceipt'

interface DepositApprovedProps {
  deposit: DepositStatusNode
  balance: number
}

export const DepositApproved: React.FC<DepositApprovedProps> = ({
  deposit,
  balance,
}) => {
  const { formatCurrency } = useCurrencyFormatter()
  const credit = deposit.resolvedAmount ?? deposit.amount
  const rows = [{ label: 'Betalt', value: formatCurrency(deposit.amount) }]
  if (deposit.approvedAt) {
    rows.push({
      label: 'Godkjent',
      value: format(new Date(deposit.approvedAt), "d. MMM 'kl.' HH:mm"),
    })
  }

  return (
    <>
      <StatusHero
        tone="success"
        title={`${formatCurrency(credit)} er lagt til`}
      >
        Du har nå{' '}
        <Text span fw={700} c="var(--mantine-color-text)">
          {formatCurrency(balance)}
        </Text>{' '}
        på Soci-kontoen.
      </StatusHero>
      <StatusReceipt rows={rows} />
    </>
  )
}
