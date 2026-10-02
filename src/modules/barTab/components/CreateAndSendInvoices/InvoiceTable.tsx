import { Button, Table, Text } from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import { showNotification } from '@mantine/notifications'
import { IconDownload, IconFilePlus, IconMailbox } from '@tabler/icons-react'
import { CardTable } from 'components/CardTable'
import { useInvoiceMutations } from 'modules/barTab/mutations.hooks'
import { ACTIVE_BAR_TAB_INVOICES_QUERY } from 'modules/barTab/queries'
import { BarTabInvoiceNode } from 'modules/barTab/types.graphql'

import { numberWithSpaces } from 'util/parsing'

interface InvoiceTableProps {
  invoices: Pick<
    BarTabInvoiceNode,
    'id' | 'amount' | 'customer' | 'weOwe' | 'theyOwe' | 'pdf' | 'emailSent'
  >[]
}

export const InvoiceTable: React.FC<InvoiceTableProps> = ({ invoices }) => {
  const { classes } = useInvoiceTableStyles()
  const { sendBarTabInvoiceEmail, sendBarTabInvoiceEmailLoading } =
    useInvoiceMutations()

  function handleSendInvoiceEmail(invoiceId: string) {
    sendBarTabInvoiceEmail({
      variables: {
        invoiceId,
      },
      refetchQueries: [ACTIVE_BAR_TAB_INVOICES_QUERY],
      onCompleted() {
        showNotification({
          title: 'Suksess',
          message: 'Faktura sendt på epost',
          color: 'green',
        })
      },
      onError({ message }) {
        showNotification({
          title: 'Noe gikk galt',
          message,
          color: 'red',
        })
      },
    })
  }

  const invoiceRows = invoices.map(invoice => (
    <Table.Tr key={invoice.id}>
      <Table.Td>{invoice.customer.name}</Table.Td>
      <Table.Td>{invoice.customer.email}</Table.Td>
      <Table.Td>{numberWithSpaces(invoice.theyOwe)},- NOK</Table.Td>
      <Table.Td>{numberWithSpaces(invoice.weOwe)},- NOK</Table.Td>
      <Table.Td>{numberWithSpaces(invoice.amount)},- NOK</Table.Td>
      <Table.Td>
        {invoice.pdf ? (
          <a href={invoice.pdf} target="_blank">
            <Button
              color="samfundet-red"
              leftSection={<IconDownload />}
              variant="subtle"
            >
              Last ned
            </Button>
          </a>
        ) : (
          <Button
            disabled
            leftSection={<IconFilePlus />}
            color="samfundet-red"
            variant="subtle"
          >
            Opprett
          </Button>
        )}
      </Table.Td>
      <Table.Td>
        {invoice.emailSent ? (
          <Text>Sent</Text>
        ) : (
          <Button
            leftSection={<IconMailbox />}
            color="samfundet-red"
            variant="subtle"
            disabled={!invoice.pdf}
            onClick={() => handleSendInvoiceEmail(invoice.id)}
          >
            Send faktura på epost
          </Button>
        )}
      </Table.Td>
    </Table.Tr>
  ))

  return (
    <CardTable>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Navn</Table.Th>
          <Table.Th>Epost</Table.Th>
          <Table.Th>Hjemme</Table.Th>
          <Table.Th>Borte</Table.Th>
          <Table.Th>Differanse</Table.Th>
          <Table.Th></Table.Th>
          <Table.Th></Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{invoiceRows}</Table.Tbody>
    </CardTable>
  )
}

const useInvoiceTableStyles = createStyles({
  wrapper: {
    width: '100%',
  },
  card: {
    overflowX: 'scroll',
  },
  summaryRow: {
    fontWeight: 'bold',
  },
})
