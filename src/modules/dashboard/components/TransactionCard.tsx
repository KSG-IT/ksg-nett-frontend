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
        <Text ta="center">{transaction.quantity}</Text>
      </td>
      <td>
        <Text ta="right" c={'samfundet-red.7'}>
          {transaction.amount} kr
        </Text>
      </td>

      <td>
        <Text ta="right" c={'dimmed'}>
          {format(new Date(transaction.timestamp), 'd.MM.yy HH:mm')}
        </Text>
      </td>
    </tr>
  ))

  const Header: React.FC<TextProps & { children?: React.ReactNode }> = ({
    children,
    ...rest
  }) => (
    <th>
      <Text fw={800} size={'sm'} className={classes.tableHeader} {...rest}>
        {children}
      </Text>
    </th>
  )

  return (
    <Stack>
      <Text c={'dimmed'} fw={700} p={'xs'}>
        Siste transaksjoner
      </Text>
      <CardTable className={classes.card}>
        <thead>
          <tr className={classes.headerRow}>
            <Header>Type</Header>
            <Header ta="left">Antall</Header>
            <Header ta="right">Pris</Header>
            <Header ta="right">Tidspunkt</Header>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </CardTable>
    </Stack>
  )
}

const useStyles = createStyles({
  card: {
    backgroundColor: 'white',
    border: '1px solid var(--mantine-color-gray-3)',
    borderTop: '5px solid var(--mantine-color-brand-6)',
  },
  tableHeader: {
    color: 'var(--mantine-color-gray-7)',
    textTransform: 'uppercase',
  },
  headerRow: {
    borderRadius: 'var(--mantine-radius-xs)',
  },
})
