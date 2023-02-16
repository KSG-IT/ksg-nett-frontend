import { useQuery } from '@apollo/client'
import { Button, Group, Stack } from '@mantine/core'
import { IconFilePlus, IconFileX } from '@tabler/icons'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { ACTIVE_BAR_TAB_INVOICES_QUERY } from 'modules/barTab/queries'
import { ActiveBarTabInvoicesReturns } from 'modules/barTab/types.graphql'
import { InvoiceTable } from './InvoiceTable'
import {
  useBarTabMutations,
  useInvoiceMutations,
} from 'modules/barTab/mutations.hooks'
import toast from 'react-hot-toast'
import { MessageBox } from 'components/MessageBox'
import { useMemo } from 'react'

export const CreateAndSendInvoices: React.FC = ({}) => {
  const { data, loading, error } = useQuery<ActiveBarTabInvoicesReturns>(
    ACTIVE_BAR_TAB_INVOICES_QUERY
  )
  const bsfFinishedDisabled = useMemo(() => {
    if (!data) return true

    const invoicesNotSent = data.activeBarTab.invoices.filter(
      invoice => !invoice.emailSent
    )

    return invoicesNotSent.length > 0
  }, [data])

  const { generatePdf, generatePdfLoading, deleteActiveBarTabPdfs } =
    useInvoiceMutations()

  const { finalizeBarTab, finalizeBarTabLoading } = useBarTabMutations()

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  function handleGeneratePdf() {
    generatePdf({
      refetchQueries: [ACTIVE_BAR_TAB_INVOICES_QUERY],
      onError() {
        toast.error('Noe gikk galt')
      },
      onCompleted() {
        toast.success('Fakturaer opprettet')
      },
    })
  }

  function handleDeletePdf() {
    deleteActiveBarTabPdfs({
      refetchQueries: [ACTIVE_BAR_TAB_INVOICES_QUERY],
      onError() {
        toast.error('Noe gikk galt')
      },
      onCompleted() {
        toast.success('Fakturaer slettet')
      },
    })
  }

  function handleFinalizeBarTab() {
    finalizeBarTab({
      refetchQueries: [ACTIVE_BAR_TAB_INVOICES_QUERY],
      onError() {
        toast.error('Noe gikk galt')
      },
      onCompleted() {
        toast.success('BSF avsluttet')
      },
    })
  }

  const { activeBarTab } = data

  return (
    <Stack>
      <Group position="right">
        <Button
          leftIcon={<IconFilePlus />}
          onClick={handleGeneratePdf}
          loading={generatePdfLoading}
        >
          Opprett PDF'er
        </Button>
        <Button leftIcon={<IconFileX />} onClick={handleDeletePdf}>
          Slett PDFer
        </Button>
      </Group>
      <MessageBox type="warning">
        <b>Obs!</b> Om du har sent ut en faktura på epost er det ikke lenger
        mulig å slette den genererte PDF'en.
      </MessageBox>
      <InvoiceTable invoices={activeBarTab.invoices} />
      <MessageBox type="info">
        Det er ikke mulig å avslutte BSF før epost har blitt sent ut til hver
        enkelt gjeng
      </MessageBox>
      <Button
        disabled={bsfFinishedDisabled}
        loading={finalizeBarTabLoading}
        onClick={handleFinalizeBarTab}
      >
        BSF er ferdig
      </Button>
    </Stack>
  )
}
