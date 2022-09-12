import {
  Card,
  createStyles,
  Stack,
  Table,
  Text,
  TextProps,
} from '@mantine/core'
import { format } from 'date-fns'
import { UserNode } from 'modules/users'
import React from 'react'

const useStyles = createStyles(theme => ({
  card: {
    backgroundColor: theme.colors.gray[0],
  },
  tableHeader: {
    color: theme.colors.gray[8],
    textTransform: 'uppercase',
  },
  headerRow: {
    borderRadius: theme.radius.xs,
  },
}))

interface TransactionCardProps {
  user: UserNode
}

export const TransactionCard: React.VFC<TransactionCardProps> = ({ user }) => {
  const { classes } = useStyles()
  const rows = user.lastTransactions.map((transaction, index) => (
    <tr key={index}>
      <td>{transaction.name}</td>
      <td>{transaction.amount}</td>
      <td>{transaction.quantity}</td>
      <td>{format(new Date(transaction.timestamp), "'kl' hh.mm, d.MMM")}</td>
    </tr>
  ))

  const Header: React.VFC<TextProps> = ({ children }) => (
    <th>
      <Text
        weight={'bolder'}
        size={'sm'}
        pb={'xs'}
        className={classes.tableHeader}
      >
        {children}
      </Text>
    </th>
  )

  return (
    <Stack>
      <Text color={'dimmed'} weight={700} p={'xs'}>
        Siste transaksjoner
      </Text>
      <Card p={'xl'} radius={'md'} className={classes.card} withBorder>
        <Table>
          <thead>
            <tr className={classes.headerRow}>
              <Header>Gjenstand</Header>
              <Header>Pris</Header>
              <Header>Antall</Header>
              <Header>Tidspunkt</Header>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </Card>
    </Stack>
  )
}
