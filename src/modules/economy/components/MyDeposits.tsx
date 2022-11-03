import { createStyles } from '@mantine/core'
import { CardTable } from 'components/CardTable'
import { format } from 'util/date-fns'
import { numberWithSpaces } from 'util/parsing'
import { DepositNode } from '../types.graphql'

interface MyDepositsProps {
  deposits: DepositNode[]
}

export const MyDeposits: React.VFC<MyDepositsProps> = ({ deposits }) => {
  const { classes } = useMyDepositsStyles()
  const rows = deposits.map(deposit => (
    <tr key={deposit.id}>
      <td>{format(new Date(deposit.createdAt), 'yy.MM.dd')}</td>
      <td>{numberWithSpaces(deposit.amount)},- NOK</td>
      <td>{deposit.approved ? '✅' : '❌'}</td>
    </tr>
  ))
  return (
    <CardTable className={classes.table}>
      <thead>
        <tr>
          <th>Dato</th>
          <th>Mengde</th>
          <th>Godkjent</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </CardTable>
  )
}

const useMyDepositsStyles = createStyles(theme => ({
  table: {
    'td:nth-child(2)': {
      textAlign: 'right',
    },
    'th:nth-child(2)': {
      textAlign: 'right',
    },
  },
}))
