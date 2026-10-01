import { Button, Paper, Table } from '@mantine/core'
import { IconEye } from '@tabler/icons-react'
import { CardTable } from 'components/CardTable'
import { ScheduleNode } from 'modules/schedules/types.graphql'
import { Link } from 'react-router-dom'

interface SchedulesTableProps {
  schedules: ScheduleNode[]
}

export const SchedulesTable: React.FC<SchedulesTableProps> = ({
  schedules,
}) => {
  const rows = schedules.map(schedule => (
    <Table.Tr key={schedule.id}>
      <Table.Td>{schedule.name}</Table.Td>
      <Table.Td>
        <Link to={`${schedule.id}`}>
          <Button color="samfundet-red">Se vakter</Button>
        </Link>
      </Table.Td>
      <Table.Td>
        <Button color="samfundet-red" variant="subtle" disabled>
          Gjør jobben min for meg
        </Button>
      </Table.Td>
      <Table.Td>
        <Button color="samfundet-red" variant="subtle" disabled>
          Vaktbytteforespørsler
        </Button>
      </Table.Td>
    </Table.Tr>
  ))
  return (
    <CardTable>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Navn</Table.Th>
          <Table.Th></Table.Th>
          <Table.Th></Table.Th>
          <Table.Th></Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </CardTable>
  )
}
