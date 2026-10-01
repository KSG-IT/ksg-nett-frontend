import { Table } from '@mantine/core'
import { useQuery } from '@apollo/client'
import { CardTable } from 'components/CardTable'
import { ALL_SOCI_ORDERR_SESSION_DRINK_ORDERS_QUERY } from 'modules/economy/queries'
import { SociOrderSessionOrder } from 'modules/economy/types.graphql'
import { format } from 'util/date-fns'

export const DrinkOrdersTable: React.FC = ({}) => {
  const { data } = useQuery(ALL_SOCI_ORDERR_SESSION_DRINK_ORDERS_QUERY, {
    pollInterval: 1000,
    fetchPolicy: 'network-only',
  })

  const orders = data?.allSociOrderSessionDrinkOrders ?? []

  const rows = orders.map((order: SociOrderSessionOrder) => (
    <Table.Tr key={order.id}>
      <Table.Td>{format(new Date(order.orderedAt), 'HH:mm:ss')}</Table.Td>
      <Table.Td>{order.user.getCleanFullName}</Table.Td>
      <Table.Td>{order.product.name}</Table.Td>
      <Table.Td>{order.product.price} kr</Table.Td>
    </Table.Tr>
  ))

  return (
    <CardTable>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Tidsstempel</Table.Th>
          <Table.Th>Navn</Table.Th>
          <Table.Th>Produkt</Table.Th>
          <Table.Th>Pris</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </CardTable>
  )
}
