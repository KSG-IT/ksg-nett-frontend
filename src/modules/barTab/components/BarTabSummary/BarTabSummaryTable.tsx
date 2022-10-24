import { createStyles, Paper, Stack, Table, Title } from '@mantine/core'
import { CardTable } from 'components/CardTable'
import { BarTabCustomerData } from 'modules/barTab/types.graphql'
import { numberWithSpaces } from 'util/parsing'

interface BarTabSummaryTableProps {
  barTabCustomerData: BarTabCustomerData
}
export const BarTabSummaryTable: React.FC<BarTabSummaryTableProps> = ({
  barTabCustomerData,
}) => {
  const { classes } = useBarTabSummaryTableStyles()
  const { orders, customer, total, weOwe, debt } = barTabCustomerData

  const orderRows = orders.map(order => (
    <tr key={order.id}>
      <td>{order.getNameDisplay}</td>
      <td>{order.purchasedWhere}</td>
      <td>{order.product.name}</td>
      <td>{order.quantity}</td>
      <td>{numberWithSpaces(order.product.price)},- NOK</td>
      <td>{numberWithSpaces(order.cost)},- NOK</td>
    </tr>
  ))

  return (
    <Stack className={classes.wrapper}>
      <Title order={2}>{customer.name}</Title>
      <CardTable>
        <thead>
          <tr>
            <th>Hvem</th>
            <th>Hvor</th>
            <th>Produkt</th>
            <th>Kvantitet</th>
            <th>Pris</th>
            <th>Sum</th>
          </tr>
        </thead>
        <tbody>
          {orderRows}
          <tr className={classes.summaryRow}>
            <td>De har krysset hos oss</td>
            <td colSpan={4}></td>
            <td>{numberWithSpaces(total)},- NOK</td>
          </tr>
          <tr className={classes.summaryRow}>
            <td>Vi har krysset hos de</td>
            <td colSpan={4}></td>
            <td>-{numberWithSpaces(weOwe)},- NOK</td>
          </tr>
          <tr className={classes.summaryRow}>
            <td>Differanse</td>
            <td colSpan={4}></td>
            <td>{numberWithSpaces(debt)},- NOK</td>
          </tr>
        </tbody>
      </CardTable>
    </Stack>
  )
}

const useBarTabSummaryTableStyles = createStyles(theme => ({
  wrapper: {},
  card: {
    overflowX: 'scroll',
  },
  table: {
    tr: {
      'last-of-type:td': {
        textAlign: 'right',
      },
      'last-of-type:th': {
        textAlign: 'right',
      },
    },
  },
  summaryRow: {
    fontWeight: 'bold',
    'last-of-type:td': {
      textAlign: 'right',
    },
  },
  rightAligned: {
    textAlign: 'right',
  },
}))
