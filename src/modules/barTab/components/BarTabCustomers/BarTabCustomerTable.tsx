import { CardTable } from 'components/CardTable'
import { BarTabCustomerNode } from 'modules/barTab/types.graphql'

interface BarTabCustomerTableProps {
  barTabCustomers: BarTabCustomerNode[]
}

export const BarTabCustomerTable: React.FC<BarTabCustomerTableProps> = ({
  barTabCustomers,
}) => {
  const customerRows = barTabCustomers.map(customer => (
    <tr key={customer.id}>
      <td>{customer.name}</td>
      <td>{customer.shortName}</td>
      <td>{customer.email}</td>
    </tr>
  ))

  return (
    <CardTable>
      <thead>
        <tr>
          <th>Gjeng</th>
          <th>Kortnavn</th>
          <th>Epost for BSF kvittering</th>
        </tr>
      </thead>
      <tbody>{customerRows}</tbody>
    </CardTable>
  )
}
