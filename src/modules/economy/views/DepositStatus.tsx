import { useQuery } from '@apollo/client'
import { Box, Container } from '@mantine/core'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import {
  BankDepositStatus,
  CardDepositStatus,
} from '../components/DepositStatus'
import { DepositMethodValues } from '../enums'
import { DEPOSIT_STATUS_QUERY } from '../queries'
import { DepositStatusReturns, DepositStatusVariables } from '../types.graphql'

const breadcrumbItems = [
  { label: 'Hjem', path: '/dashboard' },
  { label: 'Min økonomi', path: '/economy/me' },
  { label: 'Innskudd', path: '/economy/deposits/create' },
]

const POLL_INTERVAL_MS = 2000

/** Stripe redirects here after a card payment, and the bank form after save */
const DepositStatus: React.FC = () => {
  const { depositId = '' } = useParams()
  const [searchParams] = useSearchParams()
  const redirectStatus = searchParams.get('redirect_status')
  const { data, loading, error, startPolling, stopPolling } = useQuery<
    DepositStatusReturns,
    DepositStatusVariables
  >(DEPOSIT_STATUS_QUERY, { variables: { id: depositId } })

  const deposit = data?.deposit
  // Wait for the webhook to approve a paid card deposit
  const waitingForWebhook =
    deposit?.depositMethod === DepositMethodValues.STRIPE &&
    !deposit.approved &&
    redirectStatus !== 'failed'

  useEffect(() => {
    if (!waitingForWebhook) return
    startPolling(POLL_INTERVAL_MS)
    return () => stopPolling()
  }, [waitingForWebhook, startPolling, stopPolling])

  if (error) return <FullPageError />
  if (loading || !data) return <FullContentLoader />
  if (!deposit) return <FullPageError />

  return (
    <Container size={480} py="md">
      <Breadcrumbs items={breadcrumbItems} />
      <Box mt="xl">
        {deposit.depositMethod === DepositMethodValues.STRIPE ? (
          <CardDepositStatus
            deposit={deposit}
            balance={data.me.balance}
            redirectStatus={redirectStatus}
          />
        ) : (
          <BankDepositStatus deposit={deposit} balance={data.me.balance} />
        )}
      </Box>
    </Container>
  )
}

export default DepositStatus
