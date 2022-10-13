import { createStyles, Paper, Table } from '@mantine/core'
import { IconTrash } from '@tabler/icons'
import {
  ProductOrderNode,
  SociSessionNode,
} from 'modules/economy/types.graphql'
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
  const rows = productOrders.map(productOrder => (
    <tr key={productOrder.id}>
      <td>{format(new Date(productOrder.purchasedAt), 'yyyy.MM.dd HH:mm')}</td>
      <td>{productOrder.source.user.fullName}</td>
      <td>{productOrder.orderSize}</td>
      <td>{numberWithSpaces(productOrder.product.price)},- NOK</td>
      <td>{numberWithSpaces(productOrder.cost)},- NOK</td>
      <td>{!closed && <IconTrash />}</td>
    </tr>
  ))

  const summaryRow = (
    <tr className={classes.summaryRow}>
      <td>Sum</td>
      <td></td>
      <td></td>
      <td></td>
      <td>{numberWithSpaces(sociSession.moneySpent)},- NOK</td>
      <td></td>
    </tr>
  )

  return (
    <Paper>
      <Table p="sm">
        <thead>
          <tr>
            <th>Tidsstempel</th>
            <th>Navn</th>
            <th>Antall</th>
            <th>Pris</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows}
          {summaryRow}
        </tbody>
      </Table>
    </Paper>
  )
}

const useProductOrderStyles = createStyles(theme => ({
  summaryRow: {
    fontWeight: 'bold',
    backgroundColor: theme.colors.gray[2],
  },
  tableRow: {
    td: {
      width: '120px',
    },
    'td:last-of-type': {
      textAlign: 'right',
    },
  },
}))
