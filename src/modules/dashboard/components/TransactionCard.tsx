import { Stack, Table, Text, TextProps } from '@mantine/core'
import { Badge } from 'components/Badge'
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
    <Table.Tr key={index}>
      <Table.Td>
        <Badge variant="outline" color={'green'}>
          {transaction.name}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Text ta="center">{transaction.quantity}</Text>
      </Table.Td>
      <Table.Td>
        <Text ta="right" c={'samfundet-red.7'}>
          {transaction.amount} kr
        </Text>
      </Table.Td>

      <Table.Td>
        <Text ta="right" c={'dimmed'}>
          {format(new Date(transaction.timestamp), 'd.MM.yy HH:mm')}
        </Text>
      </Table.Td>
    </Table.Tr>
  ))

  const Header: React.FC<TextProps & { children?: React.ReactNode }> = ({
    children,
    ...rest
  }) => (
    <Table.Th>
      <Text fw={800} size={'sm'} className={classes.tableHeader} {...rest}>
        {children}
      </Text>
    </Table.Th>
  )

  return (
    <Stack>
      <Text c={'dimmed'} fw={700} p={'xs'}>
        Siste transaksjoner
      </Text>
      <CardTable className={classes.card}>
        <Table.Thead>
          <Table.Tr className={classes.headerRow}>
            <Header>Type</Header>
            <Header ta="left">Antall</Header>
            <Header ta="right">Pris</Header>
            <Header ta="right">Tidspunkt</Header>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </CardTable>
    </Stack>
  )
}

const useStyles = createStyles({
  card: {
    backgroundColor: 'white',
    border: '1px solid var(--mantine-color-gray-3)',
    borderTop: '5px solid var(--mantine-color-samfundet-red-7)',
  },
  tableHeader: {
    color: 'var(--mantine-color-gray-7)',
    textTransform: 'uppercase',
  },
  headerRow: {
    borderRadius: 'var(--mantine-radius-xs)',
  },
})
