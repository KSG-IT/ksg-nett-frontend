import { Table, UnstyledButton } from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import { showNotification } from '@mantine/notifications'
import { IconTrash } from '@tabler/icons-react'
import { CardTable } from 'components/CardTable'
import { useProductOrderMutations } from 'modules/economy/mutations.hooks'
import { SOCI_SESSION_QUERY } from 'modules/economy/queries'
import { SociSessionNode } from 'modules/economy/types.graphql'
import { ME_QUERY } from 'modules/users/queries'
import { format } from 'util/date-fns'
import { numberWithSpaces } from 'util/parsing'

interface ProductOrderTableProps {
  sociSession: Pick<
    SociSessionNode,
    'id' | 'productOrders' | 'closed' | 'moneySpent'
  >
}
export const ProductOrderTable: React.FC<ProductOrderTableProps> = ({
  sociSession,
}) => {
  const { classes } = useProductOrderStyles()
  const { productOrders, closed } = sociSession

  const { undoProductOrder } = useProductOrderMutations()

  const handleUndoProductOrder = (productOrderId: string) => {
    undoProductOrder({
      variables: {
        id: productOrderId,
      },
      refetchQueries: [SOCI_SESSION_QUERY, ME_QUERY],
      onError({ message }) {
        showNotification({
          title: 'Noe gikk galt',
          message,
        })
      },
      onCompleted() {
        showNotification({
          title: 'Suksess',
          message: 'Bestillingen ble reversert',
        })
      },
    })
  }

  const rows = productOrders.map(productOrder => (
    <Table.Tr key={productOrder.id}>
      <Table.Td>
        {format(new Date(productOrder.purchasedAt), 'yyyy.MM.dd HH:mm')}
      </Table.Td>
      <Table.Td>{productOrder.source.user.fullName}</Table.Td>
      <Table.Td>{productOrder.product.name}</Table.Td>
      <Table.Td>{productOrder.orderSize}</Table.Td>
      <Table.Td>{numberWithSpaces(productOrder.product.price)},- NOK</Table.Td>
      <Table.Td>{numberWithSpaces(productOrder.cost)},- NOK</Table.Td>
      <Table.Td>
        {!closed && (
          <UnstyledButton
            onClick={() => handleUndoProductOrder(productOrder.id)}
          >
            <IconTrash />
          </UnstyledButton>
        )}
      </Table.Td>
    </Table.Tr>
  ))

  const summaryRow = (
    <Table.Tr className={classes.summaryRow}>
      <Table.Td>Sum</Table.Td>
      <Table.Td></Table.Td>
      <Table.Td></Table.Td>
      <Table.Td></Table.Td>
      <Table.Td></Table.Td>
      <Table.Td>{numberWithSpaces(sociSession.moneySpent)},- NOK</Table.Td>
      <Table.Td></Table.Td>
    </Table.Tr>
  )

  return (
    <CardTable>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Tidsstempel</Table.Th>
          <Table.Th>Navn</Table.Th>
          <Table.Th>Vare</Table.Th>
          <Table.Th>Antall</Table.Th>
          <Table.Th>Pris</Table.Th>
          <Table.Th>Total</Table.Th>
          <Table.Th></Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {rows}
        {summaryRow}
      </Table.Tbody>
    </CardTable>
  )
}

const useProductOrderStyles = createStyles({
  summaryRow: {
    fontWeight: 'bold',
    backgroundColor: 'var(--mantine-color-gray-2)',
  },
  tableRow: {
    td: {
      width: '120px',
    },
    'td:last-of-type': {
      textAlign: 'right',
    },
  },
})
