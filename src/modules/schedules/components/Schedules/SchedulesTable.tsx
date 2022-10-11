import { Button, Paper, Table } from '@mantine/core'
import { IconEye } from '@tabler/icons'
import { ScheduleNode } from 'modules/schedules/types.graphql'
import { Link } from 'react-router-dom'

interface SchedulesTableProps {
  schedules: ScheduleNode[]
}

export const SchedulesTable: React.FC<SchedulesTableProps> = ({
  schedules,
}) => {
  const rows = schedules.map(schedule => (
    <tr key={schedule.id}>
      <td>{schedule.name}</td>
      <td>
        <Link to={`${schedule.id}`}>
          <Button color="samfundet-red">Se vakter</Button>
        </Link>
      </td>
      <td>
        <Button color="samfundet-red" variant="subtle" disabled>
          Gjør jobben min for meg
        </Button>
      </td>
      <td>
        <Button color="samfundet-red" variant="subtle" disabled>
          Vaktbytteforespørsler
        </Button>
      </td>
    </tr>
  ))
  return (
    <Paper>
      <Table>
        <thead>
          <tr>
            <th>Navn</th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </Paper>
  )
}
