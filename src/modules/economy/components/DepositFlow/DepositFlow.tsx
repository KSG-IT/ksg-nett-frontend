import { useQuery } from '@apollo/client'
import { Center, SegmentedControl, Stack } from '@mantine/core'
import { IconBuildingBank, IconCreditCard } from '@tabler/icons-react'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { DepositMethodValues } from 'modules/economy/enums'
import { ONGOING_DEPOSIT_INTENT_QUERY } from 'modules/economy/queries'
import { OngoingDepositIntentReturns } from 'modules/economy/types.graphql'
import React, { Suspense, useState } from 'react'
import { enumHandler } from 'util/parsing'
import { BankTransferForm } from './BankTransferForm'
import { CardDepositForm } from './CardDepositForm'
import { OngoingDepositCard } from './OngoingDepositCard'

const StripePayment = React.lazy(() => import('./StripePayment'))

const methodOptions = [
  {
    value: DepositMethodValues.STRIPE,
    label: (
      <Center style={{ gap: 8 }}>
        <IconCreditCard size={18} />
        <span>Kort</span>
      </Center>
    ),
  },
  {
    value: DepositMethodValues.BANK_TRANSFER,
    label: (
      <Center style={{ gap: 8 }}>
        <IconBuildingBank size={18} />
        <span>Bankoverføring</span>
      </Center>
    ),
  },
]

interface DepositFlowProps {
  initialAmount?: number
  initialMethod?: DepositMethodValues
}

/**
 * A card deposit is created first and paid in the next step. A started card
 * deposit that is not paid blocks a new one until it is paid or cancelled.
 */
export const DepositFlow: React.FC<DepositFlowProps> = ({
  initialAmount = 200,
  initialMethod = DepositMethodValues.STRIPE,
}) => {
  const [method, setMethod] = useState(initialMethod)
  const [paying, setPaying] = useState(false)
  // Always from the server: the webhook, another tab or Min økonomi can
  // cancel or delete the started deposit while the page is not open
  const { data, loading, error } = useQuery<OngoingDepositIntentReturns>(
    ONGOING_DEPOSIT_INTENT_QUERY,
    { fetchPolicy: 'network-only' }
  )

  if (error) return <FullPageError />
  if (loading || !data) return <FullContentLoader />

  const ongoing = data.ongoingDepositIntent

  if (ongoing && paying) {
    return (
      <Suspense fallback={<FullContentLoader />}>
        <StripePayment deposit={ongoing} onCancelled={() => setPaying(false)} />
      </Suspense>
    )
  }

  if (ongoing) {
    return (
      <OngoingDepositCard deposit={ongoing} onResume={() => setPaying(true)} />
    )
  }

  return (
    <Stack gap="md">
      <SegmentedControl
        fullWidth
        size="md"
        radius="md"
        aria-label="Betalingsmåte"
        data={methodOptions}
        value={method}
        onChange={enumHandler(DepositMethodValues, setMethod)}
      />
      {method === DepositMethodValues.STRIPE ? (
        <CardDepositForm
          initialAmount={initialAmount}
          onCreated={() => setPaying(true)}
        />
      ) : (
        <BankTransferForm initialAmount={initialAmount} />
      )}
    </Stack>
  )
}
