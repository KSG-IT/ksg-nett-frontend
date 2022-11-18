import { Badge, Button, Paper, Table } from '@mantine/core'
import { CardTable } from 'components/CardTable'
import { format } from 'util/date-fns'
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
      <td>{sociSession.getNameDisplay}</td>
      <td>{format(new Date(sociSession.createdAt), 'yyyy.MM.dd')}</td>
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
    <CardTable>
      <thead>
        <tr>
          <th>Navn</th>
          <th>Opprettet</th>
          <th>Type</th>
          <th>Status</th>
          <th>Forbruk</th>
          <th></th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </CardTable>
  )
}
