import { Button, Card, Table } from '@mantine/core'
import { CardTable } from 'components/CardTable'
import { ScheduleTemplateNode } from 'modules/schedules/types.graphql'
import { Link } from 'react-router-dom'

interface ScheduleTemplateTableProps {
  scheduleTemplates: ScheduleTemplateNode[]
}

export const ScheduleTemplateTable: React.FC<ScheduleTemplateTableProps> = ({
  scheduleTemplates,
}) => {
  const rows = scheduleTemplates.map(scheduleTemplate => (
    <Table.Tr key={scheduleTemplate.id}>
      <Table.Td>{scheduleTemplate.name}</Table.Td>
      <Table.Td>{scheduleTemplate.schedule.name}</Table.Td>
      <Table.Td>
        <Link to={`${scheduleTemplate.id}`}>
          <Button color="samfundet-red">Endre</Button>
        </Link>
      </Table.Td>
    </Table.Tr>
  ))

  return (
    <CardTable>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Navn</Table.Th>
          <Table.Th>Vaktplan</Table.Th>
          <Table.Th></Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </CardTable>
  )
}
