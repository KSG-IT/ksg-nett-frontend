import { ActionIcon, Table, Text } from '@mantine/core'
import { Badge } from 'components/Badge'
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

export const MyDeposits: React.FC<MyDepositsProps> = ({ deposits }) => {
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
    <Table.Tr key={deposit.id}>
      <Table.Td>
        <Text>{format(new Date(deposit.createdAt), 'yy.MM.dd')}</Text>
      </Table.Td>
      <Table.Td>
        <Text ta="left" c={'red'}>
          {formatCurrency(deposit.amount)}
        </Text>
      </Table.Td>
      <Table.Td>
        {deposit.resolvedAmount && (
          <Text c={'green'}>{formatCurrency(deposit.resolvedAmount)}</Text>
        )}
      </Table.Td>
      <Table.Td>
        {deposit.approved ? (
          <Badge color={'green'} variant={'filled'} size="sm">
            Godkjent
          </Badge>
        ) : (
          <Badge color={'red'} variant={'filled'} size="sm">
            Venter
          </Badge>
        )}
      </Table.Td>
      <Table.Td>
        <ActionIcon
          disabled={deposit.approved}
          onClick={() => handleDeleteDeposit(deposit)}
        >
          <IconTrash />
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  ))
  return (
    <CardTable className={classes.table}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>
            <Text ta="left">Dato</Text>
          </Table.Th>
          <Table.Th>
            <Text ta="left">Betalt</Text>
          </Table.Th>
          <Table.Th>
            <Text ta="left">Inn på konto</Text>
          </Table.Th>
          <Table.Th>
            <Text ta={'center'}>Status</Text>
          </Table.Th>
          <Table.Th></Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </CardTable>
  )
}

const useMyDepositsStyles = createStyles({
  table: {
    'td:nth-of-type(2)': {
      textAlign: 'right',
    },
    'th:nth-of-type(2)': {
      textAlign: 'right',
    },
  },
})
