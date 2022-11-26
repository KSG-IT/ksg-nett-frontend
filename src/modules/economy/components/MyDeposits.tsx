import { createStyles, Text } from '@mantine/core'
import { CardTable } from 'components/CardTable'
import { format } from 'util/date-fns'
import { numberWithSpaces } from 'util/parsing'
import { DepositNode } from '../types.graphql'
import { IconCheck } from '@tabler/icons'

interface MyDepositsProps {
  deposits: DepositNode[]
}

export const MyDeposits: React.VFC<MyDepositsProps> = ({ deposits }) => {
  const { classes } = useMyDepositsStyles()
  const rows = deposits.map(deposit => (
    <tr key={deposit.id}>
      <td>{format(new Date(deposit.createdAt), 'yy.MM.dd')}</td>
      <td>
        <Text color={'samfundet-red.7'}>
          {numberWithSpaces(deposit.amount)} kr
        </Text>
      </td>
      <td align={'center'}>
        {deposit.approved ? <IconCheck color={'green'} /> : '❌'}
      </td>
    </tr>
  ))
  return (
    <CardTable className={classes.table}>
      <thead>
        <tr>
          <th>Dato</th>
          <th>Mengde</th>
          <th>
            <Text align={'center'}>Godkjent</Text>
          </th>
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
