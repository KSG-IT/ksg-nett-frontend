import { Paper, Table } from '@mantine/core'
import { IconArrowRight } from '@tabler/icons'
import { format } from 'util/date-fns'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { numberWithSpaces } from 'util/parsing'
import { BankAccountActivity } from './types'

const ActivityCell = styled.td`
  user-select: none;
`

interface MyPurchasesProps {
  activities: BankAccountActivity[]
}

export const MyPurchases: React.VFC<MyPurchasesProps> = ({ activities }) => {
  const rows = activities.map((activity, index) => (
    <tr key={index}>
      <ActivityCell>
        {format(new Date(activity.timestamp), 'yy.MM.dd')}
      </ActivityCell>
      <ActivityCell>{activity.name}</ActivityCell>
      <ActivityCell>{activity.quantity}</ActivityCell>
      <ActivityCell>{numberWithSpaces(activity.amount)},- NOK</ActivityCell>
    </tr>
  ))
  return (
    <Paper p="md">
      <Table>
        <thead>
          <tr>
            <th>Dato</th>
            <th>Type</th>
            <th>Kvantitet</th>
            <th>Kostnad</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
      <Link to="/economy/me/purchase-history">
        Fullstendig historikk {<IconArrowRight />}
      </Link>
    </Paper>
  )
}
