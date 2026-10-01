import { Stack, Table, Title } from '@mantine/core'
import { createStyles } from '@mantine/emotion'
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
    <Table.Tr key={order.id}>
      <Table.Td>{order.getNameDisplay}</Table.Td>
      <Table.Td>{order.purchasedWhere}</Table.Td>
      <Table.Td>{order.product.name}</Table.Td>
      <Table.Td>{order.quantity}</Table.Td>
      <Table.Td>{numberWithSpaces(order.product.price)},- NOK</Table.Td>
      <Table.Td>{numberWithSpaces(order.cost)},- NOK</Table.Td>
    </Table.Tr>
  ))

  return (
    <Stack className={classes.wrapper}>
      <Title order={2}>{customer.name}</Title>
      <CardTable>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Hvem</Table.Th>
            <Table.Th>Hvor</Table.Th>
            <Table.Th>Produkt</Table.Th>
            <Table.Th>Kvantitet</Table.Th>
            <Table.Th>Pris</Table.Th>
            <Table.Th>Sum</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {orderRows}
          <Table.Tr className={classes.summaryRow}>
            <Table.Td>De har krysset hos oss</Table.Td>
            <Table.Td colSpan={4}></Table.Td>
            <Table.Td>{numberWithSpaces(total)},- NOK</Table.Td>
          </Table.Tr>
          <Table.Tr className={classes.summaryRow}>
            <Table.Td>Vi har krysset hos de</Table.Td>
            <Table.Td colSpan={4}></Table.Td>
            <Table.Td>-{numberWithSpaces(weOwe)},- NOK</Table.Td>
          </Table.Tr>
          <Table.Tr className={classes.summaryRow}>
            <Table.Td>Differanse</Table.Td>
            <Table.Td colSpan={4}></Table.Td>
            <Table.Td>{numberWithSpaces(debt)},- NOK</Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </CardTable>
    </Stack>
  )
}

const useBarTabSummaryTableStyles = createStyles({
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
})
