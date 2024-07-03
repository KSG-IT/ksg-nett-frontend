import { Button, Text } from '@mantine/core'
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
    <tr key={invoice.id}>
      <td>{invoice.customer.name}</td>
      <td>{invoice.customer.email}</td>
      <td>{numberWithSpaces(invoice.theyOwe)},- NOK</td>
      <td>{numberWithSpaces(invoice.weOwe)},- NOK</td>
      <td>{numberWithSpaces(invoice.amount)},- NOK</td>
      <td>
        {invoice.pdf ? (
          <a href={invoice.pdf} target="_blank">
            <Button
              color="samfundet-red"
              leftIcon={<IconDownload />}
              variant="subtle"
            >
              Last ned
            </Button>
          </a>
        ) : (
          <Button
            disabled
            leftIcon={<IconFilePlus />}
            color="samfundet-red"
            variant="subtle"
          >
            Opprett
          </Button>
        )}
      </td>
      <td>
        {invoice.emailSent ? (
          <Text>Sent</Text>
        ) : (
          <Button
            leftIcon={<IconMailbox />}
            color="samfundet-red"
            variant="subtle"
            disabled={!invoice.pdf}
            onClick={() => handleSendInvoiceEmail(invoice.id)}
          >
            Send faktura på epost
          </Button>
        )}
      </td>
    </tr>
  ))

  return (
    <CardTable>
      <thead>
        <tr>
          <th>Navn</th>
          <th>Epost</th>
          <th>Hjemme</th>
          <th>Borte</th>
          <th>Differanse</th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>{invoiceRows}</tbody>
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
