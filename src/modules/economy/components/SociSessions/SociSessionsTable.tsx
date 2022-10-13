import { Badge, Button, Paper, Table } from '@mantine/core'
import { SociSessionNode } from 'modules/economy/types.graphql'
import { Link } from 'react-router-dom'
import { numberWithSpaces } from 'util/parsing'

interface SociSessionsTableProps {
  sociSessions: SociSessionNode[]
}

export const SociSessionsTable: React.FC<SociSessionsTableProps> = ({
  sociSessions,
}) => {
  const rows = sociSessions.map(sociSession => (
    <tr key={sociSession.id}>
      <td>{sociSession.name}</td>
      <td>{sociSession.type}</td>
      <td>
        <Badge color="samfundet-red">
          {sociSession.closed ? 'Stengt' : 'Åpen'}
        </Badge>
      </td>
      <td>{numberWithSpaces(sociSession.moneySpent)},- NOK</td>
      <td>
        <Link to={`${sociSession.id}`}>
          <Button color="samfundet-red">Se liste</Button>
        </Link>
      </td>
    </tr>
  ))

  return (
    <Paper>
      <Table>
        <thead>
          <tr>
            <th>Navn</th>
            <th>Type</th>
            <th>Status</th>
            <th>Forbruk</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </Paper>
  )
}
