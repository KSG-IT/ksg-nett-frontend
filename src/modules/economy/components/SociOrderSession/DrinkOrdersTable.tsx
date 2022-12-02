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
    <tr key={order.id}>
      <td>{format(new Date(order.orderedAt), 'HH:mm:ss')}</td>
      <td>{order.user.getCleanFullName}</td>
      <td>{order.product.name}</td>
      <td>{order.product.price} kr</td>
    </tr>
  ))

  return (
    <CardTable>
      <thead>
        <tr>
          <th>Tidsstempel</th>
          <th>Navn</th>
          <th>Produkt</th>
          <th>Pris</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </CardTable>
  )
}
