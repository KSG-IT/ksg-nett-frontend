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

interface TransactionCardProps {
  user: UserNode
}

export const TransactionCard: React.FC<TransactionCardProps> = ({ user }) => {
  const { classes } = useStyles()

  const rows = user.lastTransactions.map((transaction, index) => (
    <tr key={index}>
      <td>
        <Badge variant="outline" color={'lime'}>
          {transaction.name}
        </Badge>
      </td>
      <td>
        <Text align="right">{transaction.amount},- NOK</Text>
      </td>
      <td>
        <Text align="right">{transaction.quantity}</Text>
      </td>
      <td>
        <Text align="right">
          {format(new Date(transaction.timestamp), "d.MMM 'kl' hh:mm")}
        </Text>
      </td>
    </tr>
  ))

  const Header: React.FC<TextProps> = ({ children, ...rest }) => (
    <th>
      <Text weight={800} size={'sm'} className={classes.tableHeader} {...rest}>
        {children}
      </Text>
    </th>
  )

  return (
    <Stack>
      <Text color={'dimmed'} weight={700} p={'xs'}>
        Siste transaksjoner
      </Text>
      <Card py={'xl'} radius={'md'} className={classes.card} withBorder>
        <Table>
          <thead>
            <tr className={classes.headerRow}>
              <Header>Type</Header>
              <Header align="right">Pris</Header>
              <Header align="right">Antall</Header>
              <Header align="right">Tidspunkt</Header>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </Card>
    </Stack>
  )
}

const useStyles = createStyles(theme => ({
  card: {
    backgroundColor: theme.colors.white,
    borderTop: `5px solid ${theme.colors.brand}`,
    overflowX: 'scroll',
  },
  tableHeader: {
    color: theme.colors.gray[7],
    textTransform: 'uppercase',
  },
  headerRow: {
    borderRadius: theme.radius.xs,
  },
}))
