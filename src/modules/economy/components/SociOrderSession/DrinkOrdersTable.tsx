import { useQuery } from '@apollo/client'
import { CardTable } from 'components/CardTable'
import { ALL_SOCI_ORDERR_SESSION_DRINK_ORDERS_QUERY } from 'modules/economy/queries'

export const DrinkOrdersTable: React.FC = ({}) => {
  const { data } = useQuery(ALL_SOCI_ORDERR_SESSION_DRINK_ORDERS_QUERY, {
    pollInterval: 1000,
    fetchPolicy: 'network-only',
  })

  const orders = data?.allSociOrderSessionDrinkOrders ?? []

  const rows = orders.map((order: any) => (
    <tr key={order.id}>
      <td>{order.user.getCleanFullName}</td>
      <td>{order.product.name}</td>
      <td>{order.product.price} kr</td>
    </tr>
  ))

  return (
    <CardTable>
      <thead>
        <tr>
          <th>Navn</th>
          <th>Produkt</th>
          <th>Pris</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </CardTable>
  )
}
