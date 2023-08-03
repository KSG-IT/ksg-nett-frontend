import { useQuery } from '@apollo/client'
import { Button, createStyles, Group, Stack } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { useInvoiceMutations } from 'modules/barTab/mutations.hooks'
import {
  ACTIVE_BAR_TAB_QUERY,
  BAR_TAB_SUMMARY_DATA_QUERY,
} from 'modules/barTab/queries'
import {
  BarTabCustomerDataReturns,
  BarTabNode,
} from 'modules/barTab/types.graphql'
import { BarTabSummaryTable } from './BarTabSummaryTable'

interface BarTabSummaryProps {
  barTab: BarTabNode
}

export const BarTabSummary: React.FC<BarTabSummaryProps> = ({ barTab }) => {
  const { data, loading, error } = useQuery<BarTabCustomerDataReturns>(
    BAR_TAB_SUMMARY_DATA_QUERY
  )

  const { createInvoices } = useInvoiceMutations()

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const { barTabCustomerData } = data

  function handleCreateInvoices() {
    createInvoices({
      refetchQueries: [ACTIVE_BAR_TAB_QUERY],
      onCompleted() {
        showNotification({
          title: 'Suksess',
          message: 'Fakturaer opprettet',
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

  return (
    <Stack>
      <Group position="right">
        <Button color="samfundet-red" onClick={handleCreateInvoices}>
          Lagre fakturaer
        </Button>
      </Group>
      {barTabCustomerData.map(customer => (
        <BarTabSummaryTable barTabCustomerData={customer} />
      ))}
    </Stack>
  )
}
