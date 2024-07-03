import { Badge, Stack, Text, TextProps } from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import { CardTable } from 'components/CardTable'
import React from 'react'
import { format } from 'util/date-fns'
import { BankAccountActivity } from '../../economy/types.graphql'

interface TransactionCardProps {
  activities: BankAccountActivity[]
}

export const TransactionCard: React.FC<TransactionCardProps> = ({
  activities,
}) => {
  const { classes } = useStyles()

  const rows = activities.map((transaction, index) => (
    <tr key={index}>
      <td>
        <Badge variant="outline" color={'green'}>
          {transaction.name}
        </Badge>
      </td>
      <td>
        <Text align="center">{transaction.quantity}</Text>
      </td>
      <td>
        <Text align="right" color={'samfundet-red.7'}>
          {transaction.amount} kr
        </Text>
      </td>

      <td>
        <Text align="right" color={'dimmed'}>
          {format(new Date(transaction.timestamp), 'd.MM.yy HH:mm')}
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
      <CardTable className={classes.card}>
        <thead>
          <tr className={classes.headerRow}>
            <Header>Type</Header>
            <Header align="left">Antall</Header>
            <Header align="right">Pris</Header>
            <Header align="right">Tidspunkt</Header>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </CardTable>
    </Stack>
  )
}

const useStyles = createStyles(theme => ({
  card: {
    backgroundColor: theme.colors.white,
    border: `1px solid ${theme.colors.gray[3]}`,
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
