import { Button, Card, Table } from '@mantine/core'
import { ScheduleTemplateNode } from 'modules/schedules/types.graphql'
import { Link } from 'react-router-dom'

interface ScheduleTemplateTableProps {
  scheduleTemplates: ScheduleTemplateNode[]
}

export const ScheduleTemplateTable: React.FC<ScheduleTemplateTableProps> = ({
  scheduleTemplates,
}) => {
  const rows = scheduleTemplates.map(scheduleTemplate => (
    <tr key={scheduleTemplate.id}>
      <td>{scheduleTemplate.name}</td>
      <td>{scheduleTemplate.schedule.name}</td>
      <td>
        <Link to={`${scheduleTemplate.id}`}>
          <Button>Endre</Button>
        </Link>
      </td>
    </tr>
  ))

  return (
    <Card>
      <Table>
        <thead>
          <tr>
            <th>Navn</th>
            <th>Vaktplan</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </Card>
  )
}
