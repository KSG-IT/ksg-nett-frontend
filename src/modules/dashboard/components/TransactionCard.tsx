import {
  Badge,
  Card,
  createStyles,
  Stack,
  Table,
  Text,
  TextProps,
} from '@mantine/core'
import { format } from 'date-fns'
import { UserNode } from 'modules/users/types'
import React from 'react'

const useStyles = createStyles(theme => ({
  card: {
    backgroundColor: theme.colors.white,
    borderTop: `5px solid ${theme.colors.brand}`,
  },
  tableHeader: {
    color: theme.colors.gray[7],
    textTransform: 'uppercase',
  },
  headerRow: {
    borderRadius: theme.radius.xs,
  },
}))

interface TransactionCardProps {
  user: UserNode
}

export const TransactionCard: React.FC<TransactionCardProps> = ({ user }) => {
  const { classes } = useStyles()
  const rows = user.lastTransactions.map((transaction, index) => (
    <tr key={index}>
      <td>
        <Badge variant="filled" color={'teal'}>
          {transaction.name}
        </Badge>
      </td>
      <td>
        <Text align="center">{transaction.amount}</Text>
      </td>
      <td>
        <Text align="center">{transaction.quantity}</Text>
      </td>
      <td>{format(new Date(transaction.timestamp), "d.MMM 'kl' hh:mm")}</td>
    </tr>
  ))

  const Header: React.FC<TextProps> = ({ children }) => (
    <th>
      <Text weight={800} size={'sm'} className={classes.tableHeader}>
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
