import { ActionIcon, Badge, Text } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconTrash } from '@tabler/icons-react'
import { CardTable } from 'components/CardTable'
import { format } from 'util/date-fns'
import { useCurrencyFormatter } from 'util/hooks'
import { useDepositMutations } from '../mutations.hooks'
import { MY_BANK_ACCOUNT_QUERY } from '../queries'
import { DepositNode } from '../types.graphql'
import { createStyles } from '@mantine/emotion'

interface MyDepositsProps {
  deposits: DepositNode[]
}

export const MyDeposits: React.VFC<MyDepositsProps> = ({ deposits }) => {
  const { classes } = useMyDepositsStyles()
  const { deleteDeposit } = useDepositMutations()
  const { formatCurrency } = useCurrencyFormatter()

  function handleDeleteDeposit(deposit: DepositNode) {
    if (confirm('Er du sikker på at du vil slette denne innskuddet?')) {
      deleteDeposit({
        variables: {
          id: deposit.id,
        },
        refetchQueries: [MY_BANK_ACCOUNT_QUERY],
        onCompleted() {
          showNotification({
            title: 'Suksess',
            message: 'Innskuddet ble slettet',
          })
        },
        onError({ message }) {
          showNotification({
            title: 'Noe gikk galt',
            message,
          })
        },
      })
    }
  }

  const rows = deposits.map(deposit => (
    <tr key={deposit.id}>
      <td>{format(new Date(deposit.createdAt), 'yy.MM.dd')}</td>
      <td>
        <Text color={'red'}>{formatCurrency(deposit.amount)}</Text>
      </td>
      <td>
        {deposit.resolvedAmount && (
          <Text color={'green'}>{formatCurrency(deposit.resolvedAmount)}</Text>
        )}
      </td>
      <td>
        {deposit.approved ? (
          <Badge color={'green'} variant={'filled'} size="sm">
            Godkjent
          </Badge>
        ) : (
          <Badge color={'red'} variant={'filled'} size="sm">
            Venter
          </Badge>
        )}
      </td>
      <td>
        <ActionIcon
          disabled={deposit.approved}
          onClick={() => handleDeleteDeposit(deposit)}
        >
          <IconTrash />
        </ActionIcon>
      </td>
    </tr>
  ))
  return (
    <CardTable className={classes.table}>
      <thead>
        <tr>
          <th>Dato</th>
          <th>Betalt</th>
          <th>Inn på konto</th>
          <th>
            <Text align={'center'}>Status</Text>
          </th>
          <th></th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </CardTable>
  )
}

const useMyDepositsStyles = createStyles(theme => ({
  table: {
    'td:nth-child(2)': {
      textAlign: 'right',
    },
    'th:nth-child(2)': {
      textAlign: 'right',
    },
  },
}))
