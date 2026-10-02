import { NumberFormatter, Table } from '@mantine/core'
import { CardTable } from 'components/CardTable'
import { format } from 'util/date-fns'
import { BankAccountActivity } from '../types.graphql'

interface MyPurchasesProps {
  activities: BankAccountActivity[]
}

export const MyPurchases: React.FC<MyPurchasesProps> = ({ activities }) => {
  const rows = activities.map((activity, index) => (
    <Table.Tr key={index}>
      <Table.Td>{format(new Date(activity.timestamp), 'yy.MM.dd')}</Table.Td>
      <Table.Td>{activity.name}</Table.Td>
      <Table.Td>{activity.quantity}</Table.Td>
      <Table.Td>
        <NumberFormatter value={activity.amount} suffix=",- NOK" />
      </Table.Td>
    </Table.Tr>
  ))
  return (
    <CardTable>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Dato</Table.Th>
          <Table.Th>Type</Table.Th>
          <Table.Th>Kvantitet</Table.Th>
          <Table.Th>Kostnad</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </CardTable>
  )
}
