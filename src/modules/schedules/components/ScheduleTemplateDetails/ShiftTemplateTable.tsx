import { Card, Table } from '@mantine/core'
import { ShiftTemplateNode } from 'modules/schedules/types.graphql'
import { parseDay } from 'modules/schedules/util'

interface ShiftTemplateTableProps {
  shiftTemplates: ShiftTemplateNode[]
}

export const ShiftTemplateTable: React.FC<ShiftTemplateTableProps> = ({
  shiftTemplates,
}) => {
  const rows = shiftTemplates.map(shiftTemplate => (
    <tr key={shiftTemplate.id}>
      <td>{parseDay(shiftTemplate.day)}</td>
      <td>{shiftTemplate.timeStart}</td>
      <td>{shiftTemplate.timeEnd}</td>
      <td>{shiftTemplate.duration}</td>
    </tr>
  ))

  return (
    <Card>
      <Table>
        <thead>
          <tr>
            <th>Dag</th>
            <th>Start</th>
            <th>Slutt</th>
            <th>Varighet</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </Card>
  )
}
