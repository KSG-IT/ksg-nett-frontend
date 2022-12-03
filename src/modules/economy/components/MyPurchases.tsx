import { CardTable } from 'components/CardTable'
import { format } from 'util/date-fns'
import { numberWithSpaces } from 'util/parsing'
import { BankAccountActivity } from '../types.graphql'

interface MyPurchasesProps {
  activities: BankAccountActivity[]
}

export const MyPurchases: React.VFC<MyPurchasesProps> = ({ activities }) => {
  const rows = activities.map((activity, index) => (
    <tr key={index}>
      <td>{format(new Date(activity.timestamp), 'yy.MM.dd')}</td>
      <td>{activity.name}</td>
      <td>{activity.quantity}</td>
      <td>{numberWithSpaces(activity.amount)},- NOK</td>
    </tr>
  ))
  return (
    <CardTable>
      <thead>
        <tr>
          <th>Dato</th>
          <th>Type</th>
          <th>Kvantitet</th>
          <th>Kostnad</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </CardTable>
  )
}
