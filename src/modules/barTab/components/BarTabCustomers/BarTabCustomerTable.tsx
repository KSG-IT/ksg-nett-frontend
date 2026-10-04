import { Table } from '@mantine/core'
import { CardTable } from 'components/CardTable'
import { BarTabCustomerNode } from 'modules/barTab/types.graphql'

interface BarTabCustomerTableProps {
  barTabCustomers: BarTabCustomerNode[]
}

export const BarTabCustomerTable: React.FC<BarTabCustomerTableProps> = ({
  barTabCustomers,
}) => {
  const customerRows = barTabCustomers.map(customer => (
    <Table.Tr key={customer.id}>
      <Table.Td>{customer.name}</Table.Td>
      <Table.Td>{customer.shortName}</Table.Td>
      <Table.Td>{customer.email}</Table.Td>
    </Table.Tr>
  ))

  return (
    <CardTable>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Gjeng</Table.Th>
          <Table.Th>Kortnavn</Table.Th>
          <Table.Th>Epost for BSF kvittering</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{customerRows}</Table.Tbody>
    </CardTable>
  )
}
